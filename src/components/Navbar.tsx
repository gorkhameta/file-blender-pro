import { Button } from "@/components/ui/button";
import { Moon, Sun, FileText } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-primary bg-clip-text text-transparent">TRPP</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            Convert
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            Merge
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            Split
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            Compress
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            OCR
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            Tools
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-9 h-9 p-0"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          
          <Button variant="default" size="sm">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
}