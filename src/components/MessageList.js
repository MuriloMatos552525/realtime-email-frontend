// components/MessageList.js
import MessageItem from './MessageItem';

export default function MessageList({ messages, onMessageUpdate }) {
  return (
    <ul className="message-list">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} onMessageUpdate={onMessageUpdate} />
      ))}
    </ul>
  );
}
