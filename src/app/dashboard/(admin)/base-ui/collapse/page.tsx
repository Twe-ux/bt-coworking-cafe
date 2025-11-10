import UIExamplesList from '@/components/UIExamplesList'
import AllCollapse from './components/AllCollapse'
import type { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import DashboardPageTitle from '@/components/DashboardPageTitle'

export const metadata: Metadata = { title: 'Collapse' }

const Collapse = () => {
  return (
    <>
      <DashboardPageTitle subName="UI" title="Collapse" />
      <Row>
        <Col xl={9}>
          <AllCollapse />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { label: 'Default Example', link: '#default' },
              { label: 'Horizontal Collapse', link: '#horizontal' },
              { label: 'Multiple Targets', link: '#multiple-targets' },
            ]}
          />
        </Col>
      </Row>
    </>
  )
}

export default Collapse
