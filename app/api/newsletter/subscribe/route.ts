import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/subscription/supabase';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Get Supabase client
    const supabase = createServerClient();

    if (!supabase) {
      // If Supabase is not configured, log and return success
      // This allows the feature to work in development without DB
      console.log('Newsletter subscription (no DB):', trimmedEmail);
      return NextResponse.json({
        success: true,
        message: 'Thank you for subscribing!',
      });
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', trimmedEmail)
      .single();

    if (existingSubscriber) {
      // If already subscribed and active
      if (existingSubscriber.status === 'active') {
        return NextResponse.json({
          success: true,
          message: 'You\'re already subscribed!',
          alreadySubscribed: true,
        });
      }

      // Reactivate if previously unsubscribed
      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({
          status: 'active',
          resubscribed_at: new Date().toISOString(),
        })
        .eq('id', existingSubscriber.id);

      if (updateError) {
        console.error('Error reactivating subscription:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to subscribe. Please try again.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Welcome back! You\'ve been resubscribed.',
      });
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: trimmedEmail,
        status: 'active',
        source: 'footer_form',
        subscribed_at: new Date().toISOString(),
      });

    if (insertError) {
      // Handle unique constraint violation
      if (insertError.code === '23505') {
        return NextResponse.json({
          success: true,
          message: 'You\'re already subscribed!',
          alreadySubscribed: true,
        });
      }

      console.error('Error inserting subscriber:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! You\'ll receive updates on new features.',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    const supabase = createServerClient();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        message: 'You have been unsubscribed.',
      });
    }

    // Update status to unsubscribed
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', trimmedEmail);

    if (error) {
      console.error('Error unsubscribing:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to unsubscribe' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'You have been unsubscribed successfully.',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
