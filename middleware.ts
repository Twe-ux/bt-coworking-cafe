import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Redirection de la racine vers le site public
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Autoriser l'accès aux pages d'authentification sans token
        if (req.nextUrl.pathname.startsWith("/dashboard/auth")) {
          return true;
        }
        // Exiger l'authentification pour les autres pages dashboard
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        // Autoriser l'accès au site public sans authentification
        return true;
      },
    },
    pages: {
      signIn: "/dashboard/auth/sign-in",
    },
  }
);

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
