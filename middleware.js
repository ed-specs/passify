import { createServerClient } from "@supabase/ssr"; // Updated import
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Set cookies with security flags
          response.cookies.set({
            name,
            value,
            httpOnly: true, // Prevent JavaScript access
            secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "strict", // CSRF protection
            maxAge: 86400 * 7, // 7 days
            ...options,
          });
        },
        remove(name, options) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            ...options,
          });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // Fix: Define Public Routes (only "/" and "/create-account")
  const isPublicPage = pathname === "/" || pathname === "/create-account";

  // Fix: Define Auth Pages (pages visible only when NOT logged in)
  const isAuthPage = pathname === "/" || pathname === "/create-account";

  // Protected Routes (requires authentication)
  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/password-vault") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings");

  // Logic A: Redirect unauthenticated users away from protected pages
  if (isProtectedPage && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Logic B: Redirect authenticated users away from auth pages
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/create-account",
    "/dashboard/:path*",
    "/password-vault/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};
