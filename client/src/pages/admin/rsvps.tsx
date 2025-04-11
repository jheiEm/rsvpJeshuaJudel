import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Trash2, Eye, Edit } from "lucide-react";

interface Rsvp {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  status: string;
  guestCount: number;
  additionalGuests: string | null;
  dietaryRestrictions: string | null;
  message: string | null;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  "attending": "Attending",
  "not-attending": "Not Attending",
  "undecided": "Undecided",
};

const statusColors: Record<string, string> = {
  "attending": "text-green-600",
  "not-attending": "text-red-600",
  "undecided": "text-yellow-600",
};

const RsvpsAdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedRsvp, setSelectedRsvp] = useState<Rsvp | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiRequest("GET", "/api/admin/rsvps");
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/login", {
        username,
        password,
      });
      return response.json();
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "Logged in successfully",
        variant: "success",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  // Fetch all RSVPs
  const { data: rsvps, isLoading } = useQuery<Rsvp[]>({
    queryKey: ["/api/admin/rsvps"],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const response = await apiRequest("GET", "/api/admin/rsvps");
      return response.json();
    },
    enabled: isAuthenticated,
  });

  // Delete RSVP mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/rsvps/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "RSVP deleted successfully",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rsvps"] });
      setShowDeleteConfirm(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete RSVP",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  const handleViewDetails = (rsvp: Rsvp) => {
    setSelectedRsvp(rsvp);
    setShowDetails(true);
  };

  const handleDelete = (rsvp: Rsvp) => {
    setSelectedRsvp(rsvp);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedRsvp) {
      deleteMutation.mutate(selectedRsvp.id);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">RSVP Management</h1>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !rsvps || rsvps.length === 0 ? (
        <p className="text-center text-gray-500 my-12">No RSVPs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>List of all RSVPs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rsvps.map((rsvp) => (
                <TableRow key={rsvp.id}>
                  <TableCell className="font-medium">{rsvp.name}</TableCell>
                  <TableCell>
                    {rsvp.email && <div>{rsvp.email}</div>}
                    <div>{rsvp.phone}</div>
                  </TableCell>
                  <TableCell>
                    <span className={statusColors[rsvp.status]}>
                      {statusLabels[rsvp.status] || rsvp.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>{rsvp.guestCount} total</div>
                    {rsvp.additionalGuests && (
                      <div className="text-xs text-gray-500">
                        +{rsvp.additionalGuests}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(rsvp.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(rsvp)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(rsvp)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* RSVP Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>RSVP Details</DialogTitle>
            <DialogDescription>
              Detailed information for this RSVP
            </DialogDescription>
          </DialogHeader>

          {selectedRsvp && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <p>
                  <span className="text-gray-500">Name:</span>{" "}
                  {selectedRsvp.name}
                </p>
                <p>
                  <span className="text-gray-500">Email:</span>{" "}
                  {selectedRsvp.email || "Not provided"}
                </p>
                <p>
                  <span className="text-gray-500">Phone:</span>{" "}
                  {selectedRsvp.phone}
                </p>
                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  <span className={statusColors[selectedRsvp.status]}>
                    {statusLabels[selectedRsvp.status] || selectedRsvp.status}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Submitted:</span>{" "}
                  {new Date(selectedRsvp.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Guests & Preferences</h3>
                <p>
                  <span className="text-gray-500">Total Guests:</span>{" "}
                  {selectedRsvp.guestCount}
                </p>
                <p>
                  <span className="text-gray-500">Additional Guests:</span>{" "}
                  {selectedRsvp.additionalGuests || "None"}
                </p>
                <p>
                  <span className="text-gray-500">Dietary Restrictions:</span>{" "}
                  {selectedRsvp.dietaryRestrictions || "None specified"}
                </p>
                {selectedRsvp.message && (
                  <div className="mt-4">
                    <span className="text-gray-500">Message:</span>
                    <p className="mt-1 p-2 bg-gray-50 rounded">
                      {selectedRsvp.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDetails(false);
                if (selectedRsvp) {
                  handleDelete(selectedRsvp);
                }
              }}
            >
              Delete RSVP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this RSVP? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RsvpsAdminPage;