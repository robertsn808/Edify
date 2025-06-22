import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Box, Rocket, Shield, Smartphone, Check } from "lucide-react";
import Navigation from "@/components/Navigation";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Landing() {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message! We'll get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Transform Your Business with
                <span className="text-blue-200 block">Professional Web Apps</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Edify delivers custom web applications that streamline operations, enhance customer experiences, and drive growth for small businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Your Project
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4"
                  onClick={() => {
                    // Scroll to features section to showcase capabilities
                    const featuresSection = document.querySelector('[data-section="features"]');
                    if (featuresSection) {
                      featuresSection.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      // Fallback: scroll to features
                      window.scrollTo({ top: 600, behavior: 'smooth' });
                    }
                  }}
                >
                  View Portfolio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section data-section="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Edify?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We specialize in creating powerful, user-friendly web applications that solve real business problems and drive measurable results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Fast Development</h3>
                <p className="text-muted-foreground">Get your web application up and running in weeks, not months. Our streamlined process ensures rapid delivery without compromising quality.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Enterprise Security</h3>
                <p className="text-muted-foreground">Bank-level security with encrypted data, secure authentication, and compliance with industry standards to protect your business.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="h-8 w-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Mobile-First Design</h3>
                <p className="text-muted-foreground">Responsive applications that work flawlessly on all devices, ensuring your customers can access your services anywhere.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Choose the perfect plan for your business needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Starter</h3>
                  <div className="text-3xl font-bold text-primary mb-2">$2,999</div>
                  <p className="text-muted-foreground">Perfect for small businesses</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-600 mr-3" />Basic web application</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-600 mr-3" />Mobile responsive</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-600 mr-3" />3 months support</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-600 mr-3" />Basic hosting included</li>
                </ul>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-primary shadow-lg relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <CardContent className="p-8 bg-primary text-white">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold mb-2">Professional</h3>
                  <div className="text-3xl font-bold mb-2">$5,999</div>
                  <p className="text-blue-100">For growing businesses</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center"><Check className="h-5 w-5 text-blue-200 mr-3" />Advanced web application</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-blue-200 mr-3" />User authentication</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-blue-200 mr-3" />Database integration</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-blue-200 mr-3" />6 months support</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-blue-200 mr-3" />Premium hosting</li>
                </ul>
                <Button 
                  className="w-full bg-white text-primary hover:bg-gray-100"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold text-primary mb-2">$9,999</div>
                  <p className="text-muted-foreground">For established businesses</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-600 mr-3" />Full-stack application</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-600 mr-3" />Admin & client portals</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-600 mr-3" />Document management</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-600 mr-3" />12 months support</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-600 mr-3" />Enterprise hosting</li>
                </ul>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground">Tell us about your project and we'll get back to you within 24 hours</p>
          </div>
          
          <Card>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@company.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your project requirements..." 
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
