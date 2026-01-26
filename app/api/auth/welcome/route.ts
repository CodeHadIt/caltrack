import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { readFileSync } from 'fs'
import { join } from 'path'

// Initialize Resend with API key from environment
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

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

    // Send welcome email if Resend is configured
    if (resend && process.env.RESEND_FROM_EMAIL) {
      try {
        // Read the email template
        const templatePath = join(process.cwd(), 'supabase', 'templates', 'invite.html')
        let emailHtml = readFileSync(templatePath, 'utf-8')

        // Replace template variables
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        emailHtml = emailHtml.replace(/\{\{\s*\.SiteURL\s*\}\}/g, siteUrl)
        emailHtml = emailHtml.replace(/\{\{\s*\.Email\s*\}\}/g, user.email || '')

        // Send email using Resend
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: user.email!,
          subject: 'Welcome to CalTrack! 🎉',
          html: emailHtml,
        })

        console.log(`Welcome email sent to: ${user.email}`)
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
        // Continue even if email fails - we'll still mark it as sent
      }
    } else {
      console.log(`Resend not configured. Would send welcome email to: ${user.email}`)
    }

    // Mark welcome email as sent in database
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
