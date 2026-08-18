import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  useToast,
  Image,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { FiShield, FiZap, FiCloud } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const MotionBox = motion(Box);

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const toast = useToast();

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: 'Google Sign In Successful',
        description: 'Welcome to WealthWizard!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      onLogin();
    } catch (error: any) {
      let message = error.message || 'Could not authenticate with Google.';
      if (error.code === 'auth/unauthorized-domain') {
        message = 'Please add your Vercel domain to Firebase Authorized Domains list.';
      }
      if (error.code === 'auth/operation-not-allowed') {
        message = 'Google sign-in is not enabled in your Firebase console settings.';
      }
      toast({
        title: 'Google Sign In Failed',
        description: message,
        status: 'error',
        duration: 6000,
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
          py={{ base: '8', sm: '10' }}
          px={{ base: '6', sm: '10' }}
          bg="white"
          boxShadow="2xl"
          borderRadius="2xl"
          textAlign="center"
        >
          <VStack spacing="7">
            <VStack spacing="3">
              <Image
                src={process.env.PUBLIC_URL + '/logo.svg'}
                alt="WealthWizard Logo"
                boxSize="90px"
                borderRadius="2xl"
                shadow="lg"
                mb={1}
              />
              <Heading size="xl" color="gray.800" fontWeight="extrabold" letterSpacing="tight">
                WealthWizard
              </Heading>
              <Text color="gray.500" fontSize="md" maxW="sm">
                Your Smart Personal Financial Assistant
              </Text>
            </VStack>

            <VStack spacing="3" w="full" pt={2}>
              <Button
                w="full"
                size="lg"
                height="56px"
                variant="outline"
                leftIcon={<FcGoogle size={26} />}
                onClick={handleGoogleLogin}
                isLoading={isGoogleLoading}
                loadingText="Verifying Google Account..."
                borderColor="gray.300"
                borderRadius="xl"
                fontWeight="bold"
                fontSize="md"
                boxShadow="sm"
                _hover={{
                  bg: 'gray.50',
                  borderColor: 'blue.500',
                  transform: 'translateY(-1px)',
                  boxShadow: 'md',
                }}
                transition="all 0.2s"
              >
                Continue with Google
              </Button>
              <Text fontSize="xs" color="gray.400">
                100% passwordless & instant access via your Google account
              </Text>
            </VStack>

            <HStack justify="center" spacing={4} pt={2} flexWrap="wrap">
              <Badge colorScheme="blue" px={3} py={1} borderRadius="full" textTransform="none" fontSize="xs">
                <HStack spacing={1}>
                  <FiShield />
                  <Text>Verified Identity</Text>
                </HStack>
              </Badge>
              <Badge colorScheme="purple" px={3} py={1} borderRadius="full" textTransform="none" fontSize="xs">
                <HStack spacing={1}>
                  <FiCloud />
                  <Text>Real-time Sync</Text>
                </HStack>
              </Badge>
              <Badge colorScheme="green" px={3} py={1} borderRadius="full" textTransform="none" fontSize="xs">
                <HStack spacing={1}>
                  <FiZap />
                  <Text>Passwordless</Text>
                </HStack>
              </Badge>
            </HStack>
          </VStack>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default Login;
