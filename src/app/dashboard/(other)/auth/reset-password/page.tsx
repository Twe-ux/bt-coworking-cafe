import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Reset Password - Redirecting...' }

// Redirect to the new forgot password page
const ResetPasswordPage = () => {
  redirect('/auth/forgot-password')
}

export default ResetPasswordPage
