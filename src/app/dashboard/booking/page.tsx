"use client";

import { Row, Col } from "react-bootstrap";
import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import StatisticsCards from "./components/StatisticsCards";
import ReservationsChart from "./components/ReservationsChart";
import RevenueChart from "./components/RevenueChart";
import RecentReservations from "./components/RecentReservations";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const BookingOverviewPage = () => {
  return (
    <>
      <DashboardPageTitle title="Booking Overview" subName="Booking" />

      {/* Statistics Cards */}
      <StatisticsCards />

      {/* Charts */}
      <Row>
        <Col lg={6}>
          <ReservationsChart />
        </Col>
        <Col lg={6}>
          <RevenueChart />
        </Col>
      </Row>

      {/* Recent Reservations */}
      <Row>
        <Col xs={12}>
          <RecentReservations />
        </Col>
      </Row>
    </>
  );
};

export default BookingOverviewPage;
