import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import currentUser from "@/lib/currentUser";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 404 });
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
      return new NextResponse("Invalid Data", { status: 400 });
    }

    if (threadExists.userId !== userExists.id) {
      return new NextResponse("Permission denied", { status: 401 });
    }
    await db.thread.update({
      where: {
        id: params.id,
      },
      data: {
        deleted: true,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
