// components/Navbar.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';
import UnreadCount from './UnreadCount';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/inbox">Inbox</Link>
      <Link href="/outbox">Outbox</Link>
      <Link href="/send-message">Enviar Mensagem</Link>
      {user && <UnreadCount />}
      {user && <button onClick={logout}>Sair</button>}
    </nav>
  );
}
