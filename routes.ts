export const publicRoutes = ["/", "/r/*", "/r/*/thread/*"];

export const authRoutes = ["/login", "/register"];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/";

export const t_expression = /\/r\/[\s\S]*\/thread\/[\s\S]*?(?=\/|$)/g;
export const r_expression = /\/r\/[\s\S]*?(?=\/|$)/g;
