import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Image,
  Link,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

const MotionBox = motion(Box);

interface SignUpProps {
  onSignUp: () => void;
  onGoToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onGoToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords Do Not Match',
        description: 'Please make sure both passwords are the same.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Account Created!',
        description: 'Welcome to WealthWizard! Your account is ready.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      onSignUp();
    } catch (error: any) {
      let message = 'Failed to create account. Please try again.';
      if (error.code === 'auth/email-already-in-use') message = 'This email is already registered. Please log in.';
      if (error.code === 'auth/invalid-email') message = 'Please enter a valid email address.';
      if (error.code === 'auth/weak-password') message = 'Password is too weak. Use at least 6 characters.';
      toast({
        title: 'Sign Up Failed',
        description: message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg="white"
          boxShadow={{ base: 'none', sm: 'xl' }}
          borderRadius={{ base: 'none', sm: '2xl' }}
        >
          <VStack spacing="8">
            <VStack spacing="3" textAlign="center">
              <Image
                src={process.env.PUBLIC_URL + '/logo.svg'}
                alt="WealthWizard Logo"
                boxSize="80px"
                borderRadius="2xl"
                shadow="md"
                mb={1}
              />
              <Heading size="xl" fontWeight="extrabold">
                Create Account
              </Heading>
              <Text color="gray.500">Join WealthWizard and take control of your finances</Text>
            </VStack>

            <Box w="100%">
              <form onSubmit={handleSignUp}>
                <VStack spacing="5">
                  <FormControl id="signup-email" isRequired>
                    <FormLabel color="gray.700">Email address</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      focusBorderColor="blue.500"
                      size="lg"
                    />
                  </FormControl>

                  <FormControl id="signup-password" isRequired>
                    <FormLabel color="gray.700">Password</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        focusBorderColor="blue.500"
                        pr="4.5rem"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <FiEyeOff /> : <FiEye />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <FormControl id="confirm-password" isRequired>
                    <FormLabel color="gray.700">Confirm Password</FormLabel>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      focusBorderColor="blue.500"
                      size="lg"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    isLoading={isLoading}
                    loadingText="Creating Account..."
                    mt={2}
                  >
                    Create Account
                  </Button>
                </VStack>
              </form>
            </Box>

            <Text color="gray.500" fontSize="sm">
              Already have an account?{' '}
              <Link color="blue.500" fontWeight="bold" onClick={onGoToLogin} cursor="pointer">
                Sign In
              </Link>
            </Text>
          </VStack>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default SignUp;
