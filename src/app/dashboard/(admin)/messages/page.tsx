import { Row } from 'react-bootstrap'
import DashboardPageTitle from '@/components/DashboardPageTitle'
import { ChatProvider } from '@/context/useChatContext'
import type { Metadata } from 'next'
import ChatApp from './components/ChatApp'

export const metadata: Metadata = { title: 'Messages' }

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
  )
}

export default ChatPage
