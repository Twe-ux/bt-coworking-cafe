import Footer from "@/components/dashboard/layout/footer";
import AuthProtectionWrapper from "@/components/dashboard/wrappers/AuthProtectionWrapper";
import { ChildrenType } from "@/types/component-props";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Container } from "react-bootstrap";

const TopNavigationBar = dynamic(
  () => import("@/components/dashboard/layout/TopNavigationBar/page")
);
const VerticalNavigationBar = dynamic(
  () => import("@/components/dashboard/layout/VerticalNavigationBar/page")
);

const AdminLayout = ({ children }: ChildrenType) => {
  return (
    <AuthProtectionWrapper>
      <div className="wrapper">
        <Suspense>
          <TopNavigationBar />
        </Suspense>
        <VerticalNavigationBar />
        <div className="page-content">
          <Container fluid>{children}</Container>
          <Footer />
        </div>
      </div>
    </AuthProtectionWrapper>
  );
};

export default AdminLayout;
