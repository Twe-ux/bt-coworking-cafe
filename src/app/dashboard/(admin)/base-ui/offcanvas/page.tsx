import type { Metadata } from 'next'
import AllOffcanvas from './components/AllOffcanvas'
import UIExamplesList from '@/components/UIExamplesList'
import { Col, Row } from 'react-bootstrap'
import DashboardPageTitle from '@/components/DashboardPageTitle'

export const metadata: Metadata = { title: 'Offcanvas' }

const Offcanvas = () => {
  return (
    <>
      <DashboardPageTitle subName="UI" title="Offcanvas" />
      <Row>
        <Col xl={9}>
          <AllOffcanvas />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { label: 'Default Offcanvas', link: '#default' },
              { label: 'Static Backdrop', link: '#static-backdrop' },
              { label: 'Offcanvas Position', link: '#offcanvas-position' },
            ]}
          />
        </Col>
      </Row>
    </>
  )
}

export default Offcanvas
