import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
  t_expression,
  r_expression,
} from "@/routes";
import { getNullThread } from "./lib/actions";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isPublicRoute = publicRoutes.some((p) => {
    if (p === "/r/*/thread/*") {
      const exp = nextUrl.pathname.match(t_expression);
      if (exp && exp[0] === nextUrl.pathname) {
        return true;
      }
    }
    if (p === "/r/*") {
      const exp = nextUrl.pathname.match(r_expression);
      if (exp && exp[0] === nextUrl.pathname) {
        return true;
      }
    }
    return p === nextUrl.pathname;
  });
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  if (nextUrl.pathname.startsWith("/img")) {
    return null;
  }

  if (nextUrl.pathname.endsWith("/edit") && !isLoggedIn) {
    // if pathname is a valid expression (a valid thread url), redirect to the post, else, to home
    if (nextUrl.pathname.match(t_expression)) {
      return Response.redirect(
        new URL(nextUrl.pathname.split("/edit")[0], nextUrl)
      );
    } else {
      return Response.redirect(new URL("/", nextUrl));
    }
  }

  if (isApiRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
