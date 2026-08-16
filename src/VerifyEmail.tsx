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
  HStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { sendEmailVerification, User } from 'firebase/auth';

const MotionBox = motion(Box);

interface VerifyEmailProps {
  user: User;
  onVerified: () => void;
  onLogout: () => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ user, onVerified, onLogout }) => {
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const toast = useToast();

  const handleCheckVerification = async () => {
    setIsChecking(true);
    try {
      await user.reload(); // Refresh user state from Firebase
      if (user.emailVerified) {
        toast({
          title: 'Email Verified!',
          description: 'Welcome to WealthWizard!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        onVerified();
      } else {
        toast({
          title: 'Not Verified Yet',
          description: 'Please check your Gmail inbox and click the link sent to you.',
          status: 'warning',
          duration: 4000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error checking status',
        description: error.message || 'Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendLink = async () => {
    setIsResending(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: 'Verification Email Sent!',
        description: `A new link has been sent to ${user.email}`,
        status: 'info',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error: any) {
      toast({
        title: 'Could Not Resend Link',
        description: error.message || 'Please wait a moment before trying again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsResending(false);
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
          <VStack spacing="6" textAlign="center">
            <Image
              src={process.env.PUBLIC_URL + '/logo.svg'}
              alt="WealthWizard Logo"
              boxSize="80px"
              borderRadius="2xl"
              shadow="md"
              mb={1}
            />
            <Heading size="lg" fontWeight="extrabold">
              Verify Your Gmail Account
            </Heading>

            <Alert status="info" borderRadius="lg" fontSize="sm" textStyle="left">
              <AlertIcon />
              A verification link was sent to <b>{user.email}</b>.
            </Alert>

            <Text color="gray.600" fontSize="sm" lineHeight="relaxed">
              To prevent fake accounts, you must verify your Gmail address before accessing your dashboard.
              Please open your Gmail inbox and click the link.
            </Text>

            <VStack w="full" spacing={3} pt={2}>
              <Button
                colorScheme="blue"
                size="lg"
                w="full"
                onClick={handleCheckVerification}
                isLoading={isChecking}
                loadingText="Checking status..."
              >
                I've Verified My Email
              </Button>

              <HStack w="full" justify="space-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResendLink}
                  isLoading={isResending}
                >
                  Resend Link
                </Button>
                <Button variant="ghost" size="sm" colorScheme="red" onClick={onLogout}>
                  Log Out
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default VerifyEmail;
