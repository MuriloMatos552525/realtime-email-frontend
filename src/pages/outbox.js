// pages/outbox.js
import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import MessageList from '../components/MessageList';

export default function Outbox() {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages/outbox/', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Erro ao buscar mensagens enviadas:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchMessages();
  }, [user]);

  return (
    <ProtectedRoute>
      <Layout>
        <h1>Mensagens Enviadas</h1>
        {messages.length === 0 ? (
          <p>Você não tem mensagens enviadas.</p>
        ) : (
          <MessageList messages={messages} isOutbox />
        )}
      </Layout>
    </ProtectedRoute>
  );
}
