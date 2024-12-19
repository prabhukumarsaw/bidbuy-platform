import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { useState } from 'react';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function AuthForm({ type, onSubmit, isLoading }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const schema = type === 'login' ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {type === 'register' && (
        <div>
          <Input
            {...register('name')}
            placeholder="Full name"
            className="w-full"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message as string}
            </p>
          )}
        </div>
      )}

      <div>
        <Input
          {...register('email')}
          type="email"
          placeholder="Email address"
          className="w-full"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {errors.email.message as string}
          </p>
        )}
      </div>

      <div className="relative">
        <Input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className="w-full"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? <Icons.eyeOff /> : <Icons.eye />}
        </button>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">
            {errors.password.message as string}
          </p>
        )}
      </div>

      {type === 'register' && (
        <div>
          <Input
            {...register('confirmPassword')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            className="w-full"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message as string}
            </p>
          )}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="animate-spin" />
        ) : (
          type === 'login' ? 'Sign in' : 'Sign up'
        )}
      </Button>
    </form>
  );
}