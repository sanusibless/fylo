
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Form } from "@inertiajs/react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function UploadFile() {
    const [openUploadFile, setOpenUploadFile] = useState(false);
    return (
        <Dialog open={openUploadFile} onOpenChange={setOpenUploadFile}>
            <DialogTrigger>
            <Upload className="mr-2 h-4 w-4" />
                Upload File</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload a file</DialogTitle>
                </DialogHeader>
                <Form action="/upload" method="POST" encType="multipart/form-data">
                    <Input type="file" name="file" />
                    <Button type="submit">Upload</Button>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setOpenUploadFile(false)}>Cancel</Button>
                        {/* <Button onClick={() => handleSubmit}>Logout</Button> */}
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
