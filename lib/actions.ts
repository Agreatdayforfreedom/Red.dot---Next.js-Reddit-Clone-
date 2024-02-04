"use server";
import { z } from "zod";

import { LoginSchema } from "@/schemas/login";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { RegisterSchema } from "@/schemas/register";
import { db } from "./db";
import type { RawThread } from "@/types";
import { formatRaw } from "./format-raw";
import { Prisma } from "@prisma/client";
import { ThreadChildSchema, ThreadSchema } from "../schemas/thread";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid data" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
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
export async function getThread(id: string) {
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
      u.name as user_name
      FROM thread t LEFT JOIN "user" AS u ON u.id = t."userId"
      WHERE t.node_path <@ ${Prisma.raw(`'${id}'`)};`;
  return formatRaw(raw);
}

export async function newSubThread(
  values: Omit<z.infer<typeof ThreadChildSchema>, "id">,
  userId: string,
  revalidate: string
) {
  const validatedFields = ThreadChildSchema.safeParse(values);
  console.log(validatedFields);
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
    revalidatePath(revalidate);
  } catch (error) {
    console.log(error);
  }
}

// async function getThreadByOwner(threadId, userId) {
//   where: {
//     id: threadId
//     userId
//   }
// }

export async function updateSubThread(
  values: Omit<z.infer<typeof ThreadChildSchema>, "parent_id">,
  userId: string,
  revalidate: string
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
    revalidatePath(revalidate);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteThread(
  userId: string,
  id: string,
  revalidate: string
) {
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
    revalidatePath(revalidate);
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
  //TODO: validate if user exists

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
  console.log(validatedFields);

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