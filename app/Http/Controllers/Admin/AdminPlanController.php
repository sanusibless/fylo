<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StoragePlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPlanController extends Controller
{
    public function index()
    {
        $plans = StoragePlan::withCount('userStoragePlans')->get();

        return Inertia::render('admin/Plans', [
            'plans' => $plans,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $plan = StoragePlan::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'capacity' => 'required|string|max:50',
            'price_monthly' => 'required|numeric|min:0',
            'price_yearly' => 'required|numeric|min:0',
            'max_file_size_mb' => 'required|integer|min:10',
            'is_active' => 'boolean',
            'is_popular' => 'boolean',
        ]);

        $plan->update($validated);

        return back()->with('status', "Plan '{$plan->name}' updated successfully.");
    }
}
