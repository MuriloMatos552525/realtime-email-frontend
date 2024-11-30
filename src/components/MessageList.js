// components/MessageList.js
import MessageItem from './MessageItem';

export default function MessageList({ messages, onMessageUpdate, isOutbox }) {
  const handleMessageUpdate = (messageId, updatedFields) => {
    if (onMessageUpdate) {
      onMessageUpdate(messageId, updatedFields);
    }
  };

  return (
    <ul className="message-list">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          onMessageUpdate={handleMessageUpdate}
          isOutbox={isOutbox}
        />
      ))}
    </ul>
  );
}
