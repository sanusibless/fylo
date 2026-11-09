import { cn } from "@/lib/utils";
import { type HTMLAttributes, type ReactNode } from "react";

interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: string;
}

export function AppShell({ children, className, variant, ...props }: AppShellProps) {
    return (
        <div className={cn("min-h-screen bg-gray-100 flex", className)} {...props}>
            {children}
        </div>
    );
}
