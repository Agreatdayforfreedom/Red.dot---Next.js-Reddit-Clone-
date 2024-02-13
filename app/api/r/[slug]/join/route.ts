import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import currentUser from "@/lib/currentUser";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const alredyJoined = await db.join_User_Community.findFirst({
      where: {
        communityId: params.slug,
        userId: user.id,
      },
    });

    if (alredyJoined) {
      //leave
      await db.join_User_Community.delete({
        where: {
          id: alredyJoined.id,
        },
      });
      return new NextResponse("Community abandoned", { status: 201 });
    }
    await db.join_User_Community.create({
      data: {
        communityId: params.slug,
        userId: user.id,
      },
    });

    return new NextResponse("Now you are a member", { status: 201 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
