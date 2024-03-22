import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Join_User_Community, PrismaClient } from "@prisma/client";
import authConfig from "./auth.config";
import { db } from "./lib/db";

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
      const communitiesJoined = await db.join_User_Community.findMany({
        where: {
          userId: token.sub,
        },

        select: {
          community: true,
        },
      });
      if (session.user && !session.user?.id) {
        session.user.id = token.sub;
        session.user.communities = communitiesJoined;
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
