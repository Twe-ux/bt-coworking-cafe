import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { ChatProvider } from "@/context/useChatContext";
import type { Metadata } from "next";
import { Row } from "react-bootstrap";
import dynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const ChatApp = dynamic(() => import('./components/ChatApp'), {
  ssr: false,
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
