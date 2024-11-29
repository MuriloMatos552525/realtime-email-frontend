// pages/inbox.js
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import MessageList from '../components/MessageList';

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/messages/inbox/', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMessageUpdate = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, is_read: true } : msg
      )
    );
  };

  useEffect(() => {
    if (!user) return;

    fetchMessages();

    const ws = new WebSocket(`ws://localhost:8000/ws/?token=${user.token}`);

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
        <MessageList messages={messages} onMessageUpdate={handleMessageUpdate} />
      </Layout>
    </ProtectedRoute>
  );
}
