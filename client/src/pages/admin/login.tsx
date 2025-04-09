import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

// Form schema for admin login
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

const AdminLoginPage = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Set up the form
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Set up the login mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoginValues) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Invalid credentials");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
        variant: "success",
      });
      
      // Redirect to admin dashboard
      setLocation("/admin/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message || "Failed to log in. Please check your credentials.",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: LoginValues) => {
    mutate(data);
  };
  
  return (
    <div className="min-h-screen bg-[#fff5f7] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-[#e8c1c8] p-8">
        <div className="text-center mb-8">
          <h1 className="font-['Great_Vibes'] text-4xl text-[#6b0f2b] mb-2">Admin Login</h1>
          <p className="text-[#718096] text-sm">Please log in to access the admin dashboard</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      autoComplete="username"
                      className="w-full px-4 py-2 border border-[#e8c1c8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b0f2b]" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
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
                      {...field} 
                      type="password"
                      autoComplete="current-password"
                      className="w-full px-4 py-2 border border-[#e8c1c8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b0f2b]" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-[#6b0f2b] text-white hover:bg-[#890f32]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : "Login"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-[#6b0f2b] hover:text-[#890f32] text-sm inline-block"
          >
            Back to Wedding Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;