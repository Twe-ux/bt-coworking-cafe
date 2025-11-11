import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Metadata } from "next";
import { Row } from "react-bootstrap";
import Articles from './components/Articles';
import FreshArticles from './components/FreshArticles';
import Posts from './components/Posts';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const PostPage = () => {
  return (
    <>
      <DashboardPageTitle title="Blog Grid" subName="Blog" />
      <Row>
        <FreshArticles />
        <Articles />
      </Row>
      <Row>
        <Posts />
      </Row>
    </>
  );
};

export default PostPage;
