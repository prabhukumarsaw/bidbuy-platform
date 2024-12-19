import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useSocialAuth } from '@/hooks/use-social-auth';

export function SocialButtons() {
  const { handleSocialLogin, isLoading } = useSocialAuth();

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        onClick={() => handleSocialLogin('google')}
       
      >
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSocialLogin('facebook')}
      
      >
        <Icons.facebook className="mr-2 h-4 w-4" />
        Facebook
      </Button>
    </div>
  );
}