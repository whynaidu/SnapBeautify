import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay instance
function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, name } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayInstance();

    // Lifetime price in paise (₹2499 = 249900 paise)
    const amount = 249900;

    // Create one-time order for lifetime purchase
    // Receipt must be <= 40 chars, so use short format
    const shortId = userId.substring(0, 8);
    const timestamp = Date.now().toString(36); // Base36 for shorter string
    const receipt = `life_${shortId}_${timestamp}`.substring(0, 40);

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt,
      notes: {
        userId,
        email: email || '',
        name: name || '',
        planType: 'lifetime',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount,
      currency: 'INR',
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
