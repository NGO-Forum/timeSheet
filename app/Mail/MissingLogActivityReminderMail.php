<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class MissingLogActivityReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public string $date;

    public function __construct(User $user, string $date)
    {
        $this->user = $user;
        $this->date = Carbon::parse($date)->format('d F Y');
    }

    public function build()
    {
        return $this->subject('Reminder: Please submit your log activity today')
            ->view('emails.missing_log_activity_reminder');
    }
}