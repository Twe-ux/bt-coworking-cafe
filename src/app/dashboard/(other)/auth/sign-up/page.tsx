import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sign Up - Redirecting...' }

// Redirect to the new registration page
const SignUpPage = () => {
  redirect('/auth/register')
}

export default SignUpPage
