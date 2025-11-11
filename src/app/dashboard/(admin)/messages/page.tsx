import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { ChatProvider } from "@/context/useChatContext";
import type { Metadata } from "next";
import { Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const ChatApp = dynamicImport(() => import('./components/ChatApp'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const ChatPage = () => {
  return (
    <>
      <DashboardPageTitle title="Messages" subName="Real Estate" />
      <Row className="g-1">
        <ChatProvider>
          <ChatApp />
        </ChatProvider>
      </Row>
    </>
  );
};

export default ChatPage;
