import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { FinanceProvider } from './FinanceContext';
import Dashboard from './Dashboard';
import Login from './Login';
import { auth } from './firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (loading) {
    return (
      <ChakraProvider>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '20px',
          fontFamily: 'sans-serif',
        }}>
          Loading WealthWizard...
        </div>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      {user ? (
        <FinanceProvider userId={user.uid}>
          <Dashboard onLogout={handleLogout} userEmail={user.email || ''} />
        </FinanceProvider>
      ) : (
        <Login onLogin={() => {}} />
      )}
    </ChakraProvider>
  );
};

export default App;
