// pages/index.js
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <ProtectedRoute>
      <Layout>
        <h1>Bem-vindo ao Sistema de Mensagens</h1>
        <p>Selecione uma opção no menu para começar.</p>
      </Layout>
    </ProtectedRoute>
  );
}
