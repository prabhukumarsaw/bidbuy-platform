'use client';

import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = calculatePasswordStrength(password);
  
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-2 w-full rounded-full transition-all duration-300",
              {
                'bg-red-500': strength >= 1 && level === 1,
                'bg-orange-500': strength >= 2 && level === 2,
                'bg-yellow-500': strength >= 3 && level === 3,
                'bg-green-500': strength >= 4 && level === 4,
                'bg-gray-200': strength < level
              }
            )}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        {strength === 0 && 'Enter password'}
        {strength === 1 && 'Too weak'}
        {strength === 2 && 'Could be stronger'}
        {strength === 3 && 'Strong password'}
        {strength === 4 && 'Very strong password'}
      </p>
    </div>
  );
}

function calculatePasswordStrength(password: string): number {
  if (!password) return 0;
  
  let strength = 0;
  if (password.length >= 6) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  return strength;
}
