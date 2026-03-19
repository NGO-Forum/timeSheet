<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Donor;
use App\Models\LogActivity;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalDonors = Donor::count();

        $totalProjects = LogActivity::whereNotNull('project')
            ->where('project', '!=', '')
            ->distinct('project')
            ->count('project');

        $totalLogs = LogActivity::count();
        $totalHours = LogActivity::sum('hours');

        $recentActivities = LogActivity::with([
            'user:id,name',
            'donor:id,name',
        ])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalDonors' => $totalDonors,
                'totalProjects' => $totalProjects,
                'totalLogs' => $totalLogs,
                'totalHours' => number_format($totalHours, 2),
            ],
            'recentActivities' => $recentActivities,
        ]);
    }
}