<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\LogActivityController;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/timesheet', function () {
        return Inertia::render('Staff/TimesheetPage');
    })->name('timesheet.index');

    Route::get('/profile', function () {
        return Inertia::render('Profile/ProfilePage');
    })->name('profile');

    Route::get('/donors', function () {
        return Inertia::render('Donors/DonorPage');
    })->name('donors.index');

    Route::get('/users', function () {
        return Inertia::render('Users/UsersPage');
    })->name('users.index');

    Route::get('/log-activities', function () {
        return Inertia::render('LogActivities/Index');
    })->name('log-activities.index');

    Route::prefix('ajax')->group(function () {
        Route::get('/log-activities', [LogActivityController::class, 'index']);
        Route::post('/log-activities', [LogActivityController::class, 'store']);
        Route::get('/log-activities/{logActivity}', [LogActivityController::class, 'show']);
        Route::put('/log-activities/{logActivity}', [LogActivityController::class, 'update']);
        Route::delete('/log-activities/{logActivity}', [LogActivityController::class, 'destroy']);
    });
});

require __DIR__ . '/auth.php';
