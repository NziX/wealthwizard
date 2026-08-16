import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { FinanceProvider } from './FinanceContext';
import Dashboard from './Dashboard';
import Login from './Login';
import SignUp from './SignUp';
import VerifyEmail from './VerifyEmail';
import { auth } from './firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

type View = 'login' | 'signup' | 'verify' | 'dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');
  const [loading, setLoading] = useState(true);

  const checkUserVerified = (firebaseUser: User) => {
    const isGoogleProvider = firebaseUser.providerData.some(
      (p) => p.providerId === 'google.com'
    );
    return isGoogleProvider || firebaseUser.emailVerified;
  };

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        if (checkUserVerified(firebaseUser)) {
          setView('dashboard');
        } else {
          setView('verify');
        }
      } else {
        setView('login');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
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
      ) : view === 'verify' && user ? (
        <VerifyEmail
          user={user}
          onVerified={() => setView('dashboard')}
          onLogout={handleLogout}
        />
      ) : view === 'signup' ? (
        <SignUp
          onSignUp={() => {
            if (auth.currentUser && checkUserVerified(auth.currentUser)) {
              setView('dashboard');
            } else {
              setView('verify');
            }
          }}
          onGoToLogin={() => setView('login')}
        />
      ) : (
        <Login
          onLogin={() => {
            if (auth.currentUser && checkUserVerified(auth.currentUser)) {
              setView('dashboard');
            } else {
              setView('verify');
            }
          }}
          onGoToSignUp={() => setView('signup')}
        />
      )}
    </ChakraProvider>
  );
};

export default App;
