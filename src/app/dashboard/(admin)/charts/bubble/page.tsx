import { Col, Row } from 'react-bootstrap'
import UIExamplesList from '@/components/UIExamplesList'
import AllBubbleCharts from './components/AllBubbleCharts'
import type { Metadata } from 'next'
import DashboardPageTitle from '@/components/DashboardPageTitle'

export const metadata: Metadata = { title: 'Bubble Charts' }

const BubbleCharts = () => {
  return (
    <>
      <DashboardPageTitle title="Bubble" subName="Charts" />
      <Row>
        <Col xl={9}>
          <AllBubbleCharts />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: '#simple', label: 'Simple Bubble Chart' },
              { link: '#3d-bubble', label: '3D Bubble Chart' },
            ]}
          />
        </Col>
      </Row>
    </>
  )
}

export default BubbleCharts
