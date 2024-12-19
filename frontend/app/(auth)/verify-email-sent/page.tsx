'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailSentPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { resendVerification, isLoading } = useAuth();
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const handleResend = async () => {
    if (!email || resendDisabled) return;
    
    resendVerification(email);
    setResendDisabled(true);
    
    let timeLeft = 60;
    const timer = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      
      if (timeLeft === 0) {
        clearInterval(timer);
        setResendDisabled(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
        <Icons.mail className="mx-auto h-12 w-12 text-blue-500" />
        <h2 className="mt-6 text-3xl font-bold text-gray-900">Check your email</h2>
        <p className="mt-2 text-sm text-gray-600">
          We've sent you a verification link to {email}.
          Please check your inbox and click the link to verify your account.
        </p>
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleResend}
            disabled={isLoading || resendDisabled}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : resendDisabled ? (
              `Resend available in ${countdown}s`
            ) : (
              'Resend verification email'
            )}
          </Button>
          <div className="text-sm text-gray-500">
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Return to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}