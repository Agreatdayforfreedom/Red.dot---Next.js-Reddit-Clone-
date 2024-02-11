import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tojson = await req.json();

  const { userId } = tojson;

  try {
    const threadLiked = await db.likes.findFirst({
      where: {
        threadId: params.id,
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
          threadId: params.id,
          userId,
        },
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log(error);
  }
}
