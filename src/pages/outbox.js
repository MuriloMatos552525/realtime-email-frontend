// pages/outbox.js
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import MessageList from '../components/MessageList';

export default function Outbox() {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/messages/outbox/', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error(error);
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
        <MessageList messages={messages} />
      </Layout>
    </ProtectedRoute>
  );
}
