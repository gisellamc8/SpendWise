'use client';

import { useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AppLogo } from '@/components/icons';
import {
  useAuth,
  initiateEmailSignIn,
  initiateEmailSignUp,
} from '@/firebase';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/provider';
import { useEffect } from 'react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    if (isSignUp) {
      initiateEmailSignUp(auth, data.email, data.password);
    } else {
      initiateEmailSignIn(auth, data.email, data.password);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
       <div className="flex items-center gap-3 mb-4">
          <AppLogo width={48} height={48} />
          <h1 className="text-4xl font-bold font-headline text-foreground">
            SpendWise
          </h1>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Enter your details to create a new account.'
              : 'Sign in to access your account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>
          </FormProvider>
          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setIsSignUp(false)}
                >
                  Sign In
                </Button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setIsSignUp(true)}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
