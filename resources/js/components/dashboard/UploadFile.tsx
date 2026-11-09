"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { LoaderCircle, Upload } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { route } from "ziggy-js";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

const formSchema = z.object({
  file: z
    .custom<FileList>((val) => typeof window !== 'undefined' && val instanceof FileList, "File is required")
    .refine((files) => files && files.length > 0, "Please select a file to upload")
    .refine(
      (files) => files && files[0].size <= 50 * 1024 * 1024,
      "File size must not exceed 50MB"
    )
});

export default function UploadFile() {
  const [openUploadFile, setOpenUploadFile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const file = values.file[0];
    router.post(route("file.upload"), { file }, {
      onSuccess: () => {
        setOpenUploadFile(false);
        form.reset();
        toast.success("File uploaded successfully");
        setIsLoading(false);
      },
      onError: (errors: any) => {
        setIsLoading(false);
        setOpenUploadFile(true);
        const errorMsg = errors.file || errors.message || "Failed to upload file";
        toast.error(errorMsg);
        form.setError("file", {
          type: "server",
          message: errorMsg,
        });
      }
    });
  }

  return (
    <Dialog open={openUploadFile} onOpenChange={setOpenUploadFile}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-white font-medium py-2 rounded-lg shadow-sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload a file to Fylo</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose file (up to 50MB)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.svg,.webp,.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.rtf,.mp4,.mov,.avi,.wav,.mp3,.zip,.rar,.7z,.tar,.gz"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              {!isLoading ? (
                <div className="flex items-center justify-end space-x-2 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenUploadFile(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-primary text-white">
                    Upload
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-end w-full py-2">
                  <LoaderCircle className="h-5 w-5 animate-spin text-teal-400 mr-2" />
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                </div>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
