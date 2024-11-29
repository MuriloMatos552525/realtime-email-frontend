import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Requisição para criar um novo usuário
      await axios.post('http://localhost:8000/users/', { username, password });

      // Preparação dos parâmetros para a requisição de login
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      params.append('grant_type', 'password'); // Adicionado o grant_type

      // Requisição para obter o token de acesso
      const response = await axios.post('http://localhost:8000/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Definido o Content-Type
        },
      });

      // Chamada da função login do contexto de autenticação
      login(username, response.data.access_token);
      router.push('/');
    } catch (error) {
      if (error.response) {
        // O servidor respondeu com um status diferente de 2xx
        console.error('Erro na resposta do servidor:', error.response.data);
        alert(error.response.data.detail || 'Erro ao registrar usuário');
      } else if (error.request) {
        // A requisição foi feita, mas nenhuma resposta foi recebida
        console.error('Nenhuma resposta recebida:', error.request);
        alert('Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.');
      } else {
        // Algo aconteceu ao configurar a requisição
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
