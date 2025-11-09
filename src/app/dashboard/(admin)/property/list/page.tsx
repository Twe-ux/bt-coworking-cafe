import DashboardPageTitle from '@/components/DashboardPageTitle'
import PropertyList from './components/PropertyList'
import PropertyStat from './components/PropertyStat'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Listing List' }

const PropertyListPage = () => {
  return (
    <>
      <DashboardPageTitle title="Listing List" subName="Real Estate" />
      <PropertyStat />
      <PropertyList />
    </>
  )
}

export default PropertyListPage
