"use server";
import { z } from "zod";

import { LoginSchema } from "@/schemas/login";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { RegisterSchema } from "@/schemas/register";
import { db } from "./db";
import type { RawThread, Thread } from "@/types";
import { $assingRawUser, formatRaw } from "./format-raw";
import { Community, Prisma } from "@prisma/client";
import { ThreadChildSchema, ThreadSchema } from "../schemas/thread";
import { revalidatePath, revalidateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";
import currentUser from "./currentUser";

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

  await db.user.create({
    data: {
      email,
      name,
      image: `https://www.gravatar.com/avatar/${Math.floor(
        Math.random() * 1000
      )}?d=wavatar&f=y&s=32`,
      password,
    },
  });

  return { success: "Registered successfully!" };
}

async function getUser(email: string) {
  return await db.user.findUnique({ where: { email } });
}

/**
 *
 * @returns all posts with parent_id = null
 */
export async function getNullThreads(): Promise<RawThread[]> {
  const user = await currentUser();

  return await db.$queryRaw`

    SELECT 
      t.*, 
      u.id as user_id,
      u.image as user_image,
      u.name as user_name,
      c.name as community_name,
      c.avatar as community_avatar,
      (SELECT count(*)::int FROM thread tt WHERE tt.node_path ~ ((ltree2text(t.node_path)) || '.*{1,}')::lquery) AS totalComments,
      (SELECT ARRAY[
        SUM(CASE WHEN type = 'UP' THEN 1 ELSE 0 END)::int, 
        SUM(CASE WHEN type = 'DOWN' THEN 1 ELSE 0 END)::int
      ] FROM votes v WHERE v."threadId" = t.id ) as totalvotes, 
      (SELECT 
        type
       FROM votes v WHERE v."threadId" = t.id AND v."userId" = ${Prisma.raw(
         `'${user?.id}'`
       )}) AS voted
      FROM thread t 
      LEFT JOIN "user" AS u ON u.id = t."userId"
      LEFT JOIN "community" AS c ON c.id = t."communityId"  
      WHERE parent_id IS NULL;
  `;
}

export async function getCommunity(slug: string) {
  const user = await currentUser();
  const [community]: Array<
    Community & { ismember: boolean; totalmembers: number }
  > = await db.$queryRaw`
    SELECT c.*, 
    EXISTS(SELECT * FROM join_user_community j WHERE c.id = j."communityId" AND "userId" = ${Prisma.raw(
      `'${user?.id!}'`
    )}) as ismember,
    COUNT(j.*)::int as totalmembers
    FROM community c
    LEFT JOIN join_user_community j ON c.id = j."communityId"
      WHERE c.name = ${Prisma.raw(`'${slug}'`)} OR c.id = ${Prisma.raw(
    `'${slug}'`
  )} GROUP BY c.id
`;
  return community;
}

/**
 * get parent(parent_id = null) and its children
 *
 */
export async function getThread(id: string) {
  const user = await currentUser();

  //todo: validate: AND communityId = slug

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
      t."communityId", --temporal 
      u.id as user_id,
      u.image as user_image,
      u.name as user_name,
      CASE WHEN t.parent_id IS NULL THEN (
      SELECT count(*)::int FROM thread tt WHERE tt.node_path ~ ((ltree2text(t.node_path)) || '.*{1,}')::lquery
      )::int ELSE 0 END as totalcomments,
      EXISTS(SELECT * FROM saved s WHERE s."threadId" = t.id AND s."userId" = ${Prisma.raw(
        `'${user?.id}'`
      )}) AS saved,
      (SELECT ARRAY[
        SUM(CASE WHEN type = 'UP' THEN 1 ELSE 0 END)::int, 
        SUM(CASE WHEN type = 'DOWN' THEN 1 ELSE 0 END)::int
      ] FROM votes v WHERE v."threadId" = t.id ) as totalvotes, 
      (SELECT 
        type
       FROM votes v WHERE v."threadId" = t.id AND v."userId" = ${Prisma.raw(
         `'${user?.id}'`
       )}) AS voted,
       CASE WHEN EXISTS(
     SELECT 1 FROM thread tt WHERE tt.node_path ~ ((ltree2text(t.node_path)) || '.*{1,2}')::lquery
  ) THEN 1 ELSE 0 END as haschildren 
      FROM thread t 
      LEFT JOIN "user" AS u ON u.id = t."userId"
      WHERE  t.node_path ~ ('*.' || ltree2text(${Prisma.raw(
        `'${id}'`
      )}) || '.*{,10}')::lquery GROUP BY t.id, u.id;
      `;
  // WHERE t.node_path <@ ${Prisma.raw(`'${id}'`)} GROUP BY t.id, u.id;`;
  if (raw.length === 0 || !raw) {
    return [];
  } else {
    return formatRaw(raw, raw[0].parent_id);
  }
}

export async function newSubThread(
  values: Omit<z.infer<typeof ThreadChildSchema>, "id">,
  userId: string
) {
  const validatedFields = ThreadChildSchema.safeParse(values);
  if (!validatedFields.success) {
    return { message: "Something went wrong!" };
  }
  const { content, parent_id } = validatedFields.data;
  //TODO: validate if user exists

  try {
    await db.thread.create({
      data: {
        content,
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

  const { content, title, parent_id, communityId } = validatedFields.data;
  let redirectCSlug: string = "";
  let redirectId: string = "";
  // console.log({ communityId });
  try {
    const userExists = await getUserById(userId);

    if (!userExists) {
      return { error: "Invalid data" };
    }

    const communityExists = await db.community.findUnique({
      where: {
        name: communityId,
      },
    });

    if (!communityExists) {
      return { error: "Community does not exist" };
    }

    const res = await db.thread.create({
      data: {
        content,
        title,
        parent_id,
        userId,
        communityId: communityExists.id,
      },
    });

    redirectId = res.id;
    redirectCSlug = communityExists.name;
  } catch (error) {
    console.log(error);
  }
  if (redirectId && redirectCSlug)
    redirect(`/r/${redirectCSlug}/thread/${redirectId}`);
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
  if (redirectId) redirect(`../${redirectId}`);
}

async function getUserById(id: string) {
  return await db.user.findUnique({ where: { id } });
}
async function getThreadById(id: string) {
  return await db.thread.findUnique({ where: { id } });
}

// export async function like(threadId: string, userId: string) {
//   try {
//     const threadLiked = await db.likes.findFirst({
//       where: {
//         threadId,
//         userId,
//       },
//     });
//     if (threadLiked) {
//       //unlike
//       await db.likes.delete({
//         where: {
//           id: threadLiked.id,
//         },
//       });
//     } else {
//       await db.likes.create({
//         data: {
//           threadId,
//           userId,
//         },
//       });
//     }

//     revalidateTag(`/thread/[id]`);
//   } catch (error) {
//     console.log(error);
//   }
// }
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
