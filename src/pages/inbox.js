// pages/inbox.js
import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { WS_URL } from '../utils/config';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import MessageList from '../components/MessageList';

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages/inbox/', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const handleMessageUpdate = (messageId, updatedFields) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updatedFields } : msg
      )
    );
  };

  useEffect(() => {
    if (!user) return;

    fetchMessages();

    const ws = new WebSocket(`${WS_URL}/ws/?token=${user.token}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === 'new_message') {
        fetchMessages();
        alert('Você recebeu uma nova mensagem!');
      }
    };

    ws.onclose = () => {
      console.log('Conexão WebSocket fechada');
    };

    return () => {
      ws.close();
    };
  }, [user]);

  return (
    <ProtectedRoute>
      <Layout>
        <h1>Caixa de Entrada</h1>
        {messages.length === 0 ? (
          <p>Você não tem mensagens na sua caixa de entrada.</p>
        ) : (
          <MessageList messages={messages} onMessageUpdate={handleMessageUpdate} />
        )}
      </Layout>
    </ProtectedRoute>
  );
}
