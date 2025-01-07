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
import { Checkbox } from '@/components/ui/checkbox';
import { TermsDialog } from '@/components/policy/page';
import { cn } from '@/lib/utils';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegistrationPage() {
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
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

  const onSubmit = async (data: RegisterFormData) => {
    if (isBlocked) return;

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      setAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5) {
          setIsBlocked(true);
          setBlockTimer(300); // 5 minutes
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
              Join New World!
              <span className="inline-block ml-2 animate-wave">🚀</span>
            </h1>
            <p className="text-lg sm:text-xl xl:text-2xl text-white/90 max-w-xl leading-relaxed">
              Start your journey to more efficient sales and marketing. Automate
              your tasks and boost productivity today!
            </p>
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-sm xl:text-base text-white/70">
            © {new Date().getFullYear()} SaleSkip. All rights reserved.
          </p>
        </div>
        {/* Enhanced Diagonal Lines Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px] animate-pattern-slide " />
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 bg-white">
        <div className="w-full max-w-md space-y-6 xl:space-y-8">
          <div className="flex items-center space-x-3 py-4">
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
              <p className="text-sm text-gray-500">Back to homepage</p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                Create your account
              </h1>
            </div>
          </div>

          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="sr-only">
                      Full name
                    </Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Full name"
                      className={cn(
                        'h-12 text-base transition-shadow duration-200',
                        'focus:ring-2 focus:ring-blue-500/20',
                        errors.name && 'ring-2 ring-red-500/20'
                      )}
                      autoComplete="name"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="sr-only">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      {...register('email')}
                      type="email"
                      placeholder="Email address"
                      className={cn(
                        'h-12 text-base transition-shadow duration-200',
                        'focus:ring-2 focus:ring-blue-500/20',
                        errors.email && 'ring-2 ring-red-500/20'
                      )}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="sr-only">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className={cn(
                          'h-12 text-base pr-10 transition-shadow duration-200',
                          'focus:ring-2 focus:ring-blue-500/20',
                          errors.password && 'ring-2 ring-red-500/20'
                        )}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? (
                          <Icons.eyeOff className="w-4 h-4" />
                        ) : (
                          <Icons.eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.password.message}
                      </p>
                    )}
                    <PasswordStrength password={password} />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="sr-only">
                      Confirm password
                    </Label>
                    <Input
                      id="confirmPassword"
                      {...register('confirmPassword')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      className={cn(
                        'h-12 text-base transition-shadow duration-200',
                        'focus:ring-2 focus:ring-blue-500/20',
                        errors.confirmPassword && 'ring-2 ring-red-500/20'
                      )}
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the <TermsDialog /> and Privacy Policy
                    </Label>
                  </div>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          type="submit"
                          className={cn(
                            'w-full h-12 text-base font-medium',
                            'bg-blue-600 hover:bg-blue-700',
                            'transition-all duration-200',
                            'shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30',
                            'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'
                          )}
                          disabled={!isValid || isLoading || isBlocked}
                        >
                          {isLoading ? (
                            <Icons.spinner className="w-4 h-4 animate-spin" />
                          ) : (
                            'Create account'
                          )}
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {!isValid
                        ? 'Please fill out all fields correctly'
                        : 'Click to create your account'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs ">
                    <span className="px-2  text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div>
                  <SocialAuth />
                </div>
              </form>
            </CardContent>
          </Card>

          <CardFooter className="p-0">
            <p className="w-full text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </div>
      </div>
    </div>
  );
}
