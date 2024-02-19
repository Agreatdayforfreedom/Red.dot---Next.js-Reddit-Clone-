import { NextRequest, NextResponse } from "next/server";
import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();
  const { voteType } = await req.json();
  if (!user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const existingThread = await db.thread.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingThread) {
      return new NextResponse("Thread not found", { status: 404 });
    }

    const existingVote = await db.vote.findFirst({
      where: {
        threadId: params.id,
        userId: user.id,
      },
    });

    if (!existingVote) {
      await db.vote.create({
        data: {
          threadId: params.id,
          userId: user.id,
          type: voteType,
        },
      });
      return new NextResponse("OK", { status: 201 });
    }

    if (existingVote.type === voteType) {
      //delete
      await db.vote.delete({
        where: {
          userId_threadId: {
            threadId: params.id,
            userId: user.id,
          },
        },
      });
      return new NextResponse(null, { status: 204 });
    }

    await db.vote.update({
      where: {
        userId_threadId: {
          threadId: params.id,
          userId: user.id,
        },
      },
      data: {
        type: voteType,
      },
    });
    return new NextResponse("OK", { status: 200 });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
