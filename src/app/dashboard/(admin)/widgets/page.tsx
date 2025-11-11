import React from 'react'
import { Col, Row } from 'react-bootstrap'
import dynamicImport from 'next/dynamic'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const Stats = dynamicImport(() => import('./components/Stats'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Statistic = dynamicImport(() => import('./components/Statistic'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const ProjectSummary = dynamicImport(() => import('./components/ProjectSummary'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Schedules = dynamicImport(() => import('./components/Schedules'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Conversions = dynamicImport(() => import('./components/Conversions'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Tasks = dynamicImport(() => import('./components/Tasks'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const FriendsRequest = dynamicImport(() => import('./components/FriendsRequest'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const RecentTransactions = dynamicImport(() => import('./components/RecentTransactions'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

