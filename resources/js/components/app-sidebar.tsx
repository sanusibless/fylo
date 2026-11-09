import { cn } from "@/lib/utils";
import { type HTMLAttributes, type ReactNode } from "react";

interface AppSidebarProps extends HTMLAttributes<HTMLElement> {
    children?: ReactNode;
}

export function AppSidebar({ children, className, ...props }: AppSidebarProps) {
    return (
        <aside className={cn("w-64 bg-white border-r border-gray-200 hidden md:block", className)} {...props}>
            <div className="h-full flex flex-col">
                {children}
            </div>
        </aside>
    );
}
