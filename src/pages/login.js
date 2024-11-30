// pages/login.js
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { loginUser } from '../utils/auth';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      login(username, data.access_token);
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Nome de usuário ou senha incorretos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Bem-vindo de Volta</h1>
        <p>Faça login para continuar</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
        <p className="register-text">
          Não tem uma conta? <Link href="/register">Registrar</Link>
        </p>
      </div>
    </div>
  );
}
