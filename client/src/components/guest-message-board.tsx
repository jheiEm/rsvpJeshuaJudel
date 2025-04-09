import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2, Send, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { guestMessageFormSchema, type GuestMessage } from '@shared/schema';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Form values type derived from the shared schema
type MessageFormValues = z.infer<typeof guestMessageFormSchema>;

const GuestMessageBoard: React.FC = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Form setup
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(guestMessageFormSchema),
    defaultValues: {
      name: '',
      message: '',
    },
  });

  // Query to fetch messages
  const {
    data: messages,
    isLoading: isLoadingMessages,
    error,
  } = useQuery<GuestMessage[]>({
    queryKey: ['/api/guest-messages'],
    retry: 2,
  });

  // Mutation to post a new message
  const postMessageMutation = useMutation({
    mutationFn: async (data: MessageFormValues) => {
      // Create a FormData object to handle the file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('message', data.message);
      
      if (selectedFile) {
        formData.append('photo', selectedFile);
      }
      
      // Make the API request with FormData
      const response = await fetch('/api/guest-messages', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post message');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Reset form and selected file
      form.reset();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Show success toast
      toast({
        title: 'Message Posted',
        description: 'Your message has been added to the board!',
      });
      
      // Invalidate query to refresh messages
      queryClient.invalidateQueries({ queryKey: ['/api/guest-messages'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to post message. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: MessageFormValues) => {
    postMessageMutation.mutate(data);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Check file size (max 5MB)
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image under 5MB',
          variant: 'destructive',
        });
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      setSelectedFile(file);
    }
  };

  // Format date string for display
  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div id="messages" className="w-full max-w-4xl mx-auto py-16 px-4 scroll-mt-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold font-['Great_Vibes'] text-[#6b0f2b] text-5xl">Guest Message Board</h2>
        <p className="text-gray-600 mt-2 font-['Cormorant_Garamond'] text-xl">
          Leave a message or well wishes for the couple
        </p>
      </div>

      {/* Message Form */}
      <Card className="mb-10 border border-[#6b0f2b]/20 shadow-md">
        <CardHeader className="bg-[#6b0f2b]/5">
          <CardTitle className="text-[#6b0f2b] font-['Cormorant_Garamond']">Post a Message</CardTitle>
          <CardDescription className="font-['Cormorant_Garamond'] text-base">
            Share your thoughts, wishes, or memories with the couple
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-['Cormorant_Garamond'] text-base font-semibold">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                className="border-[#6b0f2b]/20 focus:border-[#6b0f2b] focus:ring-[#6b0f2b]/20"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-[#6b0f2b]">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="font-['Cormorant_Garamond'] text-base font-semibold">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Write your message here..."
                className="min-h-[100px] border-[#6b0f2b]/20 focus:border-[#6b0f2b] focus:ring-[#6b0f2b]/20"
                {...form.register('message')}
              />
              {form.formState.errors.message && (
                <p className="text-sm text-[#6b0f2b]">{form.formState.errors.message.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo" className="block font-['Cormorant_Garamond'] text-base font-semibold">
                Add a Photo (Optional)
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  ref={fileInputRef}
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 border-[#6b0f2b]/30 text-[#6b0f2b] hover:bg-[#6b0f2b]/10"
                >
                  <ImageIcon className="h-4 w-4" />
                  {selectedFile ? 'Change Photo' : 'Choose Photo'}
                </Button>
                {selectedFile && (
                  <span className="text-sm text-gray-500">
                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </span>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#6b0f2b] hover:bg-[#6b0f2b]/90 text-white"
              disabled={postMessageMutation.isPending}
            >
              {postMessageMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Messages Display */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 font-['Cormorant_Garamond'] text-[#6b0f2b]">Messages</h3>

        {isLoadingMessages ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-[#6b0f2b]" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-[#6b0f2b]">
            Failed to load messages. Please try again later.
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {messages.map((message) => (
              <Card key={message.id} className="overflow-hidden border border-[#6b0f2b]/20 shadow-sm">
                <CardHeader className="pb-2 bg-[#6b0f2b]/5">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-['Cormorant_Garamond'] text-[#6b0f2b]">{message.name}</CardTitle>
                    <span className="text-xs text-gray-500">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="whitespace-pre-line font-['Montserrat'] text-[#2d3748]">{message.message}</p>
                </CardContent>
                {message.photoUrl && (
                  <div className="px-6 pb-6">
                    <div className="aspect-video relative overflow-hidden rounded-md border border-[#6b0f2b]/10">
                      <img
                        src={message.photoUrl}
                        alt={`Photo from ${message.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 font-['Cormorant_Garamond'] text-lg">
            No messages yet. Be the first to leave a message!
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestMessageBoard;