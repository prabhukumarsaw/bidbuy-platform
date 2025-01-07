'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function SocialAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<{
    google: boolean;
    facebook: boolean;
  }>({
    google: false,
    facebook: false,
  });

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading((prev) => ({ ...prev, [provider]: true }));

      const result = await signIn(provider, {
        callbackUrl: '/',
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.url) {
        router.push(result.url);
        toast.success(`Successfully signed in with ${provider}`);
      }
    } catch (error: any) {
      console.error('Social login error:', error);
      toast.error(error.message || `Failed to sign in with ${provider}`);
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        onClick={() => handleSocialLogin('google')}
        disabled={isLoading.google}
        className="w-full"
      >
        {isLoading.google ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSocialLogin('facebook')}
        disabled={isLoading.facebook}
        className="w-full"
      >
        {isLoading.facebook ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.facebook className="mr-2 h-4 w-4" />
        )}
        Facebook
      </Button>
    </div>
  );
}
