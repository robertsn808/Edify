import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Users, FolderOpen, FileSignature, Mail, Plus, User, MoreVertical } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && (user as any)?.role !== 'admin') {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [user, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!user && (user as any).role === 'admin',
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return false;
      }
      return failureCount < 3;
    },
  });

  const { data: contactForms, isLoading: contactFormsLoading } = useQuery({
    queryKey: ["/api/contact-forms"],
    enabled: !!user && (user as any).role === 'admin',
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/clients"],
    enabled: !!user && (user as any).role === 'admin',
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if ((user as any).role !== 'admin') {
    return null;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-600';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <Navigation />
      
      {/* Admin Header */}
      <div className="bg-background border-b pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage clients and business operations</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => {
                // For now, create a sample client
                const sampleClient = {
                  businessName: "New Business",
                  contactName: "John Doe", 
                  email: "john@newbusiness.com",
                  phone: "555-0000",
                  address: "123 New St",
                  notes: "New client from admin panel",
                  status: "pending"
                };
                // TODO: Add proper client creation modal
                console.log("Creating client:", sampleClient);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {(user as any).firstName || 'Admin'} {(user as any).lastName || 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Clients</p>
                  <p className="text-2xl font-bold text-foreground">
                    {statsLoading ? '...' : stats?.totalClients || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Projects</p>
                  <p className="text-2xl font-bold text-foreground">
                    {statsLoading ? '...' : stats?.activeProjects || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <FolderOpen className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Pending Signatures</p>
                  <p className="text-2xl font-bold text-foreground">
                    {statsLoading ? '...' : stats?.pendingSignatures || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <FileSignature className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">New Inquiries</p>
                  <p className="text-2xl font-bold text-foreground">
                    {statsLoading ? '...' : stats?.newInquiries || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-sky-500/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Contact Forms */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Forms */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Contact Forms</CardTitle>
            </CardHeader>
            <CardContent>
              {contactFormsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-muted rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : contactForms?.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No contact forms yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contactForms?.slice(0, 3).map((form: any) => (
                    <div key={form.id} className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-foreground">{form.name}</p>
                            <p className="text-sm text-muted-foreground">{form.email}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(form.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {form.message}
                        </p>
                        <div className="flex space-x-2 mt-3">
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => {
                              // Open email client with pre-filled response
                              const subject = `Re: Your inquiry about Edify services`;
                              const body = `Hi ${form.name},\n\nThank you for your interest in Edify's web development services. I've reviewed your message and would like to schedule a call to discuss your project requirements.\n\nBest regards,\nEdify Team`;
                              window.open(`mailto:${form.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                            }}
                          >
                            Reply
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Mark as read/archived
                              // TODO: Implement proper API call
                              console.log("Archiving form:", form.id);
                            }}
                          >
                            Archive
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="ghost" className="w-full">
                    View All Contact Forms
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Client Management */}
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
            </CardHeader>
            <CardContent>
              {clientsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-muted rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : clients?.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No clients yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clients?.slice(0, 3).map((client: any) => (
                    <div key={client.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {getInitials(client.businessName)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{client.businessName}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="ghost" className="w-full">
                    Manage All Clients
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
