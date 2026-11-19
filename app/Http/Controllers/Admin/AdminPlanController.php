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
        if (StoragePlan::count() === 0) {
            foreach (config('fylo.plans', []) as $plan) {
                StoragePlan::updateOrCreate(['slug' => $plan['slug']], $plan);
            }
        }

        $canonicalSlugs = array_column(config('fylo.plans', []), 'slug');
        $plans = StoragePlan::withCount('userStoragePlans')
            ->when(! empty($canonicalSlugs), fn ($q) => $q->whereIn('slug', $canonicalSlugs))
            ->orderBy('price_monthly')
            ->get();

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
            'price_yearly' => 'nullable|numeric|min:0',
            'max_file_size_mb' => 'required|integer|min:10',
            'is_active' => 'boolean',
            'is_popular' => 'boolean',
        ]);

        $monthlyPrice = (float) $validated['price_monthly'];
        $validated['price_yearly'] = StoragePlan::calculateYearlyPrice($monthlyPrice);
        $validated['currency'] = config('fylo.currency.code', 'NGN');

        $plan->update($validated);

        return back()->with('status', "Plan '{$plan->name}' updated successfully.");
    }
}
