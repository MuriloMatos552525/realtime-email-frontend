// pages/send-message.js
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';

export default function SendMessage() {
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user || !user.token) return;

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users/', {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            Accept: 'application/json',
          },
        });
        const otherUsers = response.data.filter((u) => u.username !== user.username);
        setUsers(otherUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        if (error.response && error.response.data) {
          alert(`Erro: ${error.response.data.detail}`);
        } else {
          alert('Erro ao buscar usuários. Por favor, tente novamente mais tarde.');
        }
      }
    };
    fetchUsers();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      alert('Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/messages/',
        { recipient_id: recipientId, title, body },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      alert('Mensagem enviada com sucesso');
      setRecipientId('');
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      if (error.response && error.response.data) {
        alert(`Erro: ${error.response.data.detail}`);
      } else {
        alert('Erro ao enviar mensagem. Por favor, tente novamente mais tarde.');
      }
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <h1>Enviar Mensagem</h1>
        <form onSubmit={handleSubmit}>
          <select
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            required
          >
            <option value="">Selecione um destinatário</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select><br/>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          /><br/>
          <textarea
            placeholder="Mensagem"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          /><br/>
          <button type="submit">Enviar</button>
        </form>
      </Layout>
    </ProtectedRoute>
  );
}
