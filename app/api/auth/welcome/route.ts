import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user's email is confirmed
    if (!user.email_confirmed_at) {
      return NextResponse.json(
        { error: 'Email not confirmed' },
        { status: 400 }
      )
    }

    // Check if welcome email was already sent
    const { data: existingRecord } = await supabase
      .from('welcome_emails_sent')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existingRecord) {
      return NextResponse.json(
        { message: 'Welcome email already sent' },
        { status: 200 }
      )
    }

    // In production, you would integrate with your email service here
    // For now, we'll just mark it as sent in the database
    const { error: insertError } = await supabase
      .from('welcome_emails_sent')
      .insert({ user_id: user.id })

    if (insertError) {
      console.error('Error tracking welcome email:', insertError)
      return NextResponse.json(
        { error: 'Failed to track welcome email' },
        { status: 500 }
      )
    }

    // TODO: Integrate with an email service (SendGrid, Resend, etc.)
    // to actually send the welcome email using the template at:
    // /supabase/templates/invite.html

    // For development, log that we would send the email
    console.log(`Welcome email would be sent to: ${user.email}`)

    return NextResponse.json(
      { message: 'Welcome email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in welcome email endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
