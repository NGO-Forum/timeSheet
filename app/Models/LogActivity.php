<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LogActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'donor_id',
        'leave_type_id',
        'date',
        'task',
        'project',
        'hours',
        'remarks',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'hours' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function donor()
    {
        return $this->belongsTo(Donor::class);
    }

    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class);
    }
}