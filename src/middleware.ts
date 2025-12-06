import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/CGU",
  "/confidentiality",
  "/mentions-legales",
  "/contact",
  "/scan",
  "/promo",

  "/concept",
  "/take-away",
  "/spaces",
  "/pricing",
  "/blog",

  "/boissons",
  "/menu/boissons",
  "/menu/food",

  "/professionnels",

  "/robots.txt",
  "/sitemap.xml",
];

// Public route patterns (dynamic routes)
const publicRoutePatterns = [
  /^\/promo\/[^\/]+$/, // /promo/[token]
];

// Auth routes
const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

// Protected routes that require authentication but are accessible to all authenticated users
const protectedRoutes = ["/messages", "/booking", "/mes-reservations", "/horaires"];

// Admin dashboard routes
const adminDashboardPattern = /^\/dashboard(\/.*)?$/;

// Client dashboard pattern (matches /{username}, /{username}/profile, etc.)
const clientDashboardPattern =
  /^\/[^\/]+(?:\/(?:profile|reservations|settings))?(?:\/.*)?$/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // console.log("🔒 MIDDLEWARE:", pathname);

  // Get the session token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const userRole = token?.role?.slug as
    | "dev"
    | "admin"
    | "staff"
    | "client"
    | undefined;
  const username = token?.username as string | undefined;

  // console.log("🔒 Auth status:", {
  //   authenticated: isAuthenticated,
  //   role: userRole,
  //   username: username,
  // });

  // 1. Public routes - allow everyone
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/promo/") ||
    publicRoutePatterns.some((pattern) => pattern.test(pathname));

  if (isPublicRoute) {
    // console.log("✅ Public route, allowing access");
    return NextResponse.next();
  }

  // 2. Protected routes - require authentication but accessible to all authenticated users
  if (protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    if (!isAuthenticated) {
      console.log("❌ Protected route requires auth, redirecting to login");
      return NextResponse.redirect(
        new URL(
          `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`,
          req.url
        )
      );
    }
    console.log("✅ Protected route, user authenticated, allowing access");
    return NextResponse.next();
  }

  // 3. Auth routes (login, register, etc.)
  if (authRoutes.includes(pathname)) {
    if (isAuthenticated) {
      // console.log("🔒 Already authenticated, redirecting based on role");

      // Redirect authenticated users based on their role
      if (userRole === "client" && username) {
        // console.log(`🔒 Client redirect to /${username}`);
        return NextResponse.redirect(new URL(`/${username}`, req.url));
      } else if (
        userRole === "dev" ||
        userRole === "admin" ||
        userRole === "staff"
      ) {
        // console.log("🔒 Admin/Staff/Dev redirect to /dashboard");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
    // Not authenticated, allow access to auth pages
    // console.log("✅ Auth route, allowing access");
    return NextResponse.next();
  }

  // 4. Admin dashboard routes
  if (adminDashboardPattern.test(pathname)) {
    if (!isAuthenticated) {
      // console.log("❌ Admin dashboard requires auth, redirecting to login");
      return NextResponse.redirect(
        new URL(
          `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`,
          req.url
        )
      );
    }

    // Check if user has admin/staff/dev role
    if (userRole === "client") {
      // console.log(
      //   "❌ Client trying to access admin dashboard, redirecting to client dashboard"
      // );
      if (username) {
        return NextResponse.redirect(new URL(`/${username}`, req.url));
      }
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // console.log("✅ Admin/Staff/Dev accessing dashboard");
    return NextResponse.next();
  }

  // 5. Client dashboard routes (/{username}/...)
  // Skip if it's a public route pattern (like /promo/[token])
  const isPublicPattern = publicRoutePatterns.some((pattern) =>
    pattern.test(pathname)
  );

  if (
    clientDashboardPattern.test(pathname) &&
    !publicRoutes.includes(pathname) &&
    !isPublicPattern &&
    isAuthenticated // Only treat as client dashboard if authenticated
  ) {
    // Extract username from path
    const pathUsername = pathname.split("/")[1];

    // If it's a client, verify they can only access their own dashboard
    if (userRole === "client") {
      if (pathUsername !== username) {
        // console.log(
        //   `❌ Client trying to access another user's dashboard (${pathUsername} != ${username})`
        // );
        return NextResponse.redirect(new URL(`/${username}`, req.url));
      }
    }

    // Admin/Staff/Dev can access any client dashboard
    // console.log("✅ Authorized access to client dashboard");
    return NextResponse.next();
  }

  // 6. Unknown routes - redirect to home for unauthenticated users
  // If we reach here, it's likely an unknown route
  if (!isAuthenticated) {
    // console.log("❌ Unknown route, redirecting to home");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 7. Default: allow access for authenticated users
  // console.log("✅ Default allow");
  return NextResponse.next();
}

// Match ALL routes except static files (testing)
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (static images from public folder)
     * - icons (static icons from public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};
