'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { Icons } from '@/components/icons';
import { SocialAuth } from '@/components/auth/social-auth';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PasswordStrength } from '@/components/auth/password-strength';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TermsDialog } from '@/components/policy/page';

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

export default function AdvancedRegistrationPage() {
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(0);
  //const [formProgress, setFormProgress] = useState(0); //Removed

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');
  const allFields = watch();

  // useEffect(() => {
  //   const progress = Object.values(allFields).filter(Boolean).length / Object.keys(allFields).length * 100;
  //   setFormProgress(progress);
  // }, [allFields]); //Removed

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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-screen-xl grid lg:grid-cols-2 gap-8 items-center"
      >
        {/* Left side - Illustration and branding */}
        <div className="hidden lg:flex flex-col justify-center p-8 bg-white rounded-2xl shadow-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl" />
            <img
              src="/feature/cyber-3.jpg"
              alt="Enterprise illustration"
              className="w-full h-auto relative z-10"
            />
          </motion.div>
          <div className="mt-8 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Enterprise Platform
            </h1>
            <p className="mt-4 text-gray-600 max-w-md mx-auto">
              Secure, scalable, and reliable platform for your business needs
            </p>
          </div>
        </div>

        {/* Right side - Registration form */}
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Link
                href="/"
                className="flex left-0 items-center space-x-2 text-sm font-medium hover:underline"
              >
                <Icons.backBtn className="w-4 h-4" />
                <span>Back</span>
              </Link>
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight">
                  Create an account
                </h2>
                <p className="text-sm text-muted-foreground">
                  Sign up to get started with Enterprise Platform
                </p>
              </div>

              <AnimatePresence>
                {isBlocked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert variant="destructive">
                      <AlertDescription>
                        Too many attempts. Try again in{' '}
                        {Math.floor(blockTimer / 60)}:
                        {(blockTimer % 60).toString().padStart(2, '0')}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="name" className="sr-only">
                    Full name
                  </Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Full name"
                    className="h-9"
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
                    className="h-9"
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
                      className="h-9 pr-10"
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
                    className="h-9"
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Label htmlFor="terms" className="text-xs">
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
                        className="w-full h-9"
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
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <SocialAuth />
              </motion.div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
