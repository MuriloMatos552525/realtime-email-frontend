// components/MessageItem.js
import { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function MessageItem({ message, onMessageUpdate }) {
  const { user } = useContext(AuthContext);

  const markAsRead = async () => {
    try {
      await axios.put(
        `http://localhost:8000/messages/${message.id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      onMessageUpdate(message.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <li className={`message-item ${!message.is_read ? 'unread' : ''}`}>
      <h2>{message.title}</h2>
      <p>{message.body}</p>
      {!message.is_read && <button onClick={markAsRead}>Marcar como lida</button>}
    </li>
  );
}
