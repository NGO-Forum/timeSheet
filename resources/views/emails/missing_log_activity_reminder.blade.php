<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Daily Log Activity Reminder</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f9; font-family: Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9; padding: 30px 0;">
        <tr>
            <td align="center">

                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0"
                    style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">

                    <!-- Body -->
                    <tr>
                        <td style="padding:30px; color:#374151; font-size:15px; line-height:1.6;">

                            <p>Dear <strong>{{ $user->name }}</strong>,</p>

                            <p>
                                I hope this message finds you well.
                            </p>

                            <p>
                                This is a friendly reminder that your <strong>Time Sheet for
                                    {{ $date }}</strong> has not yet been submitted.
                            </p>

                            <p>
                                To ensure accurate reporting and timely tracking of activities, please submit your log
                                activity at your earliest convenience.
                            </p>

                            <!-- Button -->
                            <div style="text-align:center; margin:30px 0;">
                                <a href="{{ url('/') }}"
                                    style="background:#2563eb; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
                                    Login
                                </a>
                            </div>

                            <p>
                                If you have already submitted your activity, please disregard this message.
                            </p>

                            <p>
                                Thank you for your cooperation and continued contributions.
                            </p>

                            <p style="margin-top:30px;">
                                Best regards,<br>
                                <strong>System Administration Team</strong><br>
                                NGO Forum on Cambodia
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#f9fafb; padding:20px; text-align:center; font-size:13px; color:#6b7280;">
                            <p style="margin:0;">
                                This is an automated message. Please do not reply to this email.
                            </p>
                            <p style="margin:5px 0 0;">
                                © {{ date('Y') }} NGO Forum on Cambodia. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
