import UIExamplesList from "@/components/dashboard/UIExamplesList";
import dynamicImport from 'next/dynamic';
// import { getAllDataTableRecords } from '@/helpers/data'
import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { getAllDataTableRecords } from "@/helpers/data";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AllDataTables = dynamicImport(() => import('./components/AllDataTables'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const GridJS = async () => {
  const dataTableRecords = await getAllDataTableRecords();
  return (
    <>
      <DashboardPageTitle title="Grid JS" subName="Table" />
      <Row>
        <Col xl={10}>
          {" "}
          <AllDataTables dataTableRecords={dataTableRecords} />
        </Col>
        <Col xl={2}>
          {dataTableRecords && (
            <UIExamplesList
              examples={[
                { link: "#overview", label: "Overview" },
                { link: "#basic", label: "Basic" },
                { link: "#pagination", label: "Pagination" },
                { link: "#search", label: "Search" },
                { link: "#sorting", label: "Sorting" },
                { link: "#loading_state", label: "Loading State" },
                { link: "#fixed_header", label: "Fixed Header" },
                { link: "#hidden_column", label: "Hidden Columns" },
              ]}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default GridJS;
