import type { Metadata } from 'next'
import AllWizard from './components/AllWizard'
import DashboardPageTitle from '@/components/DashboardPageTitle'

export const metadata: Metadata = { title: 'Wizard' }

const Wizard = () => {
  return (
    <>
      <DashboardPageTitle title="Wizard" subName="Form" />
      <AllWizard />
    </>
  )
}

export default Wizard
