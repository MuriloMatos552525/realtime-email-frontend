// components/UnreadCount.js
import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { WS_URL } from '../utils/config';

export default function UnreadCount() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useContext(AuthContext);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/messages/inbox/', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const unreadMessages = response.data.filter((msg) => !msg.is_read);
      setUnreadCount(unreadMessages.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchUnreadCount();

    const ws = new WebSocket(`${WS_URL}/ws/?token=${user.token}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === 'new_message' || data.event === 'unread_count_updated') {
        if (data.unread_count !== undefined) {
          setUnreadCount(data.unread_count);
        } else {
          fetchUnreadCount();
        }
      }
    };

    ws.onclose = () => {
      console.log('Conexão WebSocket fechada');
    };

    return () => {
      ws.close();
    };
  }, [user]);

  return <span> Mensagens não lidas: {unreadCount}</span>;
}
