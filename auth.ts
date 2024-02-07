import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import authConfig from "./auth.config";

const prisma = new PrismaClient();

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  trustHost: true,

  callbacks: {
    async session(params) {
      let { session, token } = params as { session: Session; token: JWT };
      if (session.user && !session.user?.id) {
        session.user.id = token.sub;
      }
      return params.session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
