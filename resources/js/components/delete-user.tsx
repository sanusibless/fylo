import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DeleteUser() {
  const [confirming, setConfirming] = useState(false);

  const { data, setData, delete: destroy, processing, errors, reset } = useForm({
    password: "",
  });

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => {
        setConfirming(false);
        reset();
      },
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6">
      <div>
        <h3 className="text-base font-bold text-rose-400">Delete Account</h3>
        <p className="mt-1 text-xs text-gray-400">
          Once your account is deleted, all of your uploaded files, folders, and billing records
          will be permanently erased.
        </p>
      </div>

      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => setConfirming(true)}
        className="text-xs font-semibold"
      >
        Delete Account
      </Button>

      <Dialog
        open={confirming}
        onOpenChange={(open) => {
          setConfirming(open);
          if (!open) reset();
        }}
      >
        <DialogContent className="bg-[#1c2431] border border-slate-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Account Deletion</DialogTitle>
            <DialogDescription className="text-gray-400 text-xs">
              Please enter your current password to confirm you want to permanently delete your Fylo
              account and all stored files.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDelete} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="delete-password" className="text-xs text-gray-300">
                Current Password
              </Label>
              <Input
                id="delete-password"
                type="password"
                required
                autoFocus
                placeholder="Enter your password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                className="mt-1.5 bg-[#0b1523] border-slate-700 text-white"
              />
              <InputError message={errors.password} className="mt-1" />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirming(false)}
                disabled={processing}
                className="bg-slate-800 border-slate-700 text-white text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={processing}
                className="text-xs font-bold"
              >
                {processing ? "Deleting..." : "Permanently Delete Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
