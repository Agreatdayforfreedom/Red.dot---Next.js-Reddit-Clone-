import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as z from "zod";

import type { NextAuthConfig } from "next-auth";
import { db } from "@/lib/db";
import { LoginSchema } from "@/schemas/login";

export default {
  providers: [
    Credentials({
      authorize(credentials, request) {
        const validateFields = LoginSchema.safeParse(credentials);
        if (!validateFields.success) return null;
        const { email, password } = validateFields.data;
        const user = db.user.findUnique({ where: { email } });
        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
