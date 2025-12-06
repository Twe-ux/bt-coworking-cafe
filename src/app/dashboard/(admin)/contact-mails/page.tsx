"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Table, Badge, Button, Modal, Form, ButtonGroup } from "react-bootstrap";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  reply?: string;
  repliedAt?: string;
  createdAt: string;
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const refreshUnreadCount = () => {
    // Dispatch custom event to refresh unread count
    window.dispatchEvent(new Event("refreshUnreadCount"));
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/contact-mails?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    setShowModal(true);

    // Mark as read if unread
    if (message.status === "unread") {
      try {
        const response = await fetch(`/api/contact-mails/${message._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "read" }),
        });

        if (response.ok) {
          await fetchMessages();
          // Small delay to ensure DB is updated
          setTimeout(() => refreshUnreadCount(), 100);
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/contact-mails/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchMessages();
        setTimeout(() => refreshUnreadCount(), 100);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setSending(true);
    try {
      const response = await fetch(`/api/contact-mails/${selectedMessage._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText }),
      });

      if (response.ok) {
        setShowReplyModal(false);
        setReplyText("");
        await fetchMessages();
        setTimeout(() => refreshUnreadCount(), 100);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;

    try {
      const response = await fetch(`/api/contact-mails/${id}`, { method: "DELETE" });

      if (response.ok) {
        await fetchMessages();
        setTimeout(() => refreshUnreadCount(), 100);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      unread: "danger",
      read: "warning",
      replied: "success",
      archived: "secondary",
    };
    const labels: Record<string, string> = {
      unread: "Non lu",
      read: "Lu",
      replied: "Répondu",
      archived: "Archivé",
    };
    return <Badge bg={variants[status]}>{labels[status]}</Badge>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="container-fluid">
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Messages de contact
            {unreadCount > 0 && (
              <Badge bg="danger" className="ms-2">
                {unreadCount} nouveau{unreadCount > 1 ? "x" : ""}
              </Badge>
            )}
          </h5>
          <ButtonGroup>
            <Button
              variant={filter === "all" ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Tous
            </Button>
            <Button
              variant={filter === "unread" ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Non lus
            </Button>
            <Button
              variant={filter === "read" ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => setFilter("read")}
            >
              Lus
            </Button>
            <Button
              variant={filter === "replied" ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => setFilter("replied")}
            >
              Répondus
            </Button>
            <Button
              variant={filter === "archived" ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => setFilter("archived")}
            >
              Archivés
            </Button>
          </ButtonGroup>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <p className="text-muted text-center py-4">Aucun message</p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Sujet</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr
                    key={message._id}
                    style={{
                      cursor: "pointer",
                      fontWeight: message.status === "unread" ? "bold" : "normal",
                    }}
                    onClick={() => handleViewMessage(message)}
                  >
                    <td>{getStatusBadge(message.status)}</td>
                    <td>{formatDate(message.createdAt)}</td>
                    <td>{message.name}</td>
                    <td>{message.email}</td>
                    <td>{message.subject}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewMessage(message)}
                        className="py-0 px-2"
                        style={{ fontSize: '0.75rem' }}
                      >
                        <i className="bi bi-eye me-1" style={{ fontSize: '0.875rem' }}></i>
                        Voir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* View Message Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Message de {selectedMessage?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage && (
            <div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Email:</strong> {selectedMessage.email}
                </div>
                <div className="col-md-6">
                  <strong>Téléphone:</strong> {selectedMessage.phone || "Non renseigné"}
                </div>
              </div>
              <div className="mb-3">
                <strong>Sujet:</strong> {selectedMessage.subject}
              </div>
              <div className="mb-3">
                <strong>Date:</strong> {formatDate(selectedMessage.createdAt)}
              </div>
              <div className="mb-3">
                <strong>Statut:</strong> {getStatusBadge(selectedMessage.status)}
              </div>
              <hr />
              <div className="mb-3">
                <strong>Message:</strong>
                <p className="mt-2" style={{ whiteSpace: "pre-wrap" }}>
                  {selectedMessage.message}
                </p>
              </div>
              {selectedMessage.reply && (
                <>
                  <hr />
                  <div className="mb-3">
                    <strong>Réponse envoyée:</strong>
                    <p className="mt-2 text-muted" style={{ whiteSpace: "pre-wrap" }}>
                      {selectedMessage.reply}
                    </p>
                    {selectedMessage.repliedAt && (
                      <small className="text-muted">
                        Répondu le {formatDate(selectedMessage.repliedAt)}
                      </small>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => handleUpdateStatus(selectedMessage!._id, "archived")}
            className="py-1 px-3"
          >
            <i className="bi bi-archive me-1"></i> Archiver
          </Button>
          {selectedMessage?.status !== "replied" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setShowReplyModal(true);
                setShowModal(false);
              }}
              className="py-1 px-3"
            >
              <i className="bi bi-reply me-1"></i> Répondre
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(selectedMessage!._id)}
            className="py-1 px-3"
          >
            <i className="bi bi-trash me-1"></i> Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reply Modal */}
      <Modal show={showReplyModal} onHide={() => setShowReplyModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Répondre à {selectedMessage?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage && (
            <div>
              <div className="mb-3 p-3 bg-light rounded">
                <strong>Message original:</strong>
                <p className="mt-2 mb-0" style={{ whiteSpace: "pre-wrap" }}>
                  {selectedMessage.message}
                </p>
              </div>
              <Form.Group>
                <Form.Label>Votre réponse:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Écrivez votre réponse..."
                />
              </Form.Group>
              <small className="text-muted">
                La réponse sera envoyée à {selectedMessage.email}
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowReplyModal(false)}
            className="py-1 px-3"
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleReply}
            disabled={sending || !replyText.trim()}
            className="py-1 px-3"
          >
            <i className="bi bi-send me-1"></i>
            {sending ? "Envoi..." : "Envoyer"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MessagesPage;
