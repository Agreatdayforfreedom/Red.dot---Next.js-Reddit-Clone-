import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { CommunitySchema } from "@/schemas/community";
import { db } from "@/lib/db";
import currentUser from "@/lib/currentUser";
import { redirect } from "next/navigation";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const data = await req.json();
  const validatedFields = CommunitySchema.safeParse(data);
  const user = await currentUser();
  if (!validatedFields.success) {
    return new NextResponse("Something went wrong!");
  }

  const {
    background_color,
    info,
    interactive_elements_color,
    name,
    background_image,
  } = validatedFields.data;
  let redirectId = "";
  try {
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const communityExists = await db.community.findUnique({
      where: {
        name,
      },
    });

    if (communityExists) {
      return new NextResponse("There is already a community with that name", {
        status: 404,
      });
    }

    const { name: nameRedirect } = await db.community.create({
      data: {
        name,
        info,
        interactive_elements_color,
        background_color,
        communities: {
          create: {
            userId: user.id,
          },
        },
      },
    });
    return new NextResponse(nameRedirect, { status: 201 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
