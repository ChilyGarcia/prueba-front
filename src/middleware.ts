import { NextResponse } from "next/server";

export function middleware(request: {
  cookies: { get: (arg0: string) => any };
  url: string | URL | undefined;
}) {
  const token = request.cookies.get("token");
  if (!request.url) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const currentUrl = new URL(request.url);

  if (currentUrl.pathname != "/dashboard") {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // Excluir archivos estáticos
};
