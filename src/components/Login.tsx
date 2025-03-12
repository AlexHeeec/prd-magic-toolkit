
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsAnimating(true);
      await login(email, password);
      toast.success("Login successful");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Login failed");
      }
      setIsAnimating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/50">
      <div className={`w-full max-w-md transition-all duration-500 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-4 rounded-full bg-primary/5 mb-3">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold">PRD Magic Toolkit</h1>
          <p className="text-muted-foreground mt-2">Sign in to access your workbench</p>
        </div>
        
        <Card className="glass-card animate-scale-in">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="subtle-focus-ring"
                    autoComplete="email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="subtle-focus-ring pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full shadow-sm hover:shadow-md transition-all" 
              onClick={handleSubmit} 
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Sign In</span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-6 animate-fade-in">
          &copy; {new Date().getFullYear()} PRD Magic Toolkit. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
