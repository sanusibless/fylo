import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
  Folder,
  FolderPlus,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  HardDrive,
  Files,
  Search,
  Grid,
  List,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import FileCard from "@/components/FileCard";
import { type FileItem, type FolderItem, type PaginatedData } from "@/types";

interface FoldersProps {
  currentFolder: FolderItem | null;
  breadcrumbs: Array<{ name: string; uuid: string | null }>;
  folders: FolderItem[];
  files: PaginatedData<FileItem>;
  allFolders: FolderItem[];
}

export default function Folders({
  currentFolder,
  breadcrumbs,
  folders,
  files,
}: FoldersProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderItem | null>(null);

  const { data: createData, setData: setCreateData, post: postCreate, processing: createProcessing, reset: resetCreate } = useForm({
    name: "",
    color: "#2dd4bf",
    parent_uuid: currentFolder?.uuid || "",
  });

  const { data: editData, setData: setEditData, put: putEdit, processing: editProcessing } = useForm({
    name: "",
    color: "#2dd4bf",
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postCreate("/folders", {
      onSuccess: () => {
        resetCreate();
        setCreateDialogOpen(false);
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFolder) return;
    putEdit(`/folders/${editingFolder.uuid}`, {
      onSuccess: () => {
        setEditingFolder(null);
      },
    });
  };

  const handleDeleteFolder = (folder: FolderItem) => {
    if (confirm(`Are you sure you want to delete folder '${folder.name}'? Files inside will be unassigned or moved to trash.`)) {
      router.delete(`/folders/${folder.uuid}`);
    }
  };

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFiles = files.data.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Head title={currentFolder ? `${currentFolder.name} - Folders` : "My Folders - Fylo"} />

      <div className="space-y-6">
        {/* Top Header & Breadcrumb Nav */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <nav className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <div key={idx} className="flex items-center space-x-2">
                    {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-600" />}
                    {isLast ? (
                      <span className="font-semibold text-white">{crumb.name}</span>
                    ) : (
                      <Link
                        href={crumb.uuid ? `/folders?folder=${crumb.uuid}` : "/folders"}
                        className="hover:text-teal-400 transition"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
            <h1 className="text-2xl font-bold text-white">
              {currentFolder ? currentFolder.name : "My Folders"}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => {
                setCreateData("parent_uuid", currentFolder?.uuid || "");
                setCreateDialogOpen(true);
              }}
              className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow"
            >
              <FolderPlus className="w-4 h-4 mr-1.5" />
              <span>New Folder</span>
            </Button>
          </div>
        </div>

        {/* Toolbar: Search & View Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search folders and files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-[#202a3c] border-slate-800 text-white placeholder:text-gray-500 text-xs"
            />
          </div>

          <div className="flex items-center space-x-1 bg-[#202a3c] p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`p-1.5 rounded ${view === "grid" ? "bg-teal-400 text-slate-950 font-bold" : "text-gray-400 hover:text-white"}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`p-1.5 rounded ${view === "list" ? "bg-teal-400 text-slate-950 font-bold" : "text-gray-400 hover:text-white"}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Folders Section */}
        <div>
          <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-3">
            Folders ({filteredFolders.length})
          </h3>

          {filteredFolders.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#202a3c]/40 border border-slate-800/80 text-gray-400 text-xs">
              No subfolders in this directory. Click "New Folder" to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="p-4 rounded-2xl bg-[#202a3c] border border-slate-800 hover:border-teal-500/40 transition group flex items-center justify-between"
                >
                  <Link
                    href={`/folders?folder=${folder.uuid}`}
                    className="flex items-center space-x-3 truncate flex-1 min-w-0"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${folder.color || "#2dd4bf"}20` }}
                    >
                      <Folder
                        className="w-5 h-5"
                        style={{ color: folder.color || "#2dd4bf" }}
                      />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-teal-300 transition">
                        {folder.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {folder.files_count || 0} items
                      </p>
                    </div>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1c2431] border-slate-700 text-white">
                      <DropdownMenuItem
                        onSelect={() => {
                          setEditingFolder(folder);
                          setEditData("name", folder.name);
                          setEditData("color", folder.color || "#2dd4bf");
                        }}
                      >
                        <Edit2 className="w-4 h-4 mr-2 text-teal-400" />
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-rose-400 focus:text-rose-300"
                        onSelect={() => handleDeleteFolder(folder)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        <span>Delete Folder</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Files Inside This Folder */}
        <div className="pt-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-3">
            Files ({filteredFiles.length})
          </h3>

          {filteredFiles.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-[#202a3c]/40 border border-slate-800/80 text-gray-400 text-xs">
              No files currently stored directly in this folder.
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <FileCard key={file.id} file={file} view="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-2 bg-[#202a3c]/70 p-3 rounded-2xl border border-slate-800">
              {filteredFiles.map((file) => (
                <FileCard key={file.id} file={file} view="list" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Folder Modal */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-[#1c2431] border border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs text-gray-300">Folder Name</Label>
              <Input
                required
                autoFocus
                placeholder="e.g. Design Assets"
                value={createData.name}
                onChange={(e) => setCreateData("name", e.target.value)}
                className="mt-1 bg-[#0b1523] border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-300">Folder Color Tag</Label>
              <div className="flex items-center space-x-3 mt-1.5">
                {["#2dd4bf", "#38bdf8", "#818cf8", "#f472b6", "#fbbf24", "#34d399"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setCreateData("color", color)}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full border-2 transition ${
                      createData.color === color ? "border-white scale-110" : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="bg-slate-800 border-slate-700 text-white text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createProcessing}
                className="bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold text-xs"
              >
                {createProcessing ? "Creating..." : "Create Folder"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rename Folder Modal */}
      <Dialog open={!!editingFolder} onOpenChange={(open) => !open && setEditingFolder(null)}>
        <DialogContent className="bg-[#1c2431] border border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs text-gray-300">Folder Name</Label>
              <Input
                required
                autoFocus
                value={editData.name}
                onChange={(e) => setEditData("name", e.target.value)}
                className="mt-1 bg-[#0b1523] border-slate-700 text-white text-xs"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingFolder(null)}
                className="bg-slate-800 border-slate-700 text-white text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editProcessing}
                className="bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold text-xs"
              >
                {editProcessing ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
