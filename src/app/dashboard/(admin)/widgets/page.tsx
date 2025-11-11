import React from 'react'
import Stats from './components/Stats'
import Statistic from './components/Statistic'
import ProjectSummary from './components/ProjectSummary'
import { Col, Row } from 'react-bootstrap'
import Schedules from './components/Schedules'
import Conversions from './components/Conversions'
import Tasks from './components/Tasks'
import FriendsRequest from './components/FriendsRequest'
import RecentTransactions from './components/RecentTransactions'
import { Metadata } from 'next'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const Stats = dynamic(() => import('./components/Stats'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Statistic = dynamic(() => import('./components/Statistic'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const ProjectSummary = dynamic(() => import('./components/ProjectSummary'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Schedules = dynamic(() => import('./components/Schedules'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Conversions = dynamic(() => import('./components/Conversions'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Tasks = dynamic(() => import('./components/Tasks'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const FriendsRequest = dynamic(() => import('./components/FriendsRequest'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const RecentTransactions = dynamic(() => import('./components/RecentTransactions'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

