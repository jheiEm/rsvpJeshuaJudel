import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { rsvpFormSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type FormValues = z.infer<typeof rsvpFormSchema>;

const RsvpForm = () => {
  const { toast } = useToast();
  
  // Initialize react-hook-form with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      attending: undefined,
      guests: 1,
      message: "",
    },
  });
  
  // Setup mutation for form submission
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/rsvp", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thank you!",
        description: "Your RSVP has been submitted successfully.",
        variant: "success",
      });
      
      // Reset form
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: FormValues) => {
    mutate(data);
  };
  
  return (
    <section id="rsvp" className="py-20 bg-[#faf7f2]">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-['Great_Vibes'] text-4xl md:text-5xl text-[#d4af7a] text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          RSVP
        </motion.h2>
        
        <motion.p 
          className="text-center text-[#718096] max-w-xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          We look forward to celebrating our special day with you. Please let us know if you can make it by October 15, 2023.
        </motion.p>
        
        <motion.div 
          className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md border border-[#e6d5b8]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-['Cormorant_Garamond'] text-[#4a5568]">Full Name*</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="w-full px-4 py-2 border border-[#e6d5b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#e6d5b8]" 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
              
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-['Cormorant_Garamond'] text-[#4a5568]">Email Address*</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email" 
                        className="w-full px-4 py-2 border border-[#e6d5b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#e6d5b8]" 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
              
              {/* Attending Field */}
              <FormField
                control={form.control}
                name="attending"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-['Cormorant_Garamond'] text-[#4a5568]">Will you be attending?*</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="attending-yes" />
                          <label htmlFor="attending-yes">Joyfully Accept</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="attending-no" />
                          <label htmlFor="attending-no">Regretfully Decline</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
              
              {/* Number of Guests Field */}
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-['Cormorant_Garamond'] text-[#4a5568]">Number of Guests (including yourself)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full border border-[#e6d5b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#e6d5b8]">
                          <SelectValue placeholder="Select number of guests" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
              
              {/* Message Field */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-['Cormorant_Garamond'] text-[#4a5568]">Special Requests or Dietary Restrictions</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4}
                        className="w-full px-4 py-2 border border-[#e6d5b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#e6d5b8]" 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
              
              {/* Submit Button */}
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="bg-[#d4af7a] text-white font-['Cormorant_Garamond'] px-8 py-3 rounded-md hover:bg-[#c9a66b] transition-colors transform hover:-translate-y-2 hover:shadow-lg duration-300"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : "Send RSVP"}
                  </Button>
                </motion.div>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
};

export default RsvpForm;
