"use client";

import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
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
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signupSchema";

type FormData = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debouncedUsername] = useDebounceValue(username, 500);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      bio: "",
      avatarUrl: "",
      location: [],
      website: "",
    } as z.infer<typeof signUpSchema>
  });
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get<ApiResponse>(
            `/api/auth/username-verify?username=${debouncedUsername}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (username && usernameMessage !== "Username is unique") {
      toast({
        title: "Invalid Username",
        description: "Please choose a unique username before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/auth/sign-up", {
        ...data,
        bio: data.bio || "",
        avatarUrl: data.avatarUrl || "",
        location: data.location || []
      });
      
      toast({
        title: "Success",
        description: response.data.message,
      });
      
      router.replace(`/sign-in`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "There was a problem with your sign-up. Please try again.";

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg border border-gray-100">
        <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">Create Account</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                    className="border-gray-300 focus:border-blue-500 transition-colors"
                    placeholder="Choose a unique username"
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <Input {...field} placeholder="Enter your name" className="border-gray-300 focus:border-blue-500 transition-colors" />
            <FormMessage />
          </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <Input {...field} type="email" placeholder="Enter your email" className="border-gray-300 focus:border-blue-500 transition-colors" />
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
            <Input {...field} type="password" placeholder="Enter your password" className="border-gray-300 focus:border-blue-500 transition-colors" />
            <FormMessage />
          </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <Input {...field} placeholder="Tell us about yourself (optional)" className="border-gray-300 focus:border-blue-500 transition-colors" />
            <FormMessage />
          </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
          <FormItem>
            <FormLabel>Avatar URL</FormLabel>
            <Input {...field} placeholder="Paste your avatar URL (optional)" className="border-gray-300 focus:border-blue-500 transition-colors" />
            <FormMessage />
          </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <Input {...field} placeholder="Paste your website URL (optional)" className="border-gray-300 focus:border-blue-500 transition-colors" />
            <FormMessage />
          </FormItem>
          )}
        />
        {/* You can add location field here if needed */}
         <Button
           type="submit"
           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 transition-colors"
           disabled={isSubmitting || (!!username && usernameMessage !== "Username is unique")}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
        </form>
      </Form>
      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
          Sign In
        </Link>
      </div>
      </div>
    </div>
  )
}

export default SignUpPage