import { Search, Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import AuthLogoutModal from "@/pages/auth/logout-modal";
import useAuth from "@/hooks/use-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faHeadset, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { route } from "ziggy-js";

interface DashboardHeaderProps {
  onSidebarToggle: () => void;
}

export function DashboardHeader({ onSidebarToggle }: DashboardHeaderProps) {

    const user = useAuth();
    const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleLogout = () => {
        setOpenLogoutModal(true);
  }
  return (
    <>
    <header className="bg-fylo-header border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search files and folders..."
              className="w-80 pl-10 bg-muted/50 border-border focus:bg-card"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {user.initial}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FontAwesomeIcon icon={faCog} className="mr-2 h-4 w-4" />
                Settings
                </DropdownMenuItem>
              <DropdownMenuItem>
                <FontAwesomeIcon icon={faHeadset} className="mr-2 h-4 w-4" />

                Help & Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                    <span onClick={handleLogout} className="text-red-400 bg-none">
                    <FontAwesomeIcon icon={faRightFromBracket} className="mr-2 h-4 w-4 text-red-400 bg-none" />
                        Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
     {/* A logout modal */}
     <AuthLogoutModal url={route('logout')} open={openLogoutModal} onOpenChange={setOpenLogoutModal} />
    </>

  );
}
