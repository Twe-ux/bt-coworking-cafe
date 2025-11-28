import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import CreatePost from "./components/CreatePost";

// Force dynamic rendering
export const dynamic = "force-dynamic";

const PostCreatePage = () => {
  return (
    <>
      {/* <DashboardPageTitle title="Blog Create" subName="Blog" /> */}

      <CreatePost />
    </>
  );
};

export default PostCreatePage;
