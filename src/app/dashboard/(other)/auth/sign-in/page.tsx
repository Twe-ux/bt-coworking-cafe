import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sign In - Redirecting...' }

// Redirect to the new authentication page
const SignInPage = () => {
  redirect('/auth/login')
}

export default SignInPage
