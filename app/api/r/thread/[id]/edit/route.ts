import { NextRequest, NextResponse } from "next/server";
import { ThreadChildSchema } from "@/schemas/thread";
import { db } from "@/lib/db";
import currentUser from "@/lib/currentUser";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const validatedFields = ThreadChildSchema.omit({ parent_id: true }).safeParse(
    await req.json()
  );
  if (!validatedFields.success) {
    return new NextResponse("Something went wrong!", { status: 400 });
  }

  const { content } = validatedFields.data;
  try {
    const user = await currentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userExists = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });
    const threadExists = await db.thread.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!userExists || !threadExists) {
      return new NextResponse("Invalid Data", { status: 404 });
    }

    if (threadExists.userId !== userExists.id) {
      return new NextResponse("Permission denied", { status: 401 });
    }
    await db.thread.update({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: {
        content,
      },
    });
    return new NextResponse("Updated", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
