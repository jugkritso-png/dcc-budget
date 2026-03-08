import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const token = process.env.LINE_NOTIFY_TOKEN;

    if (!token) {
      console.warn("LINE_NOTIFY_TOKEN is not configured in environment variables.");
      return NextResponse.json(
        { error: 'LINE_NOTIFY_TOKEN is not configured' },
        { status: 500 }
      );
    }

    // Call Line Notify API
    const response = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      },
      body: new URLSearchParams({
        message: `\n${message}` // Line notify usually expects a newline before the message to format it nicely
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Line Notify API Error:', errorText);
      return NextResponse.json({ error: 'Failed to send Line notification' }, { status: response.status });
    }

    return NextResponse.json({ success: true, message: 'Notification sent' }, { status: 200 });

  } catch (error) {
    console.error('Line Notify Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
