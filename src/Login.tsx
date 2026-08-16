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
  Divider,
  HStack,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const MotionBox = motion(Box);

interface LoginProps {
  onLogin: () => void;
  onGoToSignUp: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const toast = useToast();

  const validateGmail = (emailVal: string) => {
    const cleanEmail = emailVal.trim().toLowerCase();
    return cleanEmail.endsWith('@gmail.com') || cleanEmail.endsWith('@googlemail.com');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Missing Fields',
        description: 'Please enter both email and password.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    if (!validateGmail(email)) {
      toast({
        title: 'Only Gmail Accounts Allowed',
        description: 'Please enter a valid @gmail.com address.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast({
        title: 'Login Successful',
        description: 'Welcome back to WealthWizard!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      onLogin();
    } catch (error: any) {
      let message = `Login failed: ${error.message || 'Please try again.'} (${error.code || 'unknown'})`;
      if (error.code === 'auth/user-not-found') message = 'No account found with this Gmail. Please sign up first.';
      if (error.code === 'auth/wrong-password') message = 'Incorrect password. Please try again.';
      if (error.code === 'auth/invalid-email') message = 'Please enter a valid @gmail.com address.';
      if (error.code === 'auth/too-many-requests') message = 'Too many failed attempts. Please wait and try again.';
      if (error.code === 'auth/invalid-credential') message = 'Incorrect email or password. Please try again.';
      toast({
        title: 'Login Failed',
        description: message,
        status: 'error',
        duration: 6000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: 'Gmail Verified & Signed In!',
        description: 'Welcome back to WealthWizard!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      onLogin();
    } catch (error: any) {
      toast({
        title: 'Google Sign In Failed',
        description: error.message || 'Could not verify Gmail account.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsGoogleLoading(false);
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
          <VStack spacing="6">
            <VStack spacing="2" textAlign="center">
              <Image
                src={process.env.PUBLIC_URL + '/logo.svg'}
                alt="WealthWizard Logo"
                boxSize="80px"
                borderRadius="2xl"
                shadow="md"
                mb={1}
              />
              <Heading size="xl" color="brand.900" fontWeight="extrabold">
                WealthWizard
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Sign in with your verified <b>Gmail</b> account
              </Text>
            </VStack>

            {/* Google 1-Click Verification Button */}
            <Button
              w="full"
              size="lg"
              variant="outline"
              leftIcon={<FcGoogle size={22} />}
              onClick={handleGoogleLogin}
              isLoading={isGoogleLoading}
              borderColor="gray.300"
              _hover={{ bg: 'gray.50' }}
            >
              Sign in with Google (Gmail)
            </Button>

            <HStack w="full">
              <Divider />
              <Text fontSize="xs" color="gray.400" whiteSpace="nowrap">
                OR GMAIL & PASSWORD
              </Text>
              <Divider />
            </HStack>

            <Box w="100%">
              <form onSubmit={handleLogin}>
                <VStack spacing="4">
                  <FormControl id="email" isRequired>
                    <FormLabel color="gray.700" fontSize="sm">
                      Gmail address
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        focusBorderColor="brand.500"
                        size="lg"
                        borderRadius="md"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl id="password" isRequired>
                    <FormLabel color="gray.700" fontSize="sm">
                      Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        focusBorderColor="brand.500"
                        size="lg"
                        borderRadius="md"
                      />
                      <InputRightElement h="full">
                        <IconButton
                          variant="ghost"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <FiEyeOff /> : <FiEye />}
                          onClick={() => setShowPassword(!showPassword)}
                          color="gray.400"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    fontSize="md"
                    w="100%"
                    mt="2"
                    isLoading={isLoading}
                    loadingText="Signing In..."
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
            </Box>

            <Text color="gray.500" fontSize="sm">
              Don't have an account?{' '}
              <Link color="blue.500" fontWeight="bold" onClick={onGoToSignUp} cursor="pointer">
                Create Account
              </Link>
            </Text>
          </VStack>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default Login;
