<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\GeneralService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(protected GeneralService $generalService)
    {
        
    }

    public function search(Request $request)
    {
        try {
            $query = $request->get('query', '');

            $users = User::query()
                ->where('name', 'like', "%{$query}%")
                ->orWhere('email', 'like', "%{$query}%")
                ->limit(10)
                ->get(['id', 'name', 'email']);

            return response()->json($this->generalService->serviceResponse(true, 'success', $users), 200); //$this->generalService->handle
        } catch (\Throwable $th) {
            throw $th;
        }
        return response()->json($this->generalService->serviceResponse(true, 'success', $users), 400); //$this->generalService->handle
    }
}
