<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\MissingLogActivityReminderMail;

class SendMissingLogActivityReminder extends Command
{
    protected $signature = 'logactivity:send-missing-reminders';
    protected $description = 'Send reminder emails to non-admin users who did not create log activity today';

    public function handle(): int
    {
        $today = Carbon::today()->toDateString();

        $users = User::query()
            ->where('role', '!=', 'admin')
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->where(function ($query) use ($today) {
                $query->whereNull('last_log_reminder_sent_at')
                    ->orWhereDate('last_log_reminder_sent_at', '!=', $today);
            })
            ->whereDoesntHave('logActivities', function ($query) use ($today) {
                $query->whereDate('date', $today);
            })
            ->get();

        if ($users->isEmpty()) {
            $this->info('No users need reminder email today.');
            return self::SUCCESS;
        }

        foreach ($users as $user) {
            try {
                Mail::to($user->email)->send(
                    new MissingLogActivityReminderMail($user, $today)
                );

                $user->update([
                    'last_log_reminder_sent_at' => now(),
                ]);

                $this->info("Reminder sent to: {$user->email}");
            } catch (\Throwable $e) {
                $this->error("Failed to send email to {$user->email}: " . $e->getMessage());
            }
        }

        $this->info('Reminder process completed.');

        return self::SUCCESS;
    }
}
