import React from 'react'
import Error404 from './components/Error404'
import { Metadata } from 'next'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const Error404Page = () => {
  return <Error404 />
}

export default Error404Page
