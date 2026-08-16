import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { FinanceProvider } from './FinanceContext';
import Dashboard from './Dashboard';
import Login from './Login';
import SignUp from './SignUp';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

type View = 'login' | 'signup' | 'dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setView('dashboard');
      } else {
        setView('login');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
    setView('login');
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
      {view === 'dashboard' && user ? (
        <FinanceProvider userId={user.uid}>
          <Dashboard onLogout={handleLogout} userEmail={user.email || ''} />
        </FinanceProvider>
      ) : view === 'signup' ? (
        <SignUp
          onSignUp={() => setView('dashboard')}
          onGoToLogin={() => setView('login')}
        />
      ) : (
        <Login
          onLogin={() => setView('dashboard')}
          onGoToSignUp={() => setView('signup')}
        />
      )}
    </ChakraProvider>
  );
};

export default App;
