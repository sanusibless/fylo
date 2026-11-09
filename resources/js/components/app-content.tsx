import { cn } from "@/lib/utils";
import { type HTMLAttributes, type ReactNode } from "react";

interface AppContentProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    variant?: string;
}

export function AppContent({ children, className, variant, ...props }: AppContentProps) {
    return (
        <main className={cn("flex-1 p-6", className)} {...props}>
            {children}
        </main>
    );
}
