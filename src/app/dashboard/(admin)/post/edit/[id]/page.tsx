import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Col, Row } from "react-bootstrap";
import EditPost from './components/EditPost';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

const PostEditPage = ({ params }: PageProps) => {
  return (
    <>
      <DashboardPageTitle title="Modifier l'article" subName="Blog" />
      <Row>
        <Col lg={12}>
          <EditPost articleId={params.id} />
        </Col>
      </Row>
    </>
  );
};

export default PostEditPage;
