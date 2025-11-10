import { Col, Row } from 'react-bootstrap'
import UIExamplesList from '@/components/UIExamplesList'
import AllBoxPlotCharts from './components/AllBoxPlotCharts'
import type { Metadata } from 'next'
import DashboardPageTitle from '@/components/DashboardPageTitle'

const metadata: Metadata = { title: 'Boxplot Alert' }

const BoxPlotCharts = () => {
  return (
    <>
      <DashboardPageTitle title="Boxplot" subName="Charts" />
      <Row>
        <Col xl={9}>
          <AllBoxPlotCharts />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: '#basic', label: 'Basic Boxplot' },
              { link: '#scatter', label: 'Scatter Boxplot' },
            ]}
          />
        </Col>
      </Row>
    </>
  )
}

export default BoxPlotCharts
