// context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode'; // Importação corrigida
import { useRouter } from 'next/router';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwt_decode(token); // Uso corrigido
          setUser({ username: decoded.sub, token });
        } catch (error) {
          console.error('Token inválido:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, []);

  const login = (username, token) => {
    localStorage.setItem('token', token);
    setUser({ username, token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
