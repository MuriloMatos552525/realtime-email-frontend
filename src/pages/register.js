// pages/register.js
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { registerUser } from '../utils/auth';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(username, password);
      login(username, data.access_token);
      router.push('/');
    } catch (error) {
      if (error.response) {
        console.error('Erro na resposta do servidor:', error.response.data);
        alert(error.response.data.detail || 'Erro ao registrar usuário');
      } else if (error.request) {
        console.error('Nenhuma resposta recebida:', error.request);
        alert('Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.');
      } else {
        console.error('Erro ao configurar a requisição:', error.message);
        alert('Ocorreu um erro inesperado. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="container">
      <h1>Registrar</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br/>
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}
