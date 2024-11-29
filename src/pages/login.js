import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      params.append('grant_type', 'password'); // Adicionado o grant_type

      const response = await axios.post('http://localhost:8000/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Definido o Content-Type
        },
      });
      login(username, response.data.access_token);
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Nome de usuário ou senha incorretos');
    }
  };

  return (
    <div className="container">
      <h1>Entrar</h1>
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
        <button type="submit">Entrar</button>
      </form>
      <p>
        Não tem uma conta? <a href="/register">Registrar</a>
      </p>
    </div>
  );
}
