<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\File;
use App\Models\Payment;
use App\Models\StoragePlan;
use App\Models\User;
use App\Models\UserStoragePlan;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalFiles = File::count();
        $totalStorageBytes = File::sum('size');
        $totalStorageGB = round($totalStorageBytes / (1024 * 1024 * 1024), 2);

        $freePlan = StoragePlan::where('name', 'Free')->first();
        $activeSubscribers = UserStoragePlan::where('status', 'active')
            ->where('storage_plan_id', '!=', $freePlan?->id ?? 0)
            ->count();

        // Calculate approximate MRR
        $mrr = Payment::where('status', 'successful')
            ->where('paid_at', '>=', now()->subDays(30))
            ->sum('amount');

        $recentUsers = User::with('userStoragePlan.storagePlanDetail')
            ->latest()
            ->take(8)
            ->get();

        $recentPayments = Payment::with(['user', 'plan'])
            ->latest()
            ->take(6)
            ->get();

        $unreadInquiries = ContactMessage::latest()->take(5)->get();

        return Inertia::render('admin/Dashboard', [
            'metrics' => [
                'totalUsers' => $totalUsers,
                'activeSubscribers' => $activeSubscribers,
                'totalFiles' => $totalFiles,
                'totalStorageGB' => $totalStorageGB,
                'monthlyRevenue' => round($mrr, 2),
            ],
            'recentUsers' => $recentUsers,
            'recentPayments' => $recentPayments,
            'recentInquiries' => $unreadInquiries,
        ]);
    }
}
