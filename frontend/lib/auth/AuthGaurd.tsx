'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles: ('USER' | 'SELLER' | 'ADMIN')[]; // Define allowed roles
}

const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user?.role) {
      // If user is not authenticated, redirect to login page
      router.push('/login');
    } else if (!allowedRoles.includes(user.role)) {
      // If user role is not allowed, redirect to homepage or error page
      router.push('/');
    }
  }, [isAuthenticated, user, router, allowedRoles]);

  // Show loading spinner or nothing until the check is complete
  if (!isAuthenticated || !user?.role || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
