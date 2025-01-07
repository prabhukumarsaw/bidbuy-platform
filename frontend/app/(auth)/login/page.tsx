'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { SocialAuth } from '@/components/auth/social-auth';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PasswordStrength } from '@/components/auth/password-strength';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnimatedParticles } from '@/components/AnimatedParticles';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const password = watch('password', '');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBlocked && blockTimer > 0) {
      interval = setInterval(() => {
        setBlockTimer((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBlocked, blockTimer]);

  const onSubmit = async (data: LoginFormData) => {
    if (isBlocked) return;

    try {
      await login(data);
    } catch (error) {
      setAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5) {
          setIsBlocked(true);
          setBlockTimer(300);
        }
        return newAttempts;
      });
    }
  };

  return (
    <div className="flex min-h-screen h-full">
      {/* Left Section */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 flex-col justify-between p-8 xl:p-12 2xl:p-16 overflow-hidden">
        <AnimatedParticles />
        <div className="relative z-10 space-y-8 xl:space-y-12">
          <div className="w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 transition-transform hover:rotate-180 duration-500">
            <Icons.asterisk className="w-full h-full text-white" />
          </div>
          <div className="space-y-4 xl:space-y-6">
            <h1 className="text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white tracking-tight">
              Welcome Back
              <span className="inline-block ml-2 animate-wave">👋</span>
            </h1>
            <p className="text-lg sm:text-xl xl:text-2xl text-white/90 max-w-xl leading-relaxed">
              Discover. Bid. Win. Your journey to extraordinary finds begins
              here!
            </p>
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-sm xl:text-base text-white/70">
            © {new Date().getFullYear()} Bid. All rights reserved.
          </p>
        </div>
        {/* Enhanced Diagonal Lines Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px] animate-pattern-slide" />
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <div className="w-full max-w-md space-y-6 xl:space-y-8">
          <div className="flex  items-center space-x-5 py-4 ">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/" className="group">
                    <Icons.moveLeft className="w-5 h-5 text-gray-600 transition duration-200 group-hover:-translate-x-1" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Return to homepage</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-500">
                Back to homepage
              </p>
              <h1 className="text-2xl sm:text-xl md:text-3xl  font-bold text-gray-800">
                Login to your account
              </h1>
            </div>
          </div>

          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
                {isBlocked && (
                  <Alert
                    variant="destructive"
                    className="animate-in fade-in-50"
                  >
                    <AlertDescription>
                      Too many failed attempts. Please try again in{' '}
                      {Math.floor(blockTimer / 60)}:
                      {(blockTimer % 60).toString().padStart(2, '0')}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      {...register('email')}
                      type="email"
                      placeholder="name@company.com"
                      className={cn(
                        'h-12 text-base transition-shadow duration-200',
                        'focus:ring-2 focus:ring-blue-500/20',
                        errors.email && 'ring-2 ring-red-500/20'
                      )}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 animate-in fade-in-50">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative group">
                      <Input
                        id="password"
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className={cn(
                          'h-12 text-base pr-10 transition-shadow duration-200',
                          'focus:ring-2 focus:ring-blue-500/20',
                          errors.password && 'ring-2 ring-red-500/20'
                        )}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? (
                          <Icons.eyeOff className="w-5 h-5" />
                        ) : (
                          <Icons.eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500 animate-in fade-in-50">
                        {errors.password.message}
                      </p>
                    )}
                    <PasswordStrength password={password} />
                  </div>

                  <div className="flex items-center justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className={cn(
                      'w-full h-12 text-base font-medium',
                      'bg-blue-600 hover:bg-blue-700',
                      'transition-all duration-200',
                      'shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30',
                      'disabled:shadow-none'
                    )}
                    disabled={isLoading || isBlocked}
                  >
                    {isLoading ? (
                      <Icons.spinner className="w-5 h-5 animate-spin" />
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </div>

                <div className="relative">
                  <Separator className="my-6" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="px-2 text-sm text-gray-500 ">
                      Or continue with
                    </span>
                  </div>
                </div>

                <SocialAuth />
              </form>
            </CardContent>
          </Card>

          <CardFooter className="p-0">
            <p className="w-full text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </div>
      </div>
    </div>
  );
}
