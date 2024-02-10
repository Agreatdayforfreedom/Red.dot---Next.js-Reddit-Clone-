"use server";
import { z } from "zod";

import { LoginSchema } from "@/schemas/login";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { RegisterSchema } from "@/schemas/register";
import { db } from "./db";
import type { RawThread } from "@/types";
import { formatRaw } from "./format-raw";
import { Prisma } from "@prisma/client";
import { ThreadChildSchema, ThreadSchema } from "../schemas/thread";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function login(
  values: z.infer<typeof LoginSchema>,
  REDIRECT: string
) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid data" };
  }

  const { email, password } = validatedFields.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email and/or password" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
}

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid data" };
  }
  const { email, name, password } = validatedFields.data;
  if (await getUser(email)) {
    return { error: "The email has already been registered " };
  }

  await db.user.create({ data: { email, name, password } });

  return { success: "Registered successfully!" };
}

async function getUser(email: string) {
  return await db.user.findUnique({ where: { email } });
}

/**
 *
 * @returns all posts with parent_id = null
 */
export async function getNullThreads() {
  return await db.thread.findMany({
    include: {
      user: true,
      likes: true,
    },
    where: {
      parent_id: null,
    },
  });
}

/**
 * get parent(parent_id = null) and its childs
 *
 */
export async function getThread(id: string, userId: string) {
  // console.log(typeof id);
  const raw: RawThread[] = await db.$queryRaw`
    SELECT
      nlevel(t.node_path) as deep,
      t.title,
      t.content,
      t.parent_id,
      t.id,
      t.node_path,
      t.created_at,
      t.updated,
      t.deleted,
      u.id as user_id,
      u.image as user_image,
      u.name as user_name,
      COUNT(l.*) as totalLikes,
      EXISTS(SELECT * FROM saved s WHERE s."threadId" = t.id AND s."userId" = ${Prisma.raw(
        `'${userId}'`
      )}) AS saved,
      EXISTS(SELECT * FROM likes ll WHERE ll."threadId" = t.id AND ll."userId" = ${Prisma.raw(
        `'${userId}'`
      )}) AS liked
      FROM thread t 
      LEFT JOIN "user" AS u ON u.id = t."userId"
      LEFT JOIN likes AS l ON l."threadId" = t.id 
      WHERE t.node_path <@ ${Prisma.raw(`'${id}'`)} GROUP BY t.id, u.id;`;
  return formatRaw(raw);
}

export async function newSubThread(
  values: Omit<z.infer<typeof ThreadChildSchema>, "id">,
  userId: string
) {
  const validatedFields = ThreadChildSchema.safeParse(values);
  if (!validatedFields.success) {
    return { message: "Something went wrong!" };
  }
  const { content, parent_id, title } = validatedFields.data;
  //TODO: validate if user exists

  try {
    await db.thread.create({
      data: {
        content,
        title: "static title",
        parent_id,
        userId,
      },
    });
    revalidatePath("/thread/[id]");
  } catch (error) {
    console.log(error);
  }
}

export async function updateSubThread(
  values: Omit<z.infer<typeof ThreadChildSchema>, "parent_id">,
  userId: string
) {
  const validatedFields = ThreadChildSchema.required({ id: true })
    .omit({ parent_id: true })
    .safeParse(values);
  if (!validatedFields.success) {
    return { message: "Something went wrong!" };
  }

  const { content, id } = validatedFields.data;
  try {
    const userExists = await getUserById(userId);
    const threadExists = await getThreadById(id);

    if (!userExists || !threadExists) {
      return { error: "Invalid data" };
    }

    if (threadExists.userId !== userExists.id) {
      return { error: "Permission denied" };
    }
    await db.thread.update({
      where: {
        id,
        userId,
      },
      data: {
        content,
      },
    });
    revalidatePath("/thread/[id]");
  } catch (error) {
    console.log(error);
  }
}

export async function deleteThread(userId: string, id: string) {
  try {
    const userExists = await getUserById(userId);
    const threadExists = await getThreadById(id);

    if (!userExists || !threadExists) {
      return { error: "Invalid data" };
    }

    if (threadExists.userId !== userExists.id) {
      return { error: "Permission denied" };
    }
    await db.thread.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    });
    revalidatePath("/thread/[id]");
  } catch (error) {
    console.log(error);
  }
}

export async function getNullThread(id: string) {
  return await db.thread.findUnique({
    where: {
      id,
      parent_id: null,
    },
  });
}

export async function createPost(
  values: Partial<z.infer<typeof ThreadSchema>>,
  userId: string
) {
  const validatedFields = ThreadSchema.partial({ id: true }).safeParse(values);
  if (!validatedFields.success) {
    return { message: "Invalid data" };
  }

  const { content, title, parent_id } = validatedFields.data;
  let redirectId: string = "";
  try {
    const userExists = await getUserById(userId);

    if (!userExists) {
      return { error: "Invalid data" };
    }

    const res = await db.thread.create({
      data: {
        content,
        title,
        parent_id,
        userId,
      },
    });

    redirectId = res.id;
  } catch (error) {
    console.log(error);
  }
  if (redirectId) redirect(`/thread/${redirectId}`);
}

export async function updatePost(
  values: Partial<z.infer<typeof ThreadSchema>>,
  userId: string
) {
  const validatedFields = ThreadSchema.required({ id: true }).safeParse(values);

  if (!validatedFields.success) {
    return { message: "Invalid fields" };
  }
  const { content, id, title } = validatedFields.data;
  let redirectId: string = "";
  try {
    const userExists = await getUserById(userId);
    const threadExists = await getThreadById(id);

    if (!userExists || !threadExists) {
      return { error: "Invalid data" };
    }

    if (threadExists.userId !== userExists.id) {
      return { error: "Permission denied" };
    }
    const res = await db.thread.update({
      where: {
        id,
        userId,
      },
      data: {
        content,
        title,
      },
    });
    redirectId = res.id;
  } catch (error) {
    console.log(error);
  }
  if (redirectId) redirect(`/thread/${redirectId}`);
}

async function getUserById(id: string) {
  return await db.user.findUnique({ where: { id } });
}
async function getThreadById(id: string) {
  return await db.thread.findUnique({ where: { id } });
}

export async function like(threadId: string, userId: string) {
  try {
    const threadLiked = await db.likes.findFirst({
      where: {
        threadId,
        userId,
      },
    });
    if (threadLiked) {
      //unlike
      await db.likes.delete({
        where: {
          id: threadLiked.id,
        },
      });
    } else {
      await db.likes.create({
        data: {
          threadId,
          userId,
        },
      });
    }

    revalidateTag(`/thread/[id]`);
  } catch (error) {
    console.log(error);
  }
}
export async function saveThread(threadId: string, userId: string) {
  try {
    await db.saved.create({
      data: {
        threadId,
        userId,
      },
    });
    revalidatePath("/thread/[id]");
    return { success: true };
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedThread(id: string, revalidate: string) {
  try {
    await db.saved.delete({
      where: {
        id,
      },
    });

    revalidatePath(revalidate);
  } catch (error) {
    console.log(error);
  }
}

export async function getThreadsSaved(userId: string) {
  return await db.saved.findMany({
    include: {
      thread: {
        include: {
          user: true,
        },
      },
    },
    where: {
      userId,
    },
  });
}
