import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Box } from "lucide-react";
import { Link } from "wouter";

export default function Navigation() {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Box className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Edify</span>
            </div>
            {isAuthenticated && (
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                {(user as any)?.role === 'admin' && (
                  <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                    Admin Portal
                  </Link>
                )}
                {(user as any)?.role === 'client' && (
                  <Link href="/client" className="text-muted-foreground hover:text-primary transition-colors">
                    Client Portal
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/api/logout'}
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
