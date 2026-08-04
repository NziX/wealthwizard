import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { FinanceProvider } from './FinanceContext';
import Dashboard from './Dashboard';

/**
 * App Component - Root application wrapper
 * 
 * This component wraps the entire application with:
 * 1. ChakraProvider - For Chakra UI theming and component system
 * 2. FinanceProvider - For global finance state management
 */
const App: React.FC = () => {
  return (
    <ChakraProvider>
      <FinanceProvider>
        <Dashboard />
      </FinanceProvider>
    </ChakraProvider>
  );
};

export default App;
