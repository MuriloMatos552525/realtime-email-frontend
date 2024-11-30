// components/MessageItem.js
import { useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { FaEnvelopeOpenText, FaEnvelope, FaReply } from 'react-icons/fa';

export default function MessageItem({ message, onMessageUpdate, isOutbox }) {
  const { user } = useContext(AuthContext);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyBody, setReplyBody] = useState('');

  const handleMarkAsRead = async () => {
    try {
      await api.put(
        `/messages/${message.id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      onMessageUpdate(message.id, { is_read: true });
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleReply = () => {
    setShowReplyForm(true);
  };

  const handleSendReply = async () => {
    try {
      await api.post(
        '/messages/',
        {
          recipient_id: message.sender_id,
          title: `RE: ${message.title}`,
          body: replyBody,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      alert('Resposta enviada com sucesso!');
      setShowReplyForm(false);
      setReplyBody('');
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      alert('Erro ao enviar resposta.');
    }
  };

  return (
    <li className={`message-item ${!message.is_read && !isOutbox ? 'unread' : ''}`}>
      <div className="message-header">
        <h2>{message.title}</h2>
        {!isOutbox && (
          <span className="message-status">
            {message.is_read ? <FaEnvelopeOpenText /> : <FaEnvelope />}
          </span>
        )}
      </div>
      <p>
        <strong>{isOutbox ? 'Para' : 'De'}:</strong> {isOutbox ? message.recipient_username : message.sender_username}
      </p>
      <p>{message.body}</p>
      <p className="message-timestamp">
        {new Date(message.timestamp).toLocaleString()}
      </p>
      <div className="message-actions">
        {!message.is_read && !isOutbox && (
          <button onClick={handleMarkAsRead}>Marcar como lida</button>
        )}
        {!isOutbox && (
          <button onClick={handleReply}>
            <FaReply /> Responder
          </button>
        )}
      </div>
      {showReplyForm && (
        <div className="reply-form">
          <textarea
            placeholder="Escreva sua resposta..."
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
          ></textarea>
          <button onClick={handleSendReply}>Enviar Resposta</button>
          <button
            onClick={() => {
              setShowReplyForm(false);
              setReplyBody('');
            }}
          >
            Cancelar
          </button>
        </div>
      )}
    </li>
  );
}
