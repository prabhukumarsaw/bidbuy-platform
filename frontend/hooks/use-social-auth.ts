import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState<{
    google: boolean;
    facebook: boolean;
  }>({
    google: false,
    facebook: false,
  });
  const router = useRouter();

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(prev => ({ ...prev, [provider]: true }));

      const result = await signIn(provider, {
        callbackUrl: '/',
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.url) {
        toast.success(`Successfully signed in with ${provider}`);
        router.push(result.url);
      }
    } catch (error) {
      console.error('Social login error:', error);
      toast.error(`Failed to sign in with ${provider}`);
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  return {
    handleSocialLogin,
    isLoading,
  };
};