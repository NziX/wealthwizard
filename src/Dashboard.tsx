import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Progress,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
  Badge,
  Card,
  CardBody,
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spacer,
  Avatar,
  Image,
} from '@chakra-ui/react';
import {
  FiPlus,
  FiTrash2,
  FiSettings,
  FiTrendingUp,
  FiTarget,
  FiAlertTriangle,
  FiDollarSign,
  FiCalendar,
  FiSend,
} from 'react-icons/fi';
import { useFinance, Expense, SavingsGoal } from './FinanceContext';

// ============================================================================
// EXPENSE ENTRY MODAL COMPONENT
// ============================================================================

interface ExpenseFormData {
  amount: string;
  category: Expense['category'];
  date: string;
  description: string;
}

const ExpenseModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addExpense } = useFinance();
  const toast = useToast();
  
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (!validateForm()) return;

    addExpense({
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      description: formData.description || 'No description',
    });

    toast({
      title: '✅ Expense Added',
      description: `${formData.category} expense of ${formatRWF(parseFloat(formData.amount))} recorded!`,
      status: 'success',
      duration: 3,
      isClosable: true,
      position: 'top-right',
    });

    // Reset form
    setFormData({
      amount: '',
      category: 'Other',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof ExpenseFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <>
      <Button
        leftIcon={<FiPlus />}
        colorScheme="teal"
        size="lg"
        onClick={onOpen}
        position="fixed"
        bottom="2rem"
        right="2rem"
        borderRadius="full"
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.15)"
        _hover={{ boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)' }}
        zIndex={10}
      >
        Add Expense
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="lg" boxShadow="lg">
          <ModalHeader fontSize="xl" fontWeight="bold">
            💰 Quick Add Expense
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              {/* Amount Input */}
              <Box w="full">
                <Text fontWeight="600" mb="2">
                  Amount (RWF)
                </Text>
                <NumberInput
                  value={formData.amount}
                  onChange={(value) => handleInputChange('amount', value)}
                  min={0}
                >
                  <NumberInputField
                    placeholder="Enter amount"
                    borderColor={errors.amount ? 'red.500' : 'gray.300'}
                  />
                </NumberInput>
                {errors.amount && (
                  <Text color="red.500" fontSize="sm" mt="1">
                    {errors.amount}
                  </Text>
                )}
              </Box>

              {/* Category Select */}
              <Box w="full">
                <Text fontWeight="600" mb="2">
                  Category
                </Text>
                <Select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange(
                      'category',
                      e.target.value as Expense['category']
                    )
                  }
                  borderColor={errors.category ? 'red.500' : 'gray.300'}
                  focusBorderColor="teal.500"
                >
                  <option value="Food">🍔 Food & Dining</option>
                  <option value="Transport">🚗 Transport</option>
                  <option value="Utilities">⚡ Utilities</option>
                  <option value="Entertainment">🎬 Entertainment</option>
                  <option value="Health">🏥 Health</option>
                  <option value="Other">📦 Other</option>
                </Select>
                {errors.category && (
                  <Text color="red.500" fontSize="sm" mt="1">
                    {errors.category}
                  </Text>
                )}
              </Box>

              {/* Date Input */}
              <Box w="full">
                <Text fontWeight="600" mb="2">
                  Date
                </Text>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  borderColor={errors.date ? 'red.500' : 'gray.300'}
                  focusBorderColor="teal.500"
                />
                {errors.date && (
                  <Text color="red.500" fontSize="sm" mt="1">
                    {errors.date}
                  </Text>
                )}
              </Box>

              {/* Description Input */}
              <Box w="full">
                <Text fontWeight="600" mb="2">
                  Description (Optional)
                </Text>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Add notes..."
                  borderColor="gray.300"
                  focusBorderColor="teal.500"
                  rows={3}
                />
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="teal" onClick={handleSubmit}>
                Add Expense
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

// ============================================================================
// GOAL CREATION MODAL COMPONENT
// ============================================================================

interface GoalFormData {
  name: string;
  targetAmount: string;
  currentSavings: string;
  deadline: string;
  priority: SavingsGoal['priority'];
}

const GoalModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addGoal } = useFinance();
  const toast = useToast();
  
  const [formData, setFormData] = useState<GoalFormData>({
    name: '',
    targetAmount: '',
    currentSavings: '0',
    deadline: '',
    priority: 'Medium',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (!validateForm()) return;

    addGoal({
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentSavings: parseFloat(formData.currentSavings) || 0,
      deadline: formData.deadline,
      priority: formData.priority,
    });

    toast({
      title: '🎯 Goal Created',
      description: `${formData.name} goal set for ${formatRWF(parseFloat(formData.targetAmount))}!`,
      status: 'success',
      duration: 3,
      isClosable: true,
      position: 'top-right',
    });

    // Reset form
    setFormData({
      name: '',
      targetAmount: '',
      currentSavings: '0',
      deadline: '',
      priority: 'Medium',
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof GoalFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <>
      <Button
        leftIcon={<FiTarget />}
        colorScheme="purple"
        size="sm"
        onClick={onOpen}
        variant="outline"
      >
        Create Goal
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="lg" boxShadow="lg">
          <ModalHeader fontSize="xl" fontWeight="bold">
            🎯 Create Savings Goal
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              {/* Goal Name */}
              <Box w="full">
                <Text fontWeight="600" mb="2">
                  Goal Name
                </Text>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Buy Laptop"
                  borderColor={errors.name ? 'red.500' : 'gray.300'}
                  focusBorderColor="purple.500"
                />
                {errors.name && (
                  <Text color="red.500" fontSize="sm" mt="1">
                    {errors.name}
                  </Text>
                )}
              </Box>

              {/* Target Amount */}
              <Box w="full">
                <Text fontWeight="600" mb="2">
                  Target Amount (RWF)
                </Text>
                <NumberInput
                  value={formData.targetAmount}
                  onChange={(value) => handleInputChange('targetAmount', value)}
                  min={0}
                >
                  <NumberInputField
                    placeholder="Enter target amount"
                    borderColor={errors.targetAmount ? 'red.500' : 'gray.300'}
                  />
                </NumberInput>
                {errors.targetAmount && (
                  <Text color="red.500" fontSize="sm" mt="1">
                    {errors.targetAmount}
                  </Text>
                )}
              </Box>

              {/* Current Savings */}
              <Box w="full">
                <Text fontWeight="600" mb="2">
                  Current Savings (RWF)
                </Text>
                <NumberInput
                  value={formData.currentSavings}
                  onChange={(value) => handleInputChange('currentSavings', value)}
                  min={0}
                >
                  <NumberInputField
                    placeholder="Current amount saved"
                    borderColor="gray.300"
                  />
                </NumberInput>
              </Box>

              {/* Deadline */}
              <Box w="full">
                <Text fontWeight="600" mb="2">
                  Target Deadline
                </Text>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  borderColor={errors.deadline ? 'red.500' : 'gray.300'}
                  focusBorderColor="purple.500"
                />
                {errors.deadline && (
                  <Text color="red.500" fontSize="sm" mt="1">
                    {errors.deadline}
                  </Text>
                )}
              </Box>

              {/* Priority */}
              <Box w="full">
                <Text fontWeight="600" mb="2">
                  Priority Level
                </Text>
                <Select
                  value={formData.priority}
                  onChange={(e) =>
                    handleInputChange('priority', e.target.value as SavingsGoal['priority'])
                  }
                  borderColor="gray.300"
                  focusBorderColor="purple.500"
                >
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🔴 High</option>
                </Select>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="purple" onClick={handleSubmit}>
                Create Goal
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatRWF = (amount: number): string => {
  return new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getCategoryColor = (category: Expense['category']): string => {
  const colors: Record<Expense['category'], string> = {
    Food: 'orange',
    Transport: 'blue',
    Utilities: 'cyan',
    Entertainment: 'purple',
    Health: 'red',
    Other: 'gray',
  };
  return colors[category];
};

// ============================================================================
// SETTINGS DRAWER COMPONENT
// ============================================================================

const SettingsDrawer: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { monthlyIncome, setMonthlyIncome, clearAllData } = useFinance();
  const toast = useToast();

  const [incomeInput, setIncomeInput] = useState(monthlyIncome.toString());

  const handleSaveIncome = (): void => {
    const newIncome = parseFloat(incomeInput);
    if (newIncome > 0) {
      setMonthlyIncome(newIncome);
      toast({
        title: '✅ Income Updated',
        description: `Monthly income set to ${formatRWF(newIncome)}`,
        status: 'success',
        duration: 2,
        position: 'top-right',
      });
    } else {
      toast({
        title: '❌ Invalid Amount',
        description: 'Income must be greater than 0',
        status: 'error',
        duration: 2,
        position: 'top-right',
      });
    }
  };

  const handleClearData = (): void => {
    if (window.confirm('⚠️ Are you sure you want to delete all data? This cannot be undone.')) {
      clearAllData();
      toast({
        title: '🗑️ All Data Cleared',
        description: 'Your expenses and goals have been removed.',
        status: 'warning',
        duration: 2,
        position: 'top-right',
      });
    }
  };

  return (
    <>
      <IconButton
        aria-label="Settings"
        icon={<FiSettings size={20} />}
        onClick={onOpen}
        variant="ghost"
        size="lg"
        _hover={{ bg: 'gray.100' }}
      />

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontSize="xl" fontWeight="bold">
            ⚙️ Settings
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={6} align="stretch">
              {/* Income Section */}
              <Box>
                <Heading size="sm" mb="3">
                  💼 Monthly Income
                </Heading>
                <Text fontSize="sm" color="gray.600" mb="3">
                  Set your monthly budget ceiling for accurate budget tracking
                </Text>
                <HStack spacing={2}>
                  <NumberInput
                    value={incomeInput}
                    onChange={setIncomeInput}
                    min={0}
                    flex={1}
                  >
                    <NumberInputField
                      placeholder="Enter monthly income"
                      borderColor="teal.300"
                    />
                  </NumberInput>
                  <Button colorScheme="teal" onClick={handleSaveIncome}>
                    Save
                  </Button>
                </HStack>
                <Text fontSize="xs" color="gray.500" mt="2">
                  Current: {formatRWF(monthlyIncome)}
                </Text>
              </Box>

              <Divider />

              {/* Data Management */}
              <Box>
                <Heading size="sm" mb="3">
                  🗂️ Data Management
                </Heading>
                <Button
                  w="full"
                  colorScheme="red"
                  variant="outline"
                  onClick={handleClearData}
                >
                  Clear All Data
                </Button>
              </Box>

              <Divider />

              {/* About */}
              <Box>
                <Heading size="sm" mb="3">
                  ℹ️ About WealthWizard
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Your personal finance assistant powered by AI. All data is stored locally on your device using LocalStorage.
                </Text>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

// ============================================================================
// EXPENSES LIST COMPONENT
// ============================================================================

const ExpensesList: React.FC = () => {
  const { expenses, deleteExpense } = useFinance();
  const toast = useToast();

  if (expenses.length === 0) {
    return (
      <Card borderRadius="lg" boxShadow="sm">
        <CardBody py={8} textAlign="center">
          <Text color="gray.500" fontSize="lg">
            No expenses yet. Click "Add Expense" to get started! 💰
          </Text>
        </CardBody>
      </Card>
    );
  }

  return (
    <VStack spacing={3}>
      {expenses.map((expense) => (
        <Card
          key={expense.id}
          w="full"
          borderRadius="lg"
          boxShadow="sm"
          _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
          transition="all 0.2s"
        >
          <CardBody py={3} px={4}>
            <HStack justify="space-between" align="center">
              <HStack spacing={3} flex={1}>
                <Box
                  p={2}
                  borderRadius="lg"
                  bg={`${getCategoryColor(expense.category)}.100`}
                >
                  <FiDollarSign color={`var(--chakra-colors-${getCategoryColor(expense.category)}-600)`} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontWeight="600" fontSize="sm">
                    {expense.category}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {expense.description}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(expense.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </VStack>
              </HStack>

              <VStack align="end" spacing={1}>
                <Text fontWeight="bold" fontSize="md" color="teal.600">
                  {formatRWF(expense.amount)}
                </Text>
                <IconButton
                  aria-label="Delete expense"
                  icon={<FiTrash2 size={16} />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => {
                    deleteExpense(expense.id);
                    toast({
                      title: '🗑️ Deleted',
                      description: 'Expense removed successfully',
                      status: 'info',
                      duration: 2,
                      position: 'top-right',
                    });
                  }}
                />
              </VStack>
            </HStack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
};

// ============================================================================
// GOALS LIST COMPONENT
// ============================================================================

const GoalsList: React.FC = () => {
  const { savingsGoals, deleteGoal } = useFinance();
  const toast = useToast();

  if (savingsGoals.length === 0) {
    return (
      <Card borderRadius="lg" boxShadow="sm">
        <CardBody py={8} textAlign="center">
          <Text color="gray.500" fontSize="lg">
            No savings goals yet. Create one to start saving! 🎯
          </Text>
        </CardBody>
      </Card>
    );
  }

  return (
    <VStack spacing={3}>
      {savingsGoals.map((goal) => {
        const progress = (goal.currentSavings / goal.targetAmount) * 100;
        const isComplete = progress >= 100;

        return (
          <Card
            key={goal.id}
            w="full"
            borderRadius="lg"
            boxShadow="sm"
            borderLeft="4px"
            borderColor={isComplete ? 'green.500' : 'blue.500'}
            _hover={{ boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <CardBody py={4} px={4}>
              <VStack align="start" spacing={3} w="full">
                {/* Header */}
                <HStack justify="space-between" w="full">
                  <HStack spacing={2}>
                    <Heading size="sm">{goal.name}</Heading>
                    {isComplete && (
                      <Badge colorScheme="green" borderRadius="full">
                        ✓ Completed
                      </Badge>
                    )}
                    <Badge
                      colorScheme={
                        goal.priority === 'High'
                          ? 'red'
                          : goal.priority === 'Medium'
                          ? 'yellow'
                          : 'blue'
                      }
                      variant="outline"
                    >
                      {goal.priority}
                    </Badge>
                  </HStack>
                  <IconButton
                    aria-label="Delete goal"
                    icon={<FiTrash2 size={16} />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => {
                      deleteGoal(goal.id);
                      toast({
                        title: '🗑️ Goal Deleted',
                        description: 'Savings goal removed',
                        status: 'info',
                        duration: 2,
                        position: 'top-right',
                      });
                    }}
                  />
                </HStack>

                {/* Progress Bar */}
                <Box w="full">
                  <HStack justify="space-between" mb="2">
                    <Text fontSize="sm" fontWeight="500">
                      {formatRWF(goal.currentSavings)} / {formatRWF(goal.targetAmount)}
                    </Text>
                    <Text fontSize="sm" fontWeight="600" color={isComplete ? 'green.600' : 'blue.600'}>
                      {Math.round(progress)}%
                    </Text>
                  </HStack>
                  <Progress
                    value={Math.min(progress, 100)}
                    borderRadius="full"
                    size="md"
                    colorScheme={isComplete ? 'green' : 'blue'}
                    hasStripe
                    isAnimated
                  />
                </Box>

                {/* Deadline */}
                <HStack spacing={2} fontSize="xs" color="gray.600">
                  <FiCalendar size={14} />
                  <Text>
                    Deadline: {new Date(goal.deadline).toLocaleDateString('en-US')}
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        );
      })}
    </VStack>
  );
};

// ============================================================================
// AI ADVISOR DRAWER COMPONENT
// ============================================================================

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const AIAdvisorDrawer: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { totalSpent, monthlyIncome, remainingBudget, goalProgress, expenses, savingsGoals } =
    useFinance();

  const budgetStatus = remainingBudget < 0 ? 'danger' : remainingBudget < monthlyIncome * 0.2 ? 'warning' : 'safe';
  const completedGoals = savingsGoals.filter((g) => (g.currentSavings / g.targetAmount) * 100 >= 100).length;

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "👋 Hi! I'm your AI Financial Advisor. Ask me anything about budgeting, saving, investing in RWF, or analyzing your current expenses!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const getAIAdvice = (): { title: string; message: string; emoji: string } => {
    if (budgetStatus === 'danger') {
      return {
        title: '⚠️ Budget Alert',
        emoji: '🚨',
        message: `You've exceeded your monthly budget by ${formatRWF(Math.abs(remainingBudget))}! Consider reducing expenses in high-spending categories.`,
      };
    }

    if (budgetStatus === 'warning') {
      return {
        title: '⏰ Budget Warning',
        emoji: '⚠️',
        message: `You're using 80% of your budget. Be cautious with remaining expenses to avoid overspending.`,
      };
    }

    if (goalProgress >= 100) {
      return {
        title: '🎉 Goals Achieved!',
        emoji: '✨',
        message: `Congratulations! You've completed all your savings goals. Set new ones to continue building wealth!`,
      };
    }

    if (goalProgress >= 75) {
      return {
        title: '🚀 Almost There',
        emoji: '💪',
        message: `You're ${Math.round(100 - goalProgress)}% away from completing your savings goals. Keep it up!`,
      };
    }

    if (expenses.length === 0) {
      return {
        title: '👋 Welcome to WealthWizard',
        emoji: '💡',
        message: `Start by adding your first expense. Understanding your spending patterns is the first step to financial mastery.`,
      };
    }

    return {
      title: "💰 You're On Track",
      emoji: '✅',
      message: `Great job! You have ${formatRWF(remainingBudget)} remaining in your budget. Keep monitoring your expenses!`,
    };
  };

  const advice = getAIAdvice();

  const generateAIResponse = (userQuery: string): string => {
    const query = userQuery.toLowerCase().trim();

    let topCategoryName = 'None';
    let topCategoryAmount = 0;
    if (expenses.length > 0) {
      const categoryTotals: Record<string, number> = {};
      expenses.forEach((exp) => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      });
      const top = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      if (top) {
        topCategoryName = top[0];
        topCategoryAmount = top[1];
      }
    }

    if (
      query.includes('my budget') ||
      query.includes('my spending') ||
      query.includes('analyze my') ||
      query.includes('current balance') ||
      query.includes('how am i doing') ||
      query.includes('summary') ||
      query.includes('my finances')
    ) {
      if (monthlyIncome === 0) {
        return `💡 Your monthly income is currently set to 0 RWF. Go to Settings ⚙️ to set your monthly income ceiling!\n\nCurrently, you have recorded ${expenses.length} expense(s) totaling ${formatRWF(totalSpent)}.`;
      }
      let statusText =
        remainingBudget < 0
          ? `⚠️ You are currently over budget by ${formatRWF(Math.abs(remainingBudget))}.`
          : `✅ You have ${formatRWF(remainingBudget)} remaining out of your ${formatRWF(monthlyIncome)} monthly income.`;
      let insightText =
        topCategoryAmount > 0
          ? `\n\nYour highest expense category is **${topCategoryName}** (${formatRWF(topCategoryAmount)}).`
          : '';
      return `📊 **Your Financial Breakdown:**\n\n• Monthly Income: ${formatRWF(monthlyIncome)}\n• Total Spent: ${formatRWF(totalSpent)}\n• Remaining Budget: ${formatRWF(remainingBudget)}\n\n${statusText}${insightText}`;
    }

    if (query.includes('50/30/20') || query.includes('rule') || query.includes('how to budget') || query.includes('budgeting method')) {
      const needs = monthlyIncome * 0.5;
      const wants = monthlyIncome * 0.3;
      const savings = monthlyIncome * 0.2;
      return `⚖️ **The 50/30/20 Budget Rule:**\n\n• **50% Needs**: Housing, utilities, food, transport.\n• **30% Wants**: Entertainment, dining out, hobbies.\n• **20% Savings & Debt**: Building savings, emergency fund, investments.\n\n` +
        (monthlyIncome > 0
          ? `Based on your monthly income of **${formatRWF(monthlyIncome)}**, your target breakdown is:\n- Needs: ${formatRWF(needs)}\n- Wants: ${formatRWF(wants)}\n- Savings: ${formatRWF(savings)}`
          : `Set your monthly income in Settings to calculate your 50/30/20 target breakdown!`);
    }

    if (query.includes('emergency') || query.includes('safety net') || query.includes('rainy day')) {
      const target3Months = monthlyIncome * 3;
      const target6Months = monthlyIncome * 6;
      return `🛡️ **Emergency Fund Strategy:**\n\nAn emergency fund protects you against unforeseen expenses or job loss. Financial experts recommend keeping 3 to 6 months of living expenses in an accessible savings account.\n\n` +
        (monthlyIncome > 0
          ? `For your monthly income of **${formatRWF(monthlyIncome)}**:\n- 3-Month Fund Target: **${formatRWF(target3Months)}**\n- 6-Month Fund Target: **${formatRWF(target6Months)}**\n\nTip: Start small by automatically setting aside 10% of income each month into a separate account!`
          : `Tip: Aim to save 3-6 months of expenses before starting aggressive long-term investments.`);
    }

    if (query.includes('invest') || query.includes('rwanda') || query.includes('rwf') || query.includes('stocks') || query.includes('rnit') || query.includes('treasury')) {
      return `📈 **Top Investment Options in Rwanda (RWF):**\n\n` +
        `1. **RNIT Iterambere Fund**: Open-ended unit trust managed by Rwanda National Investment Trust. High liquidity, low risk, and yields competitive returns.\n` +
        `2. **Government Treasury Bonds & Bills**: Issued by National Bank of Rwanda (BNR). Very safe with fixed interest payouts.\n` +
        `3. **Rwanda Stock Exchange (RSE)**: Buy shares in top listed companies (e.g. BK Group, Bralirwa, I&M Bank) for dividends and capital growth.\n` +
        `4. **Fixed Term Deposit Accounts**: Offered by local commercial banks & MFIs with guaranteed interest rates.\n` +
        `5. **Real Estate & Land**: Solid long-term value preservation asset.`;
    }

    if (query.includes('reduce') || query.includes('cut') || query.includes('save money') || query.includes('less money') || query.includes('stop spending')) {
      let topInsight = '';
      if (topCategoryAmount > 0) {
        topInsight = `\n\n💡 Your biggest spend right now is on **${topCategoryName}** (${formatRWF(topCategoryAmount)}). Focusing on reducing this category by 15-20% will free up significant cash flow!`;
      }
      return `💡 **Tips to Reduce Expenses:**\n\n` +
        `1. **24-Hour Rule**: Wait 24 hours before making impulse purchases.\n` +
        `2. **Audit Subscriptions**: Cancel recurring services you don't actively use.\n` +
        `3. **Meal Planning**: Cook at home to reduce dining & food delivery expenses.\n` +
        `4. **Track Daily Micro-Expenses**: Small daily expenses add up quickly!${topInsight}`;
    }

    if (query.includes('goal') || query.includes('save faster') || query.includes('saving')) {
      const completedCount = savingsGoals.filter((g) => (g.currentSavings / g.targetAmount) * 100 >= 100).length;
      return `🎯 **Savings Goal Strategy:**\n\n` +
        `• Currently, you have completed **${completedCount} of ${savingsGoals.length}** goals (${Math.round(goalProgress)}% overall progress).\n\n` +
        `**How to Save Faster:**\n` +
        `1. **Pay Yourself First**: Automate goal contributions right on payday.\n` +
        `2. **Name Your Goals**: Giving specific names (e.g. "Laptop Fund", "Emergency Fund") increases motivation.\n` +
        `3. **Use Milestone Badges**: Celebrate small milestones (25%, 50%, 75%) along the way!`;
    }

    if (query.includes('debt') || query.includes('loan') || query.includes('borrow') || query.includes('credit')) {
      return `💳 **Debt Payoff Strategies:**\n\n` +
        `1. **Debt Avalanche Method**: Pay off loans with the highest interest rates first. Saves the most money on interest.\n` +
        `2. **Debt Snowball Method**: Pay off the smallest balance loans first. Provides quick psychological wins.\n` +
        `3. **Avoid High-Interest Consumer Debt**: Never use short-term high-interest loans for non-essential purchases.`;
    }

    return `🤖 **AI Financial Advice:**\n\nRegarding "${userQuery}":\n\n` +
      `Here is key guidance:\n` +
      `• Always maintain a balanced budget where Income > Expenses.\n` +
      `• Aim to save at least 20% of your earnings every month.\n` +
      `• Keep 3-6 months of expenses in an Emergency Fund.\n` +
      `• Consider investing in RNIT Iterambere Fund or Treasury Bonds for compound growth in RWF.\n\n` +
      `*Your Current Status*: Remaining Budget: **${formatRWF(remainingBudget)}** | Spent: **${formatRWF(totalSpent)}**`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponseText = generateAIResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 500);
  };

  const suggestedQuestions = [
    '💡 How to save 20% of my income?',
    '📊 Analyze my current budget',
    '🛡️ How to build an emergency fund?',
    '📈 Investing options in RWF',
    '⚖️ Explain the 50/30/20 rule',
  ];

  return (
    <>
      <Button
        leftIcon={<FiTrendingUp />}
        colorScheme="blue"
        variant="outline"
        size="sm"
        onClick={onOpen}
      >
        AI Advisor
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontSize="xl" fontWeight="bold">
            🤖 AI Financial Advisor & Chat
          </DrawerHeader>

          <DrawerBody p={4}>
            <Tabs variant="soft-rounded" colorScheme="blue" isFitted>
              <TabList mb="4">
                <Tab fontSize="sm" fontWeight="bold">
                  💬 Ask AI Assistant
                </Tab>
                <Tab fontSize="sm" fontWeight="bold">
                  📊 Insights & Overview
                </Tab>
              </TabList>

              <TabPanels>
                {/* TAB 1: INTERACTIVE AI CHAT */}
                <TabPanel p={0}>
                  <VStack spacing={4} align="stretch" h="calc(100vh - 170px)">
                    {/* Suggested Questions Pills */}
                    <Box bg="blue.50" p={3} borderRadius="lg">
                      <Text fontSize="xs" fontWeight="bold" color="blue.700" mb={2}>
                        💡 Quick Questions:
                      </Text>
                      <Flex wrap="wrap" gap={2}>
                        {suggestedQuestions.map((q, idx) => (
                          <Button
                            key={idx}
                            size="xs"
                            colorScheme="blue"
                            variant="subtle"
                            bg="white"
                            color="blue.700"
                            border="1px solid"
                            borderColor="blue.200"
                            onClick={() => handleSendMessage(q)}
                            _hover={{ bg: 'blue.100' }}
                          >
                            {q}
                          </Button>
                        ))}
                      </Flex>
                    </Box>

                    {/* Messages Container */}
                    <Box
                      flex="1"
                      overflowY="auto"
                      p={3}
                      bg="gray.50"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <VStack spacing={3} align="stretch">
                        {messages.map((msg) => (
                          <Flex
                            key={msg.id}
                            justify={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                          >
                            <HStack
                              align="flex-start"
                              spacing={2}
                              maxW="85%"
                              flexDirection={msg.sender === 'user' ? 'row-reverse' : 'row'}
                            >
                              <Avatar
                                size="xs"
                                name={msg.sender === 'user' ? 'User' : 'AI'}
                                bg={msg.sender === 'user' ? 'teal.500' : 'blue.600'}
                                icon={msg.sender === 'user' ? undefined : <FiTrendingUp />}
                              />
                              <Box
                                bg={msg.sender === 'user' ? 'teal.500' : 'white'}
                                color={msg.sender === 'user' ? 'white' : 'gray.800'}
                                p={3}
                                borderRadius="lg"
                                boxShadow="sm"
                                border={msg.sender === 'user' ? 'none' : '1px solid'}
                                borderColor="gray.200"
                              >
                                <Text
                                  fontSize="sm"
                                  whiteSpace="pre-wrap"
                                  lineHeight="relaxed"
                                >
                                  {msg.text}
                                </Text>
                                <Text
                                  fontSize="xs"
                                  color={msg.sender === 'user' ? 'teal.100' : 'gray.400'}
                                  mt={1}
                                  textAlign="right"
                                >
                                  {msg.timestamp}
                                </Text>
                              </Box>
                            </HStack>
                          </Flex>
                        ))}

                        {isLoading && (
                          <Flex justify="flex-start">
                            <HStack spacing={2} bg="white" p={3} borderRadius="lg" boxShadow="sm">
                              <Spinner size="xs" color="blue.500" />
                              <Text fontSize="xs" color="gray.500">
                                AI is analyzing finances and generating response...
                              </Text>
                            </HStack>
                          </Flex>
                        )}
                        <div ref={messagesEndRef} />
                      </VStack>
                    </Box>

                    {/* Chat Input */}
                    <Box pt={2}>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendMessage();
                        }}
                      >
                        <InputGroup size="md">
                          <Input
                            placeholder="Ask any question about finance or budget..."
                            value={inputQuery}
                            onChange={(e) => setInputQuery(e.target.value)}
                            focusBorderColor="blue.500"
                            bg="white"
                            borderRadius="lg"
                            pr="4.5rem"
                          />
                          <InputRightElement width="4.5rem">
                            <Button
                              h="1.75rem"
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleSendMessage()}
                              isLoading={isLoading}
                            >
                              <FiSend />
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </form>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* TAB 2: FINANCIAL OVERVIEW & INSIGHTS */}
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch" pt={2}>
                    {/* Main Advice Alert */}
                    <Alert
                      status={
                        budgetStatus === 'danger'
                          ? 'error'
                          : budgetStatus === 'warning'
                          ? 'warning'
                          : 'success'
                      }
                      borderRadius="lg"
                      flexDirection="column"
                      alignItems="flex-start"
                      p={4}
                    >
                      <Flex align="center" mb={2}>
                        <AlertIcon mr={2} />
                        <AlertTitle fontSize="md" fontWeight="bold">
                          {advice.title}
                        </AlertTitle>
                      </Flex>
                      <AlertDescription fontSize="sm" ml={6}>
                        {advice.message}
                      </AlertDescription>
                    </Alert>

                    <Divider />

                    {/* Financial Summary */}
                    <Box>
                      <Heading size="sm" mb="4">
                        📊 Financial Summary
                      </Heading>
                      <SimpleGrid columns={2} spacing={3}>
                        <Box p={3} bg="gray.50" borderRadius="lg">
                          <Text fontSize="xs" color="gray.600" mb="1">
                            Total Spent
                          </Text>
                          <Text fontSize="lg" fontWeight="bold" color="orange.600">
                            {formatRWF(totalSpent)}
                          </Text>
                        </Box>
                        <Box p={3} bg="gray.50" borderRadius="lg">
                          <Text fontSize="xs" color="gray.600" mb="1">
                            Remaining
                          </Text>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color={remainingBudget < 0 ? 'red.600' : 'green.600'}
                          >
                            {formatRWF(remainingBudget)}
                          </Text>
                        </Box>
                        <Box p={3} bg="gray.50" borderRadius="lg">
                          <Text fontSize="xs" color="gray.600" mb="1">
                            Goals Progress
                          </Text>
                          <Text fontSize="lg" fontWeight="bold" color="purple.600">
                            {Math.round(goalProgress)}%
                          </Text>
                        </Box>
                        <Box p={3} bg="gray.50" borderRadius="lg">
                          <Text fontSize="xs" color="gray.600" mb="1">
                            Goals Completed
                          </Text>
                          <Text fontSize="lg" fontWeight="bold" color="blue.600">
                            {completedGoals}/{savingsGoals.length}
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </Box>

                    <Divider />

                    {/* Top Spending Category */}
                    {expenses.length > 0 && (
                      <Box>
                        <Heading size="sm" mb="3">
                          📈 Spending Insights
                        </Heading>
                        {(() => {
                          const categoryTotals: Record<string, number> = {};
                          expenses.forEach((exp) => {
                            categoryTotals[exp.category] =
                              (categoryTotals[exp.category] || 0) + exp.amount;
                          });
                          const topCategory = Object.entries(categoryTotals).sort(
                            (a, b) => b[1] - a[1]
                          )[0];
                          return (
                            <Text fontSize="sm" color="gray.700">
                              Your top spending category is <strong>{topCategory[0]}</strong> with{' '}
                              <strong>{formatRWF(topCategory[1])}</strong>.
                            </Text>
                          );
                        })()}
                      </Box>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

interface DashboardProps {
  onLogout?: () => void;
  userEmail?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, userEmail }) => {
  const { totalSpent, monthlyIncome, remainingBudget, expenses, savingsGoals } =
    useFinance();

  const budgetStatus = remainingBudget < 0 ? 'danger' : remainingBudget < monthlyIncome * 0.2 ? 'warning' : 'safe';

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" py={8}>
      <Container maxW="4xl">
        {/* Header */}
        <HStack justify="space-between" mb={8} align="center">
          <HStack spacing={3} align="center">
            <Image
              src={process.env.PUBLIC_URL + '/logo.svg'}
              alt="WealthWizard Logo"
              boxSize="52px"
              borderRadius="xl"
              boxShadow="0 4px 12px rgba(0,0,0,0.25)"
            />
            <VStack align="start" spacing={0}>
              <Heading size="xl" color="white" fontWeight="extrabold" letterSpacing="tight">
                WealthWizard
              </Heading>
              <Text color="whiteAlpha.800" fontSize="sm">Your Personal AI Finance Assistant</Text>
            </VStack>
          </HStack>
          <HStack spacing={2}>
            {userEmail && (
              <Text color="whiteAlpha.700" fontSize="xs" display={{ base: 'none', md: 'block' }}>
                {userEmail}
              </Text>
            )}
            {onLogout && (
              <Button size="sm" onClick={onLogout} colorScheme="whiteAlpha" variant="outline">
                Logout
              </Button>
            )}
            <SettingsDrawer />
          </HStack>
        </HStack>

        {/* Key Metrics Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={8}>
          {/* Monthly Income */}
          <Card
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
            overflow="hidden"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <CardBody p={6}>
              <VStack align="start" spacing={3}>
                <HStack justify="space-between" w="full">
                  <Heading size="sm" color="gray.700">
                    💼 Monthly Income
                  </Heading>
                  <Box p={2} bg="blue.100" borderRadius="full">
                    <FiDollarSign color="var(--chakra-colors-blue-600)" size={20} />
                  </Box>
                </HStack>
                <Heading size="xl" color="blue.600">
                  {formatRWF(monthlyIncome)}
                </Heading>
              </VStack>
            </CardBody>
          </Card>

          {/* Total Spent */}
          <Card
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
            overflow="hidden"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <CardBody p={6}>
              <VStack align="start" spacing={3}>
                <HStack justify="space-between" w="full">
                  <Heading size="sm" color="gray.700">
                    📊 Total Spent
                  </Heading>
                  <Box
                    p={2}
                    bg={budgetStatus === 'danger' ? 'red.100' : 'orange.100'}
                    borderRadius="full"
                  >
                    <FiTrendingUp
                      color={
                        budgetStatus === 'danger'
                          ? 'var(--chakra-colors-red-600)'
                          : 'var(--chakra-colors-orange-600)'
                      }
                      size={20}
                    />
                  </Box>
                </HStack>
                <Heading size="xl" color={budgetStatus === 'danger' ? 'red.600' : 'orange.600'}>
                  {formatRWF(totalSpent)}
                </Heading>
              </VStack>
            </CardBody>
          </Card>

          {/* Remaining Budget */}
          <Card
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
            overflow="hidden"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <CardBody p={6}>
              <VStack align="start" spacing={3}>
                <HStack justify="space-between" w="full">
                  <Heading size="sm" color="gray.700">
                    💰 Remaining
                  </Heading>
                  <Box
                    p={2}
                    bg={remainingBudget < 0 ? 'red.100' : 'green.100'}
                    borderRadius="full"
                  >
                    <FiAlertTriangle
                      color={
                        remainingBudget < 0
                          ? 'var(--chakra-colors-red-600)'
                          : 'var(--chakra-colors-green-600)'
                      }
                      size={20}
                    />
                  </Box>
                </HStack>
                <Heading
                  size="xl"
                  color={remainingBudget < 0 ? 'red.600' : 'green.600'}
                >
                  {formatRWF(remainingBudget)}
                </Heading>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Budget Progress */}
        <Card borderRadius="lg" boxShadow="lg" bg="white" mb={8}>
          <CardBody p={6}>
            <VStack align="start" spacing={4}>
              <HStack justify="space-between" w="full">
                <Heading size="md">📈 Budget Progress</Heading>
                <Text fontWeight="bold" color="gray.600">
                  {Math.round((totalSpent / monthlyIncome) * 100)}%
                </Text>
              </HStack>
              <Progress
                value={(totalSpent / monthlyIncome) * 100}
                size="lg"
                colorScheme={budgetStatus === 'danger' ? 'red' : budgetStatus === 'warning' ? 'yellow' : 'green'}
                borderRadius="full"
                hasStripe
                isAnimated
              />
              <Text fontSize="sm" color="gray.600">
                {totalSpent <= monthlyIncome
                  ? `You have ${formatRWF(remainingBudget)} left to spend this month.`
                  : `You've exceeded your budget by ${formatRWF(Math.abs(remainingBudget))}.`}
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Tabs for Expenses and Goals */}
        <Card borderRadius="lg" boxShadow="lg" bg="white">
          <CardBody p={0}>
            <Tabs defaultIndex={0} variant="soft-rounded">
              <TabList p={4} borderBottom="1px solid" borderColor="gray.200">
                <Tab fontWeight="600" mr={2}>
                  💳 Expenses ({expenses.length})
                </Tab>
                <Tab fontWeight="600">
                  🎯 Goals ({savingsGoals.length})
                </Tab>
                <Spacer />
                <HStack spacing={2}>
                  <ExpenseModal />
                  <GoalModal />
                  <AIAdvisorDrawer />
                </HStack>
              </TabList>

              <TabPanels p={6}>
                {/* Expenses Panel */}
                <TabPanel>
                  <ExpensesList />
                </TabPanel>

                {/* Goals Panel */}
                <TabPanel>
                  <GoalsList />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </Container>

      {/* Floating Action Button */}
      <ExpenseModal />
    </Box>
  );
};

export default Dashboard;
