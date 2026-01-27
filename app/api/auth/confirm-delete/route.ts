import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/?error=invalid-token', request.url))
    }

    const supabase = await createClient()

    // Find the deletion request
    const { data: deletionRequest, error: requestError } = await supabase
      .from('account_deletion_requests')
      .select('*')
      .eq('token', token)
      .single()

    if (requestError || !deletionRequest) {
      return NextResponse.redirect(new URL('/?error=invalid-token', request.url))
    }

    // Check if token has expired
    if (new Date(deletionRequest.expires_at) < new Date()) {
      // Delete expired request
      await supabase
        .from('account_deletion_requests')
        .delete()
        .eq('token', token)

      return NextResponse.redirect(new URL('/?error=token-expired', request.url))
    }

    // Get user to delete
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(
      deletionRequest.user_id
    )

    if (userError || !user) {
      return NextResponse.redirect(new URL('/?error=user-not-found', request.url))
    }

    // Delete the user (this will cascade delete related data)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      deletionRequest.user_id
    )

    if (deleteError) {
      console.error('Error deleting user:', deleteError)
      return NextResponse.redirect(new URL('/?error=deletion-failed', request.url))
    }

    // Clean up deletion request
    await supabase
      .from('account_deletion_requests')
      .delete()
      .eq('token', token)

    // Redirect to home with success message
    return NextResponse.redirect(new URL('/?deleted=success', request.url))
  } catch (error) {
    console.error('Error confirming account deletion:', error)
    return NextResponse.redirect(new URL('/?error=server-error', request.url))
  }
}
