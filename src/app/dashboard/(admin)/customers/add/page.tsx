import FileUpload from '@/components/FileUpload'
import DashboardPageTitle from '@/components/DashboardPageTitle'
import CustomerAddCard from './components/CustomerAddCard'
import AddCustomer from './components/AddCustomer'
import { Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Customers Add' }

const CustomerAddPage = () => {
  return (
    <>
      <DashboardPageTitle title="Customers Add" subName="Real Estate" />
      <Row>
        <CustomerAddCard />
        <Col xl={9} lg={12}>
          <FileUpload title="Add Customer Photo" />
          <AddCustomer />
        </Col>
      </Row>
    </>
  )
}

export default CustomerAddPage
