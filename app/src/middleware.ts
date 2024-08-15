import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verify } from "./db/helpers/jwt";

export async function middleware(request: NextRequest) {
  console.log("masuk middleware");

  const authorization = request.headers.get("Authorization");
  if (
    request.nextUrl.pathname.startsWith("/api/user/info") ||
    request.nextUrl.pathname.startsWith("/api/user/attendance") ||
    request.nextUrl.pathname.startsWith("/api/user/schedule") ||
    request.nextUrl.pathname.startsWith("/api/user/subject") ||
    request.nextUrl.pathname.startsWith("/api/subject") ||
    request.nextUrl.pathname.startsWith("/api/attendance") ||
    request.nextUrl.pathname.startsWith("/api/user/studyplan")
  ) {
    if (!authorization) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
    const [type, token] = authorization.split(" ");
    if (type !== "Bearer") {
      return NextResponse.json(
        {
          message: "Invalid token",
        },
        {
          status: 401,
        }
      );
    }
    const decoded = await verify<{
      _id: string;
      email: string;
      username: string;
      role: string;
    }>(token);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-id", decoded._id);
    requestHeaders.set("x-email", decoded.email);
    requestHeaders.set("x-username", decoded.username);
    requestHeaders.set("x-role", decoded.role);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
}

export const config = {
  matcher: [
    "/api/user/:path*",
    "/api/subject/:path*",
    "/api/attendance/:path*",
  ],
};
