import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ThreadChildSchema } from "@/schemas/thread";
import currentUser from "@/lib/currentUser";
//!CREATE SUB THREAD
export async function POST(req: NextRequest) {
  const validatedFields = ThreadChildSchema.safeParse(await req.json());
  if (!validatedFields.success) {
    return new NextResponse("Something went wrong!", { status: 404 });
  }
  const { content, parent_id, title } = validatedFields.data;

  try {
    const user = await currentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const created = await db.thread.create({
      data: {
        content,
        title: title ? title : null,
        parent_id,
        userId: user.id,
      },
    });

    return NextResponse.json(
      { data: { ...created, user: { ...user } } },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
  }
}
