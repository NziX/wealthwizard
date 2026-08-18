import React from 'react';
import Login from './Login';

interface SignUpProps {
  onSignUp: () => void;
  onGoToLogin?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp }) => {
  return <Login onLogin={onSignUp} />;
};

export default SignUp;
