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

        $currentFolder = null;
        $breadcrumbs = [['name' => 'All Folders', 'uuid' => null]];

        if ($folderUuid) {
            $currentFolder = Folder::where('uuid', $folderUuid)->where('user_id', $userId)->firstOrFail();

            // Build breadcrumbs trail
            $trail = [];
            $temp = $currentFolder;
            while ($temp) {
                array_unshift($trail, ['name' => $temp->name, 'uuid' => $temp->uuid]);
                $temp = $temp->parent;
            }
            $breadcrumbs = array_merge([['name' => 'All Folders', 'uuid' => null]], $trail);
        }

        $subfolders = Folder::where('user_id', $userId)
            ->where('parent_id', $currentFolder?->id)
            ->withCount('files')
            ->orderBy('name')
            ->get();

        $files = File::where('user_id', $userId)
            ->where('folder_id', $currentFolder?->id)
            ->latest()
            ->paginate(15)
            ->withQueryString();

        // Get all folders for move dropdown
        $allFolders = Folder::where('user_id', $userId)
            ->select('id', 'uuid', 'name')
            ->orderBy('name')
            ->get();

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

        $folder = Folder::create([
            'user_id' => auth()->id(),
            'parent_id' => $parentId,
            'name' => trim($request->name),
            'color' => $request->color ?: '#2dd4bf',
        ]);

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
        $folder->name = trim($request->name);
        if ($request->filled('color')) {
            $folder->color = $request->color;
        }
        $folder->save();

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
        $folder->delete();

        if (request()->expectsJson()) {
            return response()->json([
                'status' => true,
                'message' => 'Folder moved to trash.',
            ]);
        }

        return back()->with('status', 'Folder moved to trash.');
    }
}
