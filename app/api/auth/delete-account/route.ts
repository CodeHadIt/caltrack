import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { readFileSync } from 'fs'
import { join } from 'path'

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

    // Generate a secure deletion token (using user ID + timestamp)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64url')

    // Store the deletion request in the database with expiry
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    await supabase
      .from('account_deletion_requests')
      .insert({
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      })

    // Send deletion confirmation email
    if (resend && process.env.RESEND_FROM_EMAIL) {
      try {
        const templatePath = join(process.cwd(), 'supabase', 'templates', 'delete-account.html')
        let emailHtml = readFileSync(templatePath, 'utf-8')

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const confirmationUrl = `${siteUrl}/api/auth/confirm-delete?token=${token}`

        emailHtml = emailHtml.replace(/\{\{\s*\.ConfirmationURL\s*\}\}/g, confirmationUrl)
        emailHtml = emailHtml.replace(/\{\{\s*\.Email\s*\}\}/g, user.email || '')
        emailHtml = emailHtml.replace(/\{\{\s*\.SiteURL\s*\}\}/g, siteUrl)

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: user.email!,
          subject: 'Confirm Account Deletion - CalTrack',
          html: emailHtml,
        })

        console.log(`Account deletion email sent to: ${user.email}`)
      } catch (emailError) {
        console.error('Failed to send deletion email:', emailError)
        return NextResponse.json(
          { error: 'Failed to send confirmation email' },
          { status: 500 }
        )
      }
    } else {
      console.log(`Resend not configured. Deletion token: ${token}`)
    }

    return NextResponse.json(
      { message: 'Confirmation email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error requesting account deletion:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
