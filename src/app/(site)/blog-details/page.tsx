import BlogArticle from "@/components/site/blogs/blogArticle";
import BlogSidebar from "@/components/site/blogs/blogSidebar";
import Comments from "@/components/site/blogs/comments";
import LeaveReply from "@/components/site/blogs/leaveReply";
import PageTitle from "@/components/site/pageTitle";

const BlogDetails = () => {
  return (
    <>
      <PageTitle title={"Blog Details"} currentPage={"Blog Details"} />
      <section className="blog__details py__130">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <BlogArticle />
              <Comments />
              <LeaveReply />
            </div>
            <div className="col-lg-4 mt-5 mt-lg-0">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
