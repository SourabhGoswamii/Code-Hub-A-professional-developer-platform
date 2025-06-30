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
import { Loader2, User, Mail, Lock, Link as LinkIcon, MapPin, Image, FileText } from "lucide-react";
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
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-white to-blue-100 p-4 flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-green-500/10 to-transparent"></div>
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden relative z-10">
        {/* Left Side - Image */}
        <div className="md:w-1/2 relative overflow-hidden">
          <img 
            src="/Verify.jpg" 
            alt="Verification Illustration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/20 mix-blend-multiply"></div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-12 bg-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Create Account</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Username</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setUsername(e.target.value);
                          }}
                          className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                          placeholder="Choose a unique username"
                        />
                      </div>
                      {isCheckingUsername && <Loader2 className="animate-spin ml-2 h-4 w-4 text-green-500" />}
                      {!isCheckingUsername && usernameMessage && (
                        <p className={`text-sm mt-1 ${
                          usernameMessage === "Username is unique"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}>
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
                      <FormLabel className="text-gray-700">Full Name</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input 
                          {...field} 
                          placeholder="Enter your full name"
                          className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="Enter your email"
                          className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input 
                          {...field} 
                          type="password" 
                          placeholder="Create a strong password"
                          className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Bio (Optional)</FormLabel>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input 
                          {...field} 
                          placeholder="Tell us about yourself"
                          className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Avatar URL (Optional)</FormLabel>
                      <div className="relative">
                        <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input 
                          {...field} 
                          placeholder="Paste your avatar image URL"
                          className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Website (Optional)</FormLabel>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input 
                          {...field} 
                          placeholder="Your website URL"
                          className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 rounded-lg transition-all duration-150 shadow-md hover:shadow-lg mt-6"
                  disabled={isSubmitting || (!!username && usernameMessage !== "Username is unique")}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <p className="mt-6 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="font-medium text-green-600 hover:text-green-800">
                    Sign In
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;