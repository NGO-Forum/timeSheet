<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDonorRequest;
use App\Http\Requests\UpdateDonorRequest;
use App\Models\Donor;
use Illuminate\Http\JsonResponse;

class DonorController extends Controller
{
    public function index(): JsonResponse
    {
        $search = request('search');

        $donors = Donor::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Donor list fetched successfully',
            'data' => $donors,
        ]);
    }

    public function store(StoreDonorRequest $request): JsonResponse
    {
        $donor = Donor::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Donor created successfully',
            'data' => $donor,
        ], 201);
    }

    public function show(Donor $donor): JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => 'Donor fetched successfully',
            'data' => $donor,
        ]);
    }

    public function update(UpdateDonorRequest $request, Donor $donor): JsonResponse
    {
        $donor->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Donor updated successfully',
            'data' => $donor,
        ]);
    }

    public function destroy(Donor $donor): JsonResponse
    {
        $donor->delete();

        return response()->json([
            'status' => true,
            'message' => 'Donor deleted successfully',
        ]);
    }
}