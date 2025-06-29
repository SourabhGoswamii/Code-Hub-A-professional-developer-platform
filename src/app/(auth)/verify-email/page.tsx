'use client'

import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import checkAuth from "@/helpers/checkAuth";
import { verifySchema } from "@/schemas/verifySchema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const VerifyEmailPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Get username on mount
    const getUsername = async () => {
      const usernameResult = await checkAuth();
      if (!usernameResult) {
        router.replace('/sign-in');
        return;
      }
      setUsername(usernameResult);

      
      try {
        const response = await axios.get<ApiResponse>(
          `/api/auth/emailverify?username=${usernameResult}`
        );
        toast({
          description: "Verification code has been sent to your email",
        });
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description: axiosError.response?.data.message ?? 'Failed to send verification email.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    getUsername();
  }, [router]);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const resendCode = async () => {
    if (!username) return;
    setIsResending(true);
    try {
      const response = await axios.get<ApiResponse>(
        `/api/auth/emailverify?username=${username}`
      );
      toast({
        description: "Verification code resent to your email",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Failed to resend code',
        description: axiosError.response?.data.message ?? 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    if (!username) return;
    setIsSubmitting(true);
    try {
      
      const response = await axios.post<ApiResponse>('/api/auth/emailverify', {
        username: username,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace('/dashboard'); // Redirect to dashboard after successful verification
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Verification Failed',
        description: axiosError.response?.data.message ?? 'Please check your code and try again.',
        variant: 'destructive',
      });
      // Clear the code field on error
      form.reset({ code: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!username) {
    return null; // Return null while redirecting
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            Please check your email for the verification code and enter it below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <Input
                      {...field}
                      placeholder="Enter 6-digit code"
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </Button>

              <div className="space-y-4 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm hover:text-blue-700"
                  onClick={resendCode}
                  disabled={isResending}
                >
                  {isResending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    "Didn't receive the code? Resend"
                  )}
                </Button>

                <div className="text-sm text-gray-500">
                  <Link 
                    href="/sign-in"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;