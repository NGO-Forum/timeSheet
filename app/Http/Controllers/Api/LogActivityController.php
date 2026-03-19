<?php

namespace App\Http\Controllers\Api;

use App\Models\Donor;
use App\Models\LeaveType;
use App\Models\LogActivity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLogActivityRequest;
use App\Http\Requests\UpdateLogActivityRequest;

class LogActivityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $query = LogActivity::with([
            'user:id,name,image,position,program',
            'donor:id,name',
            'leaveType:id,name',
        ]);

        // Admin can see all
        // Normal user can see only their own records
        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        } else {
            // Admin can filter by user_id if needed
            if ($request->filled('user_id')) {
                $query->where('user_id', $request->user_id);
            }
        }

        if ($request->filled('month')) {
            [$year, $month] = explode('-', $request->month);
            $query->whereYear('date', $year)->whereMonth('date', $month);
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->filled('from')) {
            $query->whereDate('date', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('date', '<=', $request->to);
        }

        if ($request->filled('donor_id')) {
            $query->where('donor_id', $request->donor_id);
        }

        if ($request->filled('task')) {
            $query->where('task', 'like', '%' . $request->task . '%');
        }

        $logActivities = $query
            ->latest('date')
            ->latest('id')
            ->paginate((int) $request->get('per_page', 100));

        return response()->json($logActivities);
    }

    public function store(StoreLogActivityRequest $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $data = $request->validated();

        if (filled($data['donor_id'] ?? null) && filled($data['leave_type_id'] ?? null)) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => [
                    'donor_id' => ['Please choose only one: donor or leave type.'],
                    'leave_type_id' => ['Please choose only one: donor or leave type.'],
                ],
            ], 422);
        }

        if (!filled($data['donor_id'] ?? null) && !filled($data['leave_type_id'] ?? null)) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => [
                    'donor_id' => ['Please choose donor or leave type.'],
                    'leave_type_id' => ['Please choose donor or leave type.'],
                ],
            ], 422);
        }

        $donorId = $this->resolveDonorId($data['donor_id'] ?? null);
        $leaveTypeId = $this->resolveLeaveTypeId($data['leave_type_id'] ?? null);

        $logActivity = LogActivity::create([
            'user_id' => $user->id,
            'donor_id' => $donorId,
            'leave_type_id' => $leaveTypeId,
            'date' => $data['date'],
            'task' => $data['task'],
            'project' => $data['project'] ?? null,
            'hours' => $data['hours'],
            'remarks' => $data['remarks'] ?? null,
        ]);

        $logActivity->load([
            'user:id,name,image',
            'donor:id,name',
            'leaveType:id,name',
        ]);

        return response()->json([
            'message' => 'Log activity created successfully.',
            'data' => $logActivity,
        ], 201);
    }

    public function show(LogActivity $logActivity): JsonResponse
    {
        $logActivity->load([
            'user:id,name,image',
            'donor:id,name',
            'leaveType:id,name',
        ]);

        return response()->json($logActivity);
    }

    public function update(UpdateLogActivityRequest $request, LogActivity $logActivity): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $data = $request->validated();

        if (filled($data['donor_id'] ?? null) && filled($data['leave_type_id'] ?? null)) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => [
                    'donor_id' => ['Please choose only one: donor or leave type.'],
                    'leave_type_id' => ['Please choose only one: donor or leave type.'],
                ],
            ], 422);
        }

        if (!filled($data['donor_id'] ?? null) && !filled($data['leave_type_id'] ?? null)) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => [
                    'donor_id' => ['Please choose donor or leave type.'],
                    'leave_type_id' => ['Please choose donor or leave type.'],
                ],
            ], 422);
        }

        $donorId = $this->resolveDonorId($data['donor_id'] ?? null);
        $leaveTypeId = $this->resolveLeaveTypeId($data['leave_type_id'] ?? null);

        $logActivity->update([
            'donor_id' => $donorId,
            'leave_type_id' => $leaveTypeId,
            'date' => $data['date'],
            'task' => $data['task'],
            'project' => $data['project'] ?? null,
            'hours' => $data['hours'],
            'remarks' => $data['remarks'] ?? null,
        ]);

        $logActivity->load([
            'user:id,name,image',
            'donor:id,name',
            'leaveType:id,name',
        ]);

        return response()->json([
            'message' => 'Log activity updated successfully.',
            'data' => $logActivity,
        ]);
    }

    public function destroy(LogActivity $logActivity): JsonResponse
    {
        $logActivity->delete();

        return response()->json([
            'message' => 'Log activity deleted successfully.',
        ]);
    }

    private function resolveDonorId($value): ?int
    {
        if (!filled($value)) {
            return null;
        }

        if (is_numeric($value)) {
            return (int) $value;
        }

        $donor = Donor::firstOrCreate([
            'name' => trim($value),
        ]);

        return $donor->id;
    }

    private function resolveLeaveTypeId($value): ?int
    {
        if (!filled($value)) {
            return null;
        }

        if (is_numeric($value)) {
            return (int) $value;
        }

        $leaveType = LeaveType::firstOrCreate([
            'name' => trim($value),
        ]);

        return $leaveType->id;
    }
}
