<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\GeneralService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(protected GeneralService $generalService) {}

    public function search(Request $request)
    {
        try {
            $query = trim((string) $request->get('query', ''));
            if (mb_strlen($query) < 2) {
                return response()->json($this->generalService->serviceResponse(true, 'success', []), 200);
            }

            $authId = auth()->id();

            $users = User::query()
                ->where('id', '!=', $authId)
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                        ->orWhere('email', 'like', "%{$query}%");
                })
                ->limit(10)
                ->get(['id', 'name', 'email']);

            return response()->json($this->generalService->serviceResponse(true, 'success', $users), 200);
        } catch (\Throwable $th) {
            return response()->json($this->generalService->serviceResponse(false, 'Unable to search users', []), 500);
        }
    }
}
