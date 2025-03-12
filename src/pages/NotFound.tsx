
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/10 rounded-full blur-xl"></div>
              <div className="relative bg-destructive/20 text-destructive p-6 rounded-full">
                <AlertCircle className="h-12 w-12" />
              </div>
            </div>
          </div>
          <h1 className="text-6xl font-bold">404</h1>
          <p className="text-xl text-muted-foreground">The page you're looking for cannot be found.</p>
          <Button asChild className="mt-4">
            <a href="/">Return to Dashboard</a>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
