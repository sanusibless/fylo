import { cn } from "@/lib/utils";

interface AppLogoIconProps {
    className?: string;
}

export default function AppLogoIcon({ className }: AppLogoIconProps) {
    return (
        <img src="/images/logo.svg" alt="Fylo Logo" className={cn("w-32", className)} />
    );
}
