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
import { Link } from "@inertiajs/react";

interface DashboardHeaderProps {
  onSidebarToggle: () => void;
  onSearch?: (query: string) => void;
}

export function DashboardHeader({ onSidebarToggle, onSearch }: DashboardHeaderProps) {
  const user = useAuth();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const handleLogout = () => {
    setOpenLogoutModal(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchVal(value);
    onSearch?.(value);
  };

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
                value={searchVal}
                onChange={handleSearchChange}
                className="w-80 pl-10 bg-muted/50 border-border focus:bg-card text-foreground"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarFallback className="bg-gradient-primary text-white font-semibold text-xs">
                      {user?.initial || (user?.name ? user.name.substring(0, 2).toUpperCase() : 'U')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/settings/profile" className="flex items-center w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/appearance" className="flex items-center w-full cursor-pointer">
                    <FontAwesomeIcon icon={faCog} className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/faqs" className="flex items-center w-full cursor-pointer">
                    <FontAwesomeIcon icon={faHeadset} className="mr-2 h-4 w-4" />
                    Help & Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 focus:text-red-400">
                  <FontAwesomeIcon icon={faRightFromBracket} className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Logout modal */}
      <AuthLogoutModal url={route('logout')} open={openLogoutModal} onOpenChange={setOpenLogoutModal} />
    </>
  );
}

export default DashboardHeader;
