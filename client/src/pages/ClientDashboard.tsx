import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Code, FileText, Calendar, Plus, User, Download, FileSignature } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function ClientDashboard() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && user?.role !== 'client') {
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

  const { data: client } = useQuery({
    queryKey: ["/api/clients/current"],
    enabled: !!user && user.role === 'client',
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

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messages"],
    enabled: !!user && user.role === 'client',
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/documents"],
    enabled: !!user && user.role === 'client',
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

  if (user.role !== 'client') {
    return null;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDocumentIcon = (type: string) => {
    if (type.includes('pdf')) return 'text-red-600';
    if (type.includes('doc')) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-500/10 text-green-600';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'reviewed':
        return 'bg-blue-500/10 text-blue-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <Navigation />
      
      {/* Client Header */}
      <div className="bg-background border-b pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back, <span>{client?.businessName || 'Client'}</span>
              </h1>
              <p className="text-muted-foreground">Your project dashboard and communication center</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {getInitials(client?.businessName || 'Client')}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {client?.contactName || user.firstName || 'Client'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Status */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Project Status</p>
                  <p className="text-xl font-bold text-green-600">In Development</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Documents</p>
                  <p className="text-xl font-bold text-foreground">
                    {documents?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {documents?.filter((doc: any) => doc.status === 'pending').length || 0} pending signatures
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Next Milestone</p>
                  <p className="text-lg font-semibold text-foreground">Beta Release</p>
                </div>
                <div className="w-12 h-12 bg-sky-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-sky-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Due: March 15, 2024</p>
            </CardContent>
          </Card>
        </div>

        {/* Messages & Documents */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-muted rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : messages?.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages?.slice(0, 2).map((message: any) => (
                    <div key={message.id} className="flex space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-foreground">Project Manager</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{message.content}</p>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline">Reply</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="ghost" className="w-full">
                    View All Messages
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Center */}
          <Card>
            <CardHeader>
              <CardTitle>Document Center</CardTitle>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-muted rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : documents?.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No documents yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents?.slice(0, 3).map((document: any) => (
                    <div key={document.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          document.type.includes('pdf') ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          <FileText className={`h-5 w-5 ${getDocumentIcon(document.type)}`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{document.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {Math.round(document.size / 1024)} KB • {new Date(document.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {document.status === 'pending' && document.requiresSignature ? (
                          <Button 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "E-signature Opening",
                                description: "Digital signature interface would open here.",
                              });
                            }}
                          >
                            <FileSignature className="h-4 w-4 mr-1" />
                            Sign Now
                          </Button>
                        ) : (
                          <Badge className={getDocumentStatusColor(document.status)}>
                            {document.status}
                          </Badge>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // Simulate document download
                            toast({
                              title: "Download Started",
                              description: `Downloading ${document.name}...`,
                            });
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Feature Coming Soon",
                        description: "Extended document management is coming in the next update.",
                      });
                    }}
                  >
                    View All Documents
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
