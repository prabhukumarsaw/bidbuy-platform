import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Get the pathname
    const pathname = req.nextUrl.pathname;
    
    // Check if user is authenticated
    const isAuthenticated = !!req.nextauth.token;
    
    // Define protected routes
    const adminRoutes = ['/admin'];
    const authRoutes = ['/login', '/register', '/forgot-password'];
    const protectedRoutes = ['/dashboard', ...adminRoutes];
    
    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    // Get user role from token
    const userRole = req.nextauth.token?.role;

    // Redirect logic
    if (isAuthRoute && isAuthenticated) {
      // Redirect authenticated users away from auth pages
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (isProtectedRoute && !isAuthenticated) {
      // Redirect unauthenticated users to login
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(pathname)}`, req.url)
      );
    }

    if (isAdminRoute && userRole !== 'ADMIN') {
      // Redirect non-admin users
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password',
  ],
};