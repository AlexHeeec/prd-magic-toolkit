
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LogOut, TestTube } from "lucide-react";
import { toast } from "sonner";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      logout();
      toast.success("You have been logged out successfully");
    }, 300);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className={`w-full py-4 px-6 glass-card flex items-center justify-between mb-6 transition-all duration-300 ${isAnimatingOut ? 'opacity-0 transform -translate-y-4' : 'opacity-100'}`}>
      <div className="flex items-center">
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <TestTube className="h-4 w-4 text-primary" />
          </div>
        </div>
        <h1 className="text-xl font-medium ml-4">AIGenTest</h1>
        
        <NavigationMenu className="ml-8">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink 
                className="px-4 py-2 text-sm font-medium relative group"
                href="/"
              >
                Workspace
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-100 transition-transform" />
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 transition-transform hover:scale-105">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
