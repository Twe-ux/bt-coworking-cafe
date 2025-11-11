import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/about",
  "/blog",
  "/blog-details",
  "/contact",
  "/faq",
  "/home-2",
  "/pricing",
  "/projects",
  "/project-details",
  "/services",
  "/service-details",
  "/concept",
  "/espaces",
  "/tarifs",
  "/menu",
  "/professionnels",
  "/mag",
];

// Auth routes
const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

// Admin dashboard routes
const adminDashboardPattern = /^\/dashboard(\/.*)?$/;

// Client dashboard pattern (matches /{username}, /{username}/profile, etc.)
const clientDashboardPattern =
  /^\/[^\/]+(?:\/(?:profile|reservations|settings))?(?:\/.*)?$/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("🔒 MIDDLEWARE:", pathname);

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

  console.log("🔒 Auth status:", {
    authenticated: isAuthenticated,
    role: userRole,
    username: username,
  });

  // 1. Public routes - allow everyone
  if (publicRoutes.includes(pathname)) {
    console.log("✅ Public route, allowing access");
    return NextResponse.next();
  }

  // 2. Auth routes (login, register, etc.)
  if (authRoutes.includes(pathname)) {
    if (isAuthenticated) {
      console.log("🔒 Already authenticated, redirecting based on role");

      // Redirect authenticated users based on their role
      if (userRole === "client" && username) {
        console.log(`🔒 Client redirect to /${username}`);
        return NextResponse.redirect(new URL(`/${username}`, req.url));
      } else if (
        userRole === "dev" ||
        userRole === "admin" ||
        userRole === "staff"
      ) {
        console.log("🔒 Admin/Staff/Dev redirect to /dashboard/analytics");
        return NextResponse.redirect(
          new URL("/dashboard/dashboards/analytics", req.url)
        );
      }
    }
    // Not authenticated, allow access to auth pages
    console.log("✅ Auth route, allowing access");
    return NextResponse.next();
  }

  // 3. Admin dashboard routes
  if (adminDashboardPattern.test(pathname)) {
    if (!isAuthenticated) {
      console.log("❌ Admin dashboard requires auth, redirecting to login");
      return NextResponse.redirect(
        new URL(
          `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`,
          req.url
        )
      );
    }

    // Check if user has admin/staff/dev role
    if (userRole === "client") {
      console.log(
        "❌ Client trying to access admin dashboard, redirecting to client dashboard"
      );
      if (username) {
        return NextResponse.redirect(new URL(`/${username}`, req.url));
      }
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    console.log("✅ Admin/Staff/Dev accessing dashboard");
    return NextResponse.next();
  }

  // 4. Client dashboard routes (/{username}/...)
  if (
    clientDashboardPattern.test(pathname) &&
    !publicRoutes.includes(pathname)
  ) {
    // Extract username from path
    const pathUsername = pathname.split("/")[1];

    if (!isAuthenticated) {
      console.log("❌ Client dashboard requires auth, redirecting to login");
      return NextResponse.redirect(
        new URL(
          `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`,
          req.url
        )
      );
    }

    // If it's a client, verify they can only access their own dashboard
    if (userRole === "client") {
      if (pathUsername !== username) {
        console.log(
          `❌ Client trying to access another user's dashboard (${pathUsername} != ${username})`
        );
        return NextResponse.redirect(new URL(`/${username}`, req.url));
      }
    }

    // Admin/Staff/Dev can access any client dashboard
    console.log("✅ Authorized access to client dashboard");
    return NextResponse.next();
  }

  // 5. Default: allow access
  console.log("✅ Default allow");
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
