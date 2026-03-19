<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DonorController;
use App\Http\Controllers\Api\LeaveTypeController;
use App\Http\Controllers\Api\LogActivityController;


// Route::apiResource('log-activities', LogActivityController::class);

Route::get('/log-activities', [LogActivityController::class, 'index']);

Route::get('/leave-types', [LeaveTypeController::class, 'index']);

Route::apiResource('donors', DonorController::class);

Route::apiResource('users', UserController::class);