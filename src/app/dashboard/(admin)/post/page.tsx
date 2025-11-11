import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Metadata } from "next";
import { Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const Articles = dynamicImport(() => import('./components/Articles'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const FreshArticles = dynamicImport(() => import('./components/FreshArticles'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Posts = dynamicImport(() => import('./components/Posts'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

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
