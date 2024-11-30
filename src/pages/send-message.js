// pages/send-message.js
import { useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import { FaPaperPlane, FaUser } from 'react-icons/fa';

export default function SendMessage() {
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { user } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!user || !user.token) return;

    const fetchUsers = async () => {
      try {
        const response = await api.get('/users/', {
          headers: { 
            Authorization: `Bearer ${user.token}`,
          },
        });
        const otherUsers = response.data.filter((u) => u.username !== user.username);
        setUsers(otherUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        if (error.response && error.response.data) {
          setErrorMessage(`Erro: ${error.response.data.detail}`);
        } else {
          setErrorMessage('Erro ao buscar usuários. Por favor, tente novamente mais tarde.');
        }
      }
    };
    fetchUsers();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      setErrorMessage('Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }

    try {
      await api.post(
        '/messages/',
        { recipient_id: recipientId, title, body },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSuccessMessage('Mensagem enviada com sucesso!');
      setErrorMessage('');
      setRecipientId('');
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      if (error.response && error.response.data) {
        setErrorMessage(`Erro: ${error.response.data.detail}`);
      } else {
        setErrorMessage('Erro ao enviar mensagem. Por favor, tente novamente mais tarde.');
      }
      setSuccessMessage('');
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="send-message-container">
          <div className="send-message-card">
            <h1>Enviar Mensagem</h1>

            {errorMessage && <div className="alert error">{errorMessage}</div>}
            {successMessage && <div className="alert success">{successMessage}</div>}

            <form className="send-message-form" onSubmit={handleSubmit}>
              <label htmlFor="recipient" className="form-label">
                <FaUser /> Destinatário
              </label>
              <select
                id="recipient"
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
              </select>

              <label htmlFor="title" className="form-label">
                Título
              </label>
              <input
                type="text"
                id="title"
                placeholder="Título da mensagem"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label htmlFor="body" className="form-label">
                Mensagem
              </label>
              <textarea
                id="body"
                placeholder="Escreva sua mensagem aqui..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              ></textarea>

              <button type="submit">
                <FaPaperPlane /> Enviar
              </button>
            </form>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
