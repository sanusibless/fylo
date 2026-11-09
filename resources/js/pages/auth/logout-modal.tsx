import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AuthLogoutModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    url: string;
}

export default function AuthLogoutModal({ url, open = false, onOpenChange }: AuthLogoutModalProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleConfirmLogout = () => {
        setIsLoggingOut(true);
        router.post(url, {}, {
            onFinish: () => {
                setIsLoggingOut(false);
                onOpenChange?.(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Log out of Fylo</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to log out of your account? You will need to sign in again to access your files.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4 flex sm:justify-end gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onOpenChange?.(false)}
                        disabled={isLoggingOut}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={handleConfirmLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Log out
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
