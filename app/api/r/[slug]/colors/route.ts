import { NextRequest, NextResponse } from "next/server";
import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const data = await req.json();

    await db.community.update({
      data,
      where: {
        name: params.slug,
      },
    });
    return new NextResponse("Saved", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
