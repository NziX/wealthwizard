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
  Image
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      toast({
        title: 'Login Successful',
        description: 'Welcome to WealthWizard',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      onLogin();
    } else {
      toast({
        title: 'Invalid Credentials',
        description: 'Please enter both email and password.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
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
              <Heading size="xl" color="brand.900" fontWeight="extrabold">
                WealthWizard
              </Heading>
              <Text color="gray.500">Sign in to manage your finances</Text>
            </VStack>
            
            <Box w="100%">
              <form onSubmit={handleLogin}>
                <VStack spacing="5">
                  <FormControl id="email" isRequired>
                    <FormLabel color="gray.700">Email address</FormLabel>
                    <InputGroup>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        focusBorderColor="brand.500"
                        size="lg"
                        borderRadius="md"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl id="password" isRequired>
                    <FormLabel color="gray.700">Password</FormLabel>
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
                    mt="4"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
            </Box>
          </VStack>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default Login;
