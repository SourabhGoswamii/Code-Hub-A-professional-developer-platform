"use client";

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
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import checkAuth from "@/helpers/checkAuth";
import { verifySchema } from "@/schemas/verifySchema";

const VerifyEmailPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
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

      router.replace('/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Verification Failed',
        description: axiosError.response?.data.message ?? 'Please check your code and try again.',
        variant: 'destructive',
      });
      form.reset({ code: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!username) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-white to-blue-100 p-4 flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-green-500/10 to-transparent"></div>
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden relative z-10">
        {/* Left Side - Form */}
        <div className="md:w-1/2 p-12 bg-white">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-green-100 p-3">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Check Your Email</h2>
              <p className="mt-3 text-gray-600">
                We've sent a verification code to your email address
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Verification Code</FormLabel>
                      <Input
                        {...field}
                        placeholder="Enter 6-digit code"
                        className="text-center text-lg tracking-widest border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                        maxLength={6}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 rounded-lg transition-all duration-150 shadow-md hover:shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Verify Email
                    </div>
                  )}
                </Button>

                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-sm hover:text-green-700"
                    onClick={resendCode}
                    disabled={isResending}
                  >
                    {isResending ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Sending...
                      </div>
                    ) : (
                      "Didn't receive the code? Resend"
                    )}
                  </Button>

                  <div className="text-center">
                    <Link 
                      href="/sign-in"
                      className="inline-flex items-center text-sm text-green-600 hover:text-green-800 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Sign In
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="md:w-1/2 relative overflow-hidden">
          <img 
            src="/Verify.jpg" 
            alt="Verification Illustration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/20 mix-blend-multiply"></div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;