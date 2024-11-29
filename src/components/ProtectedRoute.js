// components/ProtectedRoute.js
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  if (user === undefined) {
    return <div>Carregando...</div>;
  }

  if (user === null) {
    return null;
  }

  return <>{children}</>;
}
