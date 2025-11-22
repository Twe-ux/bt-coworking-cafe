import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { ChatProvider } from "@/context/useChatContext";
import type { Metadata } from "next";
import { Row } from "react-bootstrap";
import ChatApp from './components/ChatApp';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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
