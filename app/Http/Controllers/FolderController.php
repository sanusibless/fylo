<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Folder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FolderController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth()->id();
        $folderUuid = $request->query('folder');
        $search = trim((string) $request->query('search', ''));
        $typeFilter = trim((string) $request->query('type', ''));

        $currentFolder = null;
        $breadcrumbs = [['name' => 'All Folders', 'uuid' => null]];

        if ($folderUuid) {
            $currentFolder = Folder::where('uuid', $folderUuid)->where('user_id', $userId)->firstOrFail();

            // Build breadcrumbs trail with cycle protection
            $trail = [];
            $visited = [];
            $temp = $currentFolder;
            while ($temp && ! in_array($temp->id, $visited, true)) {
                $visited[] = $temp->id;
                array_unshift($trail, ['name' => $temp->name, 'uuid' => $temp->uuid]);
                $temp = $temp->parent;
            }
            $breadcrumbs = array_merge([['name' => 'All Folders', 'uuid' => null]], $trail);
        }

        $subfoldersQuery = Folder::where('user_id', $userId)
            ->where('parent_id', $currentFolder?->id)
            ->withCount('files')
            ->orderBy('name');

        if ($search !== '') {
            $subfoldersQuery->where('name', 'like', "%{$search}%");
        }

        $subfolders = $subfoldersQuery->get();

        $filesQuery = File::where('user_id', $userId)
            ->where('folder_id', $currentFolder?->id);

        if ($search !== '') {
            $filesQuery->where('name', 'like', "%{$search}%");
        }
        if ($typeFilter !== '' && $typeFilter !== 'all') {
            $filesQuery->where('type', $typeFilter);
        }

        $files = $filesQuery
            ->latest()
            ->paginate(16)
            ->withQueryString();

        // Get all folders for move dropdown
        $allFolders = Folder::where('user_id', $userId)
            ->select('id', 'uuid', 'name', 'parent_id', 'color')
            ->orderBy('name')
            ->get();

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'allFolders' => $allFolders,
                'folders' => $subfolders,
            ]);
        }

        return Inertia::render('Folders', [
            'currentFolder' => $currentFolder ? [
                'id' => $currentFolder->id,
                'uuid' => $currentFolder->uuid,
                'name' => $currentFolder->name,
                'color' => $currentFolder->color,
            ] : null,
            'breadcrumbs' => $breadcrumbs,
            'folders' => $subfolders,
            'files' => $files,
            'allFolders' => $allFolders,
            'filters' => [
                'search' => $search,
                'type' => $typeFilter,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'parent_uuid' => 'nullable|string|exists:folders,uuid',
            'color' => 'nullable|string|max:30',
        ]);

        $parentId = null;
        if ($request->filled('parent_uuid')) {
            $parent = Folder::where('uuid', $request->parent_uuid)
                ->where('user_id', auth()->id())
                ->firstOrFail();
            $parentId = $parent->id;
        }

        $folderName = trim($request->name);

        // Prevent duplicate folder name under the same parent
        $exists = Folder::where('user_id', auth()->id())
            ->where('parent_id', $parentId)
            ->where('name', $folderName)
            ->exists();

        if ($exists) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => false,
                    'message' => 'A folder with this name already exists in this location.',
                ], 422);
            }

            return back()->withErrors(['name' => 'A folder with this name already exists in this location.']);
        }

        $folder = Folder::create([
            'user_id' => auth()->id(),
            'parent_id' => $parentId,
            'name' => $folderName,
            'color' => $request->color ?: '#2dd4bf',
        ]);

        activity()->causedBy(auth()->id())->log("You created folder {$folder->name}");

        if ($request->expectsJson()) {
            return response()->json([
                'status' => true,
                'message' => 'Folder created successfully.',
                'folder' => $folder,
            ], 201);
        }

        return back()->with('status', "Folder '{$folder->name}' created.");
    }

    public function update(Request $request, string $folder_uuid)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'color' => 'nullable|string|max:30',
        ]);

        $folder = Folder::where('uuid', $folder_uuid)->where('user_id', auth()->id())->firstOrFail();
        $oldName = $folder->name;
        $folder->name = trim($request->name);
        if ($request->filled('color')) {
            $folder->color = $request->color;
        }
        $folder->save();

        activity()->causedBy(auth()->id())->log("You renamed folder {$oldName} to {$folder->name}");

        if ($request->expectsJson()) {
            return response()->json([
                'status' => true,
                'message' => 'Folder updated successfully.',
            ]);
        }

        return back()->with('status', 'Folder renamed.');
    }

    public function destroy(string $folder_uuid)
    {
        $folder = Folder::where('uuid', $folder_uuid)->where('user_id', auth()->id())->firstOrFail();
        $folderName = $folder->name;

        // Reassign files inside this folder to its parent folder (or root) so files are not orphaned
        File::where('user_id', auth()->id())
            ->where('folder_id', $folder->id)
            ->update(['folder_id' => $folder->parent_id]);

        // Reassign child folders to parent folder
        Folder::where('user_id', auth()->id())
            ->where('parent_id', $folder->id)
            ->update(['parent_id' => $folder->parent_id]);

        $folder->delete();

        activity()->causedBy(auth()->id())->log("You deleted folder {$folderName}");

        if (request()->expectsJson()) {
            return response()->json([
                'status' => true,
                'message' => 'Folder deleted.',
            ]);
        }

        return back()->with('status', "Folder '{$folderName}' deleted.");
    }
}
