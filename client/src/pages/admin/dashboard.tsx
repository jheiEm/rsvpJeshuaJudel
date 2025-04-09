import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Rsvp } from '@shared/schema';
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
  XCircle
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
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;