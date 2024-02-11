import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import currentUser from "@/lib/currentUser";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.saved.create({
      data: {
        threadId: params.id,
        userId: user.id,
      },
    });
    return new NextResponse("saved", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
