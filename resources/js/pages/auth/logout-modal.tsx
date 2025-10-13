import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";
import { Form } from "@inertiajs/react";


export default function AuthLogoutModal({ url, open, onOpenChange }: { open?: boolean, onOpenChange?: (open: boolean) => void, url: string }) {

    const handleSubmit = (e : any) => {
        e.preventDefault();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Logging out</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to log out.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                    {/* <Button onClick={() => handleSubmit}>Logout</Button> */}
                    <Form action={url} method="POST" onSubmit={handleSubmit}>
                     <Button className="bg-red-600 text-white hover:bg-red-700" type="submit">Logout</Button>
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
}
