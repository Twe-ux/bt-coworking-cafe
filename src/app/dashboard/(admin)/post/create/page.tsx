import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import FileUpload from "@/components/dashboard/FileUpload";
import { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const CreatePost = dynamicImport(() => import('./components/CreatePost'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const CreatePostCard = dynamicImport(() => import('./components/CreatePostCard'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const PostCreatePage = () => {
  return (
    <>
      <DashboardPageTitle title="Blog Create" subName="Blog" />
      <Row>
        <Col xl={3} lg={4}>
          <CreatePostCard />
        </Col>
        <Col xl={9} lg={8}>
          <FileUpload title="" />
          <CreatePost />
        </Col>
      </Row>
    </>
  );
};

export default PostCreatePage;
