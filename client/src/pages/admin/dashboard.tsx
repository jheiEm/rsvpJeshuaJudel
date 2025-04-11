import { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Rsvp, MusicTrack, musicTrackFormSchema, type MusicTrackFormValues } from '@shared/schema';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  LogOut,
  RefreshCw,
  Download,
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  Music,
  Trash2,
  Play,
  Pause,
  Volume2,
  Plus,
  Upload
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Music Management Component
const MusicManagement = () => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const [addMusicOpen, setAddMusicOpen] = useState(false);
  
  // Create form for uploading music
  const form = useForm<MusicTrackFormValues>({
    resolver: zodResolver(musicTrackFormSchema),
    defaultValues: {
      title: '',
      artist: '',
      isActive: false,
      isYoutubeLink: false,
      youtubeUrl: '',
    },
  });
  
  // Get music tracks
  const { 
    data: musicTracks, 
    isLoading: isLoadingMusic, 
    isError: isErrorMusic, 
    error: musicError,
    refetch: refetchMusic 
  } = useQuery<MusicTrack[]>({
    queryKey: ['/api/admin/music'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/music');
      if (!res.ok) {
        throw new Error('Failed to fetch music tracks');
      }
      return await res.json();
    },
  });
  
  // Upload track mutation
  const { mutate: uploadTrack, isPending: isUploading } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/admin/music', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to upload music track');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Music track uploaded successfully',
        variant: 'success',
      });
      form.reset();
      setAddMusicOpen(false);
      refetchMusic();
      queryClient.invalidateQueries({ queryKey: ['/api/music/active'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload music track',
        variant: 'destructive',
      });
    },
  });
  
  // Set active track mutation
  const { mutate: setActiveTrack } = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('PUT', `/api/admin/music/${id}/active`);
      if (!response.ok) {
        throw new Error('Failed to set active track');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Active music track updated',
        variant: 'success',
      });
      refetchMusic();
      queryClient.invalidateQueries({ queryKey: ['/api/music/active'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to set active track',
        variant: 'destructive',
      });
    },
  });
  
  // Delete track mutation
  const { mutate: deleteTrack } = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/music/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete track');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Music track deleted',
        variant: 'success',
      });
      refetchMusic();
      // If we're playing this track, stop it
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setPlayingTrackId(null);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/music/active'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete track',
        variant: 'destructive',
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: MusicTrackFormValues) => {
    console.log("Form submitted with data:", data);
    
    // We need to create a FormData object to upload the file
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.artist) formData.append('artist', data.artist);
    formData.append('isActive', data.isActive ? 'true' : 'false');
    formData.append('isYoutubeLink', data.isYoutubeLink ? 'true' : 'false');
    
    if (data.isYoutubeLink) {
      // Handle YouTube link
      if (!data.youtubeUrl) {
        toast({
          title: 'Error',
          description: 'Please enter a YouTube URL',
          variant: 'destructive',
        });
        return;
      }
      
      console.log("Submitting YouTube URL:", data.youtubeUrl);
      formData.append('youtubeUrl', data.youtubeUrl);
      
      // Explicitly log FormData contents for debugging
      formData.forEach((value, key) => {
        console.log(`Form data: ${key} = ${value}`);
      });
      
      uploadTrack(formData);
    } else {
      // Handle file upload using fileInputRef
      console.log("File input element:", fileInputRef.current);
      console.log("Files selected:", fileInputRef.current?.files);
      
      if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
        console.log("File selected:", fileInputRef.current.files[0]);
        formData.append('musicFile', fileInputRef.current.files[0]);
        
        // Log FormData for debugging
        formData.forEach((value, key) => {
          console.log(`Form data: ${key} = ${value instanceof File ? value.name : value}`);
        });
        
        uploadTrack(formData);
      } else {
        toast({
          title: 'Error',
          description: 'Please select a music file',
          variant: 'destructive',
        });
      }
    }
  };
  
  // Toggle play/pause for a track
  const togglePlay = (track: MusicTrack) => {
    if (playingTrackId === track.id) {
      // If this track is already playing, toggle play/pause
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    } else {
      // If a different track is playing, stop it and play this one
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(track.filePath);
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setPlayingTrackId(track.id);
      }).catch(error => {
        console.error('Error playing audio:', error);
        toast({
          title: 'Playback Error',
          description: 'Could not play the audio file',
          variant: 'destructive',
        });
        setIsPlaying(false);
        setPlayingTrackId(null);
      });
    }
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#4a5568]">Wedding Music</h2>
          <p className="text-[#718096]">Manage the background music for your wedding website</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#e8c1c8] text-[#6b0f2b] hover:bg-[#fff5f7]"
            onClick={() => refetchMusic()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={addMusicOpen} onOpenChange={setAddMusicOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#6b0f2b] text-white hover:bg-[#890f32]">
                <Plus className="h-4 w-4 mr-2" />
                Add Music Track
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Music Track</DialogTitle>
                <DialogDescription>
                  Upload a music track to use as background music on your wedding website.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Track Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Wedding March" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="artist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artist (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Artist name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isYoutubeLink"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#e8c1c8] p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Use YouTube Link</FormLabel>
                          <FormDescription>
                            Add music from YouTube instead of uploading a file
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("isYoutubeLink") ? (
                    <FormField
                      control={form.control}
                      name="youtubeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter a valid YouTube video URL
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormItem>
                      <FormLabel>Music File</FormLabel>
                      <FormControl>
                        <Input 
                          ref={fileInputRef}
                          id="musicFile" 
                          type="file" 
                          accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg" 
                        />
                      </FormControl>
                      <FormDescription>
                        Upload MP3, WAV, or OGG files (max 10MB)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#e8c1c8] p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Set as Active Track</FormLabel>
                          <FormDescription>
                            This track will play automatically on the website
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setAddMusicOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[#6b0f2b] text-white hover:bg-[#890f32]" disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="rounded-md border border-[#e8c1c8]">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#fff5f7]">
              <TableHead className="text-[#4a5568]">Title</TableHead>
              <TableHead className="text-[#4a5568]">Artist</TableHead>
              <TableHead className="text-[#4a5568]">Status</TableHead>
              <TableHead className="text-[#4a5568]">Preview</TableHead>
              <TableHead className="text-[#4a5568]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingMusic ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 text-[#6b0f2b] animate-spin mb-2" />
                    <p className="text-[#4a5568]">Loading music tracks...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : isErrorMusic ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <XCircle className="h-8 w-8 text-red-500 mb-2" />
                    <p className="text-[#4a5568]">Error loading music tracks</p>
                    <p className="text-[#718096] text-sm">{musicError?.message}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : musicTracks && musicTracks.length > 0 ? (
              musicTracks.map((track) => (
                <TableRow key={track.id} className="hover:bg-[#fff5f7]">
                  <TableCell className="font-medium">{track.title}</TableCell>
                  <TableCell>{track.artist || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Switch 
                        checked={track.isActive || false} 
                        onCheckedChange={() => setActiveTrack(track.id)}
                        disabled={track.isActive || false}
                      />
                      <span className="ml-2">
                        {track.isActive ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Active
                          </Badge>
                        ) : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#e8c1c8] text-[#6b0f2b] hover:bg-[#fff5f7]"
                      onClick={() => togglePlay(track)}
                    >
                      {playingTrackId === track.id && isPlaying ? (
                        <Pause className="h-4 w-4 mr-1" />
                      ) : (
                        <Play className="h-4 w-4 mr-1" />
                      )}
                      {playingTrackId === track.id && isPlaying ? "Pause" : "Play"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this track?")) {
                          deleteTrack(track.id);
                        }
                      }}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-[#4a5568]">No music tracks found</p>
                    <p className="text-[#718096] text-sm">Add a track to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch RSVPs
  const { data: rsvps, isLoading, isError, error, refetch } = useQuery<Rsvp[]>({
    queryKey: ['/api/admin/rsvps'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/rsvps');
      if (!res.ok) {
        if (res.status === 401) {
          // Redirect to login if unauthorized
          setLocation('/admin/login');
          throw new Error('You are not logged in');
        }
        throw new Error('Failed to fetch RSVPs');
      }
      return await res.json();
    },
  });
  
  // Logout mutation
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/admin/logout');
    },
    onSuccess: () => {
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully',
        variant: 'success',
      });
      setLocation('/admin/login');
    },
    onError: (error) => {
      toast({
        title: 'Logout failed',
        description: error.message || 'Failed to log out',
        variant: 'destructive',
      });
    },
  });
  
  // Filter RSVPs based on search term
  const filteredRsvps = rsvps?.filter(rsvp => {
    const searchLower = searchTerm.toLowerCase();
    return (
      rsvp.name.toLowerCase().includes(searchLower) ||
      rsvp.email.toLowerCase().includes(searchLower) ||
      rsvp.phone.toLowerCase().includes(searchLower) ||
      rsvp.guestCount.toString().includes(searchLower) ||
      rsvp.message?.toLowerCase().includes(searchLower) ||
      rsvp.status.toLowerCase().includes(searchLower)
    );
  });
  
  // Handle CSV export
  const exportToCSV = () => {
    if (!rsvps?.length) return;
    
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Guest Count', 'Attending', 'Dietary Needs', 'Message', 'Date'];
    
    const csvContent = [
      headers.join(','),
      ...rsvps.map(rsvp => [
        `"${rsvp.name.replace(/"/g, '""')}"`,
        `"${rsvp.email.replace(/"/g, '""')}"`,
        `"${rsvp.phone.replace(/"/g, '""')}"`,
        rsvp.guestCount,
        rsvp.status === 'attending' ? 'Yes' : rsvp.status === 'not-attending' ? 'No' : 'Maybe',
        `"${(rsvp.dietaryRestrictions || '').replace(/"/g, '""')}"`,
        `"${(rsvp.message || '').replace(/"/g, '""')}"`,
        new Date(rsvp.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast({
      title: 'Export successful',
      description: 'RSVP data has been exported to CSV',
      variant: 'success',
    });
  };
  
  // Redirect to login if unauthorized
  useEffect(() => {
    if (isError && error?.message === 'You are not logged in') {
      setLocation('/admin/login');
    }
  }, [isError, error, setLocation]);
  
  return (
    <div className="min-h-screen bg-[#fff5f7]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#e8c1c8]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-['Great_Vibes'] text-3xl text-[#6b0f2b]">Admin Dashboard</h1>
          <Button 
            variant="ghost" 
            className="text-[#6b0f2b] hover:bg-[#fff5f7]"
            onClick={() => logout()}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LogOut className="h-4 w-4 mr-2" />}
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md border border-[#e8c1c8] p-6"
        >
          <Tabs defaultValue="rsvps" className="w-full">
            <TabsList className="mb-6 bg-[#fff5f7] border border-[#e8c1c8]">
              <TabsTrigger 
                value="rsvps" 
                className="data-[state=active]:bg-[#6b0f2b] data-[state=active]:text-white"
              >
                RSVPs
              </TabsTrigger>
              <TabsTrigger 
                value="music" 
                className="data-[state=active]:bg-[#6b0f2b] data-[state=active]:text-white"
              >
                Wedding Music
              </TabsTrigger>
              <TabsTrigger 
                value="messages" 
                className="data-[state=active]:bg-[#6b0f2b] data-[state=active]:text-white"
              >
                Guest Messages
              </TabsTrigger>
            </TabsList>
            
            {/* RSVP Tab */}
            <TabsContent value="rsvps" className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-semibold text-[#4a5568]">Wedding RSVPs</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search RSVPs..."
                      className="pl-8 border-[#e8c1c8] focus-visible:ring-[#6b0f2b]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-[#e8c1c8] text-[#6b0f2b] hover:bg-[#fff5f7]"
                    onClick={() => refetch()}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button 
                    className="bg-[#6b0f2b] text-white hover:bg-[#890f32]"
                    onClick={exportToCSV}
                    disabled={!rsvps?.length}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
              
              {/* RSVP stats */}
              {rsvps && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#fff5f7] p-4 rounded-lg border border-[#e8c1c8]">
                    <h3 className="text-sm font-medium text-[#718096] mb-2">Total RSVPs</h3>
                    <p className="text-2xl font-bold text-[#6b0f2b]">{rsvps.length}</p>
                  </div>
                  <div className="bg-[#fff5f7] p-4 rounded-lg border border-[#e8c1c8]">
                    <h3 className="text-sm font-medium text-[#718096] mb-2">Attending</h3>
                    <p className="text-2xl font-bold text-[#6b0f2b]">
                      {rsvps.filter(r => r.status === 'attending').length}
                    </p>
                  </div>
                  <div className="bg-[#fff5f7] p-4 rounded-lg border border-[#e8c1c8]">
                    <h3 className="text-sm font-medium text-[#718096] mb-2">Total Guests</h3>
                    <p className="text-2xl font-bold text-[#6b0f2b]">
                      {rsvps.filter(r => r.status === 'attending').reduce((sum, r) => sum + r.guestCount, 0)}
                    </p>
                  </div>
                </div>
              )}
              
              {/* RSVP table */}
              <div className="rounded-md border border-[#e8c1c8]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#fff5f7]">
                      <TableHead className="text-[#4a5568]">Name</TableHead>
                      <TableHead className="text-[#4a5568]">Status</TableHead>
                      <TableHead className="text-[#4a5568]">Guests</TableHead>
                      <TableHead className="text-[#4a5568]">Phone</TableHead>
                      <TableHead className="text-[#4a5568]">Email</TableHead>
                      <TableHead className="text-[#4a5568]">Special Requests</TableHead>
                      <TableHead className="text-[#4a5568]">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center">
                            <Loader2 className="h-8 w-8 text-[#6b0f2b] animate-spin mb-2" />
                            <p className="text-[#4a5568]">Loading RSVPs...</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : isError ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center">
                            <XCircle className="h-8 w-8 text-red-500 mb-2" />
                            <p className="text-[#4a5568]">Error loading RSVPs</p>
                            <p className="text-[#718096] text-sm">{error?.message}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredRsvps?.length ? (
                      filteredRsvps.map((rsvp) => (
                        <TableRow key={rsvp.id} className="hover:bg-[#fff5f7]">
                          <TableCell className="font-medium">{rsvp.name}</TableCell>
                          <TableCell>
                            <Badge className={`${
                              rsvp.status === 'attending' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                : rsvp.status === 'not-attending'
                                  ? 'bg-red-100 text-red-800 hover:bg-red-100'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                            }`}>
                              {rsvp.status === 'attending'
                                ? 'Attending'
                                : rsvp.status === 'not-attending'
                                  ? 'Not Attending'
                                  : 'Undecided'}
                            </Badge>
                          </TableCell>
                          <TableCell>{rsvp.guestCount}</TableCell>
                          <TableCell>{rsvp.phone}</TableCell>
                          <TableCell>{rsvp.email}</TableCell>
                          <TableCell>
                            {rsvp.dietaryRestrictions || rsvp.message ? (
                              <div className="max-w-xs overflow-hidden truncate">
                                {rsvp.dietaryRestrictions ? <p><span className="font-medium">Dietary:</span> {rsvp.dietaryRestrictions}</p> : null}
                                {rsvp.message ? <p><span className="font-medium">Message:</span> {rsvp.message}</p> : null}
                              </div>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </TableCell>
                          <TableCell>{new Date(rsvp.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-[#4a5568]">No RSVPs found</p>
                            {searchTerm && (
                              <p className="text-[#718096] text-sm">Try adjusting your search criteria</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Music Tab */}
            <TabsContent value="music" className="space-y-6">
              <MusicManagement />
            </TabsContent>
            
            {/* Guest Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <div className="flex flex-col space-y-4">
                <h2 className="text-xl font-semibold text-[#4a5568]">Guest Message Moderation</h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <Button onClick={() => setLocation('/admin/guest-messages')} className="flex items-center gap-2">
                    <span>Go to Guest Messages Management</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;