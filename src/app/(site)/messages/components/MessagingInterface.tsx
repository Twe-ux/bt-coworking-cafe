"use client";

import { useState } from "react";
import { useChatContext } from "@/context/useChatContext";
import ConversationsList from "./ConversationsList";
import ChatWindow from "./ChatWindow";

export default function MessagingInterface() {
  const { conversations, activeConversation, loadingConversations } =
    useChatContext();
  const [showConversationList, setShowConversationList] = useState(true);

  // Loading state
  if (loadingConversations && conversations.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="text-muted mb-0">Chargement de vos conversations...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loadingConversations && conversations.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <i className="bi bi-chat-dots display-1 text-muted mb-3"></i>
          <h5 className="card-title">Aucune conversation</h5>
          <p className="card-text text-muted">
            Vous n'avez pas encore de conversations.
            <br />
            Contactez-nous pour démarrer une discussion !
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <div className="row g-0">
          {/* Conversations List - Mobile Toggle */}
          <div
            className={`col-lg-4 border-end ${
              showConversationList ? "d-block" : "d-none d-lg-block"
            }`}
          >
            <ConversationsList
              onConversationSelect={() => setShowConversationList(false)}
            />
          </div>

          {/* Chat Window */}
          <div
            className={`col-lg-8 ${
              showConversationList ? "d-none d-lg-block" : "d-block"
            }`}
          >
            {activeConversation ? (
              <ChatWindow
                onBack={() => setShowConversationList(true)}
              />
            ) : (
              <div className="d-none d-lg-flex align-items-center justify-content-center vh-50 p-5">
                <div className="text-center">
                  <i className="bi bi-chat-text display-1 text-muted mb-3"></i>
                  <h5 className="text-muted">Sélectionnez une conversation</h5>
                  <p className="text-muted">
                    Choisissez une conversation pour commencer à discuter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
