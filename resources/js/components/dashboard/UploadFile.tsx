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

// ✅ Zod schema for file validation
const formSchema = z.object({
  file: z
    .custom<FileList>((val) => val instanceof FileList, "File is required")
    .refine((files) => files && files.length > 0, "Please upload a file")
    .refine(
      (files) => files && files[0].size <= 5 * 1024 * 1024,
      "File must be less than 5MB"
    )
    .refine(
        (files) =>
          files &&
          [
            "image/jpeg",
            "image/png",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/svg+xml",
            "image/webp",
            "video/mp4",
            "audio/mpeg",
            "audio/wav",
          ].includes(files[0].type),
        "Only JPG, PNG, PDF, DOC, DOCX, SVG, WEBP, MP4, MP3, or WAV files are allowed"
      )
});

export default function UploadFile() {
  const [openUploadFile, setOpenUploadFile] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsloading(true);
    const file = values.file[0];
    router.post(route("file.upload"), { file }, {
        onSuccess: () => {
            setOpenUploadFile(false)
            form.reset();
            toast.success("File uploaded successfully");
            setIsloading(false);
        },
        onError: (errors) => {
            setIsloading(false);
            setOpenUploadFile(true)
            if (errors.file) {
                toast.error(errors.file);
                form.setError("file", {
                  type: "server",
                  message: errors.file,
                });
            }
        }
    });
  }

  return (
    <Dialog open={openUploadFile} onOpenChange={setOpenUploadFile}>
      <DialogTrigger asChild>
        <Button className="my-2 ml-4 bg-[hsl(192,77%,54%)]/80 text-white hover:bg-[hsl(200,77%,54%)]/90">
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a file</DialogTitle>
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
                  <FormLabel>Select a file to upload</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="file"
                      accept=".jpg,.png,.pdf"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
             {
                 !isLoading ? (
                     <div className="flex items-center justify-end space-x-2">
                         <Button type="submit">Upload</Button>
                         <Button
                             type="button"
                             variant="secondary"
                             onClick={() => setOpenUploadFile(false)}
                         >
                             Cancel
                         </Button>
                     </div>

                ) :
                <div className="flex items-center justify-end">
                    <LoaderCircle className="h-5 w-5 animate-spin justify-end text-[hsl(185,77%,54%)]/80" />
                </div>

            }
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
