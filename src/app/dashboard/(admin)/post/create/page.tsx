import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import CreatePost from './components/CreatePost';
import CreatePostCard from './components/CreatePostCard';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const PostCreatePage = () => {
  return (
    <>
      <DashboardPageTitle title="Blog Create" subName="Blog" />
      <Row>
        <Col xl={3} lg={4}>
          <CreatePostCard />
        </Col>
        <Col xl={9} lg={8}>
          <CreatePost />
        </Col>
      </Row>
    </>
  );
};

export default PostCreatePage;
