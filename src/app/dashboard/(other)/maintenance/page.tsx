import { Metadata } from 'next'
import Maintenance from './components/Maintenance'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const MaintenancePage = () => {
  return <Maintenance />
}

export default MaintenancePage
