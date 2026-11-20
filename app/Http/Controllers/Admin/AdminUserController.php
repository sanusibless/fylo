<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StoragePlan;
use App\Models\User;
use App\Models\UserStoragePlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with(['userStoragePlan.storagePlanDetail'])->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(15)->withQueryString();
        $plans = StoragePlan::all();

        return Inertia::render('admin/Users', [
            'users' => $users,
            'plans' => $plans,
            'filters' => $request->only(['search']),
        ]);
    }

    public function toggleAdmin(string $id)
    {
        $user = User::findOrFail($id);
        if ($user->id === auth()->id()) {
            return back()->withErrors(['user' => 'You cannot remove your own admin status.']);
        }

        $user->is_admin = ! $user->is_admin;
        $user->save();

        return back()->with('status', 'User admin status toggled.');
    }

    public function updatePlan(Request $request, string $id)
    {
        $request->validate([
            'plan_id' => 'required|exists:storage_plans,id',
        ]);

        $user = User::findOrFail($id);
        $plan = StoragePlan::findOrFail($request->plan_id);

        UserStoragePlan::updateOrCreate(
            ['user_id' => $user->id],
            [
                'storage_plan_id' => $plan->id,
                'status' => 'active',
                'starts_at' => now(),
                'expires_at' => now()->addMonth(),
                'auto_renew' => true,
            ]
        );

        return back()->with('status', "User plan updated to {$plan->name}.");
    }
}
