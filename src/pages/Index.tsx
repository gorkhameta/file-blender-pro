import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { ToolTabs } from "@/components/ToolTabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Zap, 
  Shield, 
  Globe,
  Star,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/auth';
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto animate-pulse">
            <div className="w-6 h-6 bg-white rounded"></div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
              <Star className="w-3 h-3 mr-1" />
              The Ultimate PDF Tool
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Transform Documents
              <br />
              with Ease
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Convert, merge, split, compress, and enhance your documents with our powerful PDF toolkit. 
              Fast, secure, and works offline.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" className="gap-2">
              <Zap className="w-5 h-5" />
              Start Processing
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="lg" className="gap-2">
              <Globe className="w-5 h-5" />
              Try Online Demo
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Universal Conversion</h3>
              <p className="text-sm text-muted-foreground">
                Convert between PDF, Word, Excel, PowerPoint, and image formats with perfect quality.
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Process files in seconds with our optimized algorithms. Batch processing for maximum efficiency.
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your files are processed locally and automatically deleted. No data retention, guaranteed privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tool Interface */}
      <section className="py-12 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Choose Your Tool</h2>
            <p className="text-muted-foreground">
              Select the tool you need and start processing your documents instantly
            </p>
          </div>
          
          <ToolTabs />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 TRPP. All rights reserved. Built for productivity and privacy.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
