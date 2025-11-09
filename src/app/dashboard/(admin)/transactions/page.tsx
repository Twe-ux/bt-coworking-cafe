import DashboardPageTitle from '@/components/DashboardPageTitle'
import { Metadata } from 'next'
import TransactionData from './components/TransactionData'

export const metadata: Metadata = { title: 'Transactions' }

const TransactionsPage = () => {
  return (
    <>
      <DashboardPageTitle title="Transactions" subName="Real Estate" />
      <TransactionData />
    </>
  )
}

export default TransactionsPage
