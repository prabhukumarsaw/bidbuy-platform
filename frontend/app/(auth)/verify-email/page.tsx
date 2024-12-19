'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useVerifyEmail } from '@/hooks/use-verify-email';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { verifyEmail, isLoading, isSuccess, error } = useVerifyEmail();
  const [countdown, setCountdown] = useState(5);

  // useEffect(() => {
  //   if (token) {
  //     verifyEmail(token);
  //   }
  // }, [token, verifyEmail]);


  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        verifyEmail(token); // Call the API after 1 second
      }, 1000); // 1000ms = 1 second

      return () => clearTimeout(timer); // Cleanup timeout if the component unmounts or token changes
    }
  }, [token, verifyEmail]);

  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      router.push('/login');
    }
  }, [isSuccess, countdown, router]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600">Invalid Token</h2>
          <p className="mt-2 text-gray-600">
            The verification link appears to be invalid or has expired.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push('/login')}
          >
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
        {isLoading ? (
          <div className="space-y-4">
            <Icons.spinner className="animate-spin h-8 w-8 mx-auto text-blue-500" />
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <Icons.error className="h-8 w-8 mx-auto text-red-500" />
            <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
            <p className="text-gray-600">{error.message}</p>
            <Button onClick={() => router.push('/login')}>
              Return to Login
            </Button>
          </div>
        ) : isSuccess ? (
          <div className="space-y-4">
            <Icons.check className="h-8 w-8 mx-auto text-green-500" />
            <h2 className="text-2xl font-bold text-green-600">Email Verified!</h2>
            <p className="text-gray-600">
              Your email has been successfully verified. Redirecting to login in {countdown} seconds...
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}