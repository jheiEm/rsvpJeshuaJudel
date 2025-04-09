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
import { Loader2, Phone, Instagram, Twitter, Facebook } from "lucide-react";

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
  
  // Dress code color palette
  const dressCodeColors = [
    "#2a0808", // Dark burgundy
    "#a32035", // Deep red
    "#c9a7a0", // Dusty rose
    "#e6c8b1", // Peach
    "#f7e5e4"  // Light blush
  ];
  
  return (
    <section id="rsvp" className="py-20 bg-[#fff5f7]">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-['Great_Vibes'] text-4xl md:text-5xl text-[#6b0f2b] text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          RSVP
        </motion.h2>
        
        <motion.p 
          className="text-center text-[#718096] max-w-xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          We have reserved ____ seat(s) for you. We hope that you can make it to our wedding. 
          Please let us know by April 20, 2025.
        </motion.p>
        
        {/* Dress Code Section */}
        <motion.div
          className="max-w-xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="font-['Great_Vibes'] text-3xl text-[#6b0f2b] text-center mb-4">Dress Code</h3>
          <p className="text-center text-[#718096] mb-4">
            We request if possible that all guests would wear semi formal or casual attire
            with touch of any of the following colors:
          </p>
          <div className="flex justify-center gap-4 mb-6">
            {dressCodeColors.map((color, index) => (
              <div 
                key={index} 
                className="w-12 h-12 rounded-full shadow-sm border border-gray-200" 
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
          
          <h3 className="font-['Great_Vibes'] text-3xl text-[#6b0f2b] text-center mb-4 mt-10">Wedding Gift Guide</h3>
          <p className="text-center text-[#718096] italic px-4">
            "With all that we have, we have been truly blessed. Your presence and prayers all that we request. 
            But if you desire to give nonetheless, a monetary gift is one we suggest."
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md border border-[#e8c1c8] mb-10"
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
                        className="w-full px-4 py-2 border border-[#e8c1c8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#e8c1c8]" 
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
                        className="w-full px-4 py-2 border border-[#e8c1c8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#e8c1c8]" 
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
                        <SelectTrigger className="w-full border border-[#e8c1c8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#e8c1c8]">
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
                    <FormLabel className="font-['Cormorant_Garamond'] text-[#4a5568]">Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4}
                        className="w-full px-4 py-2 border border-[#e8c1c8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#e8c1c8]" 
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
                    className="bg-[#6b0f2b] text-white font-['Cormorant_Garamond'] px-8 py-3 rounded-md hover:bg-[#890f32] transition-colors transform hover:-translate-y-2 hover:shadow-lg duration-300"
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
        
        {/* Contact Phone */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-2">
            <Phone className="h-5 w-5 text-[#6b0f2b] mr-2" />
            <span className="text-[#4a5568]">+63 921 397 3751</span>
          </div>
        </motion.div>
        
        {/* Social Media */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="font-['Great_Vibes'] text-2xl text-[#6b0f2b] mb-4">Snap & Share</h3>
          <p className="text-[#718096] mb-4">If you happen to snap a pic, don't forget to do a tag of it</p>
          <p className="text-[#6b0f2b] font-bold tracking-wider mb-4">#JESHUANNABEWITHUDLFOREEVER</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="text-[#6b0f2b] hover:text-[#890f32]">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-[#6b0f2b] hover:text-[#890f32]">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-[#6b0f2b] hover:text-[#890f32]">
              <Facebook className="h-6 w-6" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RsvpForm;
