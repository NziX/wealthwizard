import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { FinanceProvider } from './FinanceContext';
import Dashboard from './Dashboard';
import Login from './Login';

/**
 * App Component - Root application wrapper
 * 
 * This component wraps the entire application with:
 * 1. ChakraProvider - For Chakra UI theming and component system
 * 2. FinanceProvider - For global finance state management
 */
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('wealthwizard_logged_in');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('wealthwizard_logged_in', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('wealthwizard_logged_in');
    setIsLoggedIn(false);
  };

  return (
    <ChakraProvider>
      {isLoggedIn ? (
        <FinanceProvider>
          <Dashboard onLogout={handleLogout} />
        </FinanceProvider>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </ChakraProvider>
  );
};

export default App;
