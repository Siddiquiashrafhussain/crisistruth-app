
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // In a real application, you would validate the credentials against a database.
    // Here, we're using the same mock logic as before.
    if (email === "admin@crisistruth.org" && password === "admin123") {
      return NextResponse.json({ success: true, userType: 'admin' });
    } else if (email === "factchecker@crisistruth.org" && password === "checker123") {
      return NextResponse.json({ success: true, userType: 'factchecker' });
    } else if (email && password) {
      // For any other combination, consider them a regular user for this demo
      return NextResponse.json({ success: true, userType: 'user' });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
  }
}
