import crypto from "crypto";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import currentUser from "@/lib/currentUser";
import { Community } from "@prisma/client";
import { TypeImageUpload } from "@/types";
export async function POST(
  req: NextResponse,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.formData();

    const file: File | null = data.get("file") as unknown as File;
    const type: TypeImageUpload = data.get(
      "type"
    ) as unknown as TypeImageUpload;
    let communityUpdateType: Community = {} as Community;

    if (!file) {
      return new NextResponse("Invalid image", { status: 400 });
    }
    if (!type) {
      return new NextResponse("Invalid type", { status: 400 });
    }

    const communityExists = await db.community.findUnique({
      where: {
        name: params.slug,
      },
    });

    if (!communityExists) {
      return new NextResponse("Community not found", { status: 404 });
    }

    //uuid file name
    const extension = file.name.split(".").at(-1);
    if (!extension) return new NextResponse("Invalid image", { status: 400 });
    const fileName = crypto.randomUUID().concat(".", extension);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = process.cwd() + `/public/img/${fileName}`;

    communityUpdateType[type] = `/img/${fileName}`;

    await Promise.all([
      communityExists[type]
        ? await fs.unlink(process.cwd() + `/public${communityExists[type]}`)
        : Promise.resolve(),
      await fs.writeFile(path, buffer),
      await db.community.update({
        where: {
          name: params.slug,
        },
        data: {
          ...communityUpdateType,
        },
      }),
    ]);
    return new NextResponse("Uploaded", { status: 200 });
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
