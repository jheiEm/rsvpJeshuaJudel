import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Trash2, Eye, Check, X } from "lucide-react";

interface GuestMessage {
  id: number;
  name: string;
  message: string;
  photoUrl: string | null;
  approved: boolean;
  createdAt: string;
}

const GuestMessagesAdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedMessage, setSelectedMessage] = useState<GuestMessage | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [, setLocation] = useLocation();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiRequest("GET", "/api/admin/guest-messages");
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

  // Fetch all guest messages
  const { data: messages, isLoading } = useQuery<GuestMessage[]>({
    queryKey: ["/api/admin/guest-messages"],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const response = await apiRequest("GET", "/api/admin/guest-messages");
      return response.json();
    },
    enabled: isAuthenticated,
  });

  // Toggle message approval
  const toggleApprovalMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: number; approved: boolean }) => {
      const response = await apiRequest("PUT", `/api/admin/guest-messages/${id}/approve`, {
        approved,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Message approval updated",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guest-messages"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update message approval",
        variant: "destructive",
      });
    },
  });

  // Delete message mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/guest-messages/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Message deleted successfully",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guest-messages"] });
      setShowDeleteConfirm(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete message",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  const handleToggleApproval = (message: GuestMessage) => {
    toggleApprovalMutation.mutate({
      id: message.id,
      approved: !message.approved,
    });
  };

  const handleViewDetails = (message: GuestMessage) => {
    setSelectedMessage(message);
    setShowDetails(true);
  };

  const handleDelete = (message: GuestMessage) => {
    setSelectedMessage(message);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedMessage) {
      deleteMutation.mutate(selectedMessage.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Guest Messages Management</h1>
        <Button 
          variant="outline" 
          className="mt-4 md:mt-0"
          onClick={() => setLocation('/admin/dashboard')}
        >
          ← Back to Dashboard
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !messages || messages.length === 0 ? (
        <p className="text-center text-gray-500 my-12">No guest messages found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((message) => (
            <Card key={message.id} className={message.approved ? "" : "border-dashed border-gray-300 bg-gray-50"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{message.name}</CardTitle>
                  {message.approved ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Approved
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      Pending Approval
                    </span>
                  )}
                </div>
                <CardDescription>{formatDate(message.createdAt)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3">{message.message}</p>
                {message.photoUrl && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">Has Photo</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(message)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button
                    size="sm"
                    variant={message.approved ? "outline" : "default"}
                    onClick={() => handleToggleApproval(message)}
                  >
                    {message.approved ? (
                      <>
                        <X className="h-4 w-4 mr-1" /> Unapprove
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </>
                    )}
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(message)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Message Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Guest message from {selectedMessage?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="py-4">
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Message</h3>
                <p className="p-3 bg-gray-50 rounded-md">{selectedMessage.message}</p>
              </div>

              {selectedMessage.photoUrl && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Photo</h3>
                  <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={selectedMessage.photoUrl}
                      alt="Guest photo"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold mb-2">Guest Information</h3>
                  <p>
                    <span className="text-gray-500">Name:</span> {selectedMessage.name}
                  </p>
                  <p>
                    <span className="text-gray-500">Date:</span> {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Approved:</span>
                    {selectedMessage.approved ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-yellow-600">No</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="space-x-2">
            <Button
              variant={selectedMessage?.approved ? "outline" : "default"}
              onClick={() => {
                if (selectedMessage) {
                  handleToggleApproval(selectedMessage);
                  setShowDetails(false);
                }
              }}
            >
              {selectedMessage?.approved ? "Unapprove" : "Approve"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDetails(false);
                if (selectedMessage) {
                  handleDelete(selectedMessage);
                }
              }}
            >
              Delete
            </Button>
            <Button variant="secondary" onClick={() => setShowDetails(false)}>
              Close
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
              Are you sure you want to delete this message? This action cannot be
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

export default GuestMessagesAdminPage;