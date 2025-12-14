// Expense categories with icons and colors
export const EXPENSE_CATEGORIES = [
  { id: 'housing', name: 'Housing', color: '#14b8a6', icon: 'Home' },
  { id: 'utilities', name: 'Utilities', color: '#f59e0b', icon: 'Zap' },
  { id: 'food', name: 'Food & Groceries', color: '#10b981', icon: 'UtensilsCrossed' },
  { id: 'transport', name: 'Transportation', color: '#3b82f6', icon: 'Car' },
  { id: 'insurance', name: 'Insurance', color: '#8b5cf6', icon: 'Shield' },
  { id: 'healthcare', name: 'Healthcare', color: '#ec4899', icon: 'Heart' },
  { id: 'entertainment', name: 'Entertainment', color: '#f97316', icon: 'Tv' },
  { id: 'shopping', name: 'Shopping', color: '#06b6d4', icon: 'ShoppingBag' },
  { id: 'personal', name: 'Personal Care', color: '#d946ef', icon: 'Sparkles' },
  { id: 'education', name: 'Education', color: '#6366f1', icon: 'GraduationCap' },
  { id: 'subscriptions', name: 'Subscriptions', color: '#84cc16', icon: 'CreditCard' },
  { id: 'other', name: 'Other', color: '#64748b', icon: 'MoreHorizontal' },
];

// Income types
export const INCOME_TYPES = [
  { id: 'salary', name: 'Salary', icon: 'Briefcase' },
  { id: 'freelance', name: 'Freelance', icon: 'Laptop' },
  { id: 'investments', name: 'Investments', icon: 'TrendingUp' },
  { id: 'rental', name: 'Rental Income', icon: 'Building' },
  { id: 'business', name: 'Business', icon: 'Store' },
  { id: 'other', name: 'Other', icon: 'DollarSign' },
];

// Debt types
export const DEBT_TYPES = [
  { id: 'credit_card', name: 'Credit Card', icon: 'CreditCard', avgRate: 19.99 },
  { id: 'personal_loan', name: 'Personal Loan', icon: 'Wallet', avgRate: 10.5 },
  { id: 'student_loan', name: 'Student Loan', icon: 'GraduationCap', avgRate: 5.8 },
  { id: 'auto_loan', name: 'Auto Loan', icon: 'Car', avgRate: 6.5 },
  { id: 'mortgage', name: 'Mortgage', icon: 'Home', avgRate: 7.0 },
  { id: 'medical', name: 'Medical Debt', icon: 'Heart', avgRate: 0 },
  { id: 'other', name: 'Other', icon: 'FileText', avgRate: 8.0 },
];

// Goal types
export const GOAL_TYPES = [
  { id: 'emergency', name: 'Emergency Fund', icon: 'Shield', color: '#14b8a6' },
  { id: 'debt_free', name: 'Debt Free', icon: 'CheckCircle', color: '#10b981' },
  { id: 'vacation', name: 'Vacation', icon: 'Plane', color: '#3b82f6' },
  { id: 'house', name: 'House Down Payment', icon: 'Home', color: '#8b5cf6' },
  { id: 'car', name: 'New Car', icon: 'Car', color: '#f59e0b' },
  { id: 'retirement', name: 'Retirement', icon: 'Sunset', color: '#ec4899' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: '#6366f1' },
  { id: 'investment', name: 'Investment', icon: 'TrendingUp', color: '#06b6d4' },
  { id: 'other', name: 'Other', icon: 'Target', color: '#64748b' },
];

// Chart colors
export const CHART_COLORS = [
  '#14b8a6', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6',
  '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#f59e0b',
  '#84cc16', '#22c55e', '#64748b'
];

// Default empty scenario
export const createEmptyScenario = (name) => ({
  name,
  income: [],
  expenses: [],
  debts: [],
  goals: [],
});

// Default data with sample entries
export const DEFAULT_DATA = {
  scenarios: {
    current: {
      name: 'Current Reality',
      income: [
        { id: 'inc-1', name: 'Primary Salary', type: 'salary', amount: 5000 },
      ],
      expenses: [
        { id: 'exp-1', name: 'Rent/Mortgage', category: 'housing', amount: 1500, isFixed: true },
        { id: 'exp-2', name: 'Groceries', category: 'food', amount: 400, isFixed: false },
        { id: 'exp-3', name: 'Utilities', category: 'utilities', amount: 150, isFixed: true },
        { id: 'exp-4', name: 'Car Payment', category: 'transport', amount: 350, isFixed: true },
        { id: 'exp-5', name: 'Gas', category: 'transport', amount: 120, isFixed: false },
        { id: 'exp-6', name: 'Insurance', category: 'insurance', amount: 200, isFixed: true },
        { id: 'exp-7', name: 'Entertainment', category: 'entertainment', amount: 150, isFixed: false },
        { id: 'exp-8', name: 'Subscriptions', category: 'subscriptions', amount: 50, isFixed: true },
      ],
      debts: [
        { id: 'debt-1', name: 'Credit Card', type: 'credit_card', balance: 5000, interestRate: 19.99, minimumPayment: 150, extraPayment: 0, order: 0 },
        { id: 'debt-2', name: 'Student Loan', type: 'student_loan', balance: 25000, interestRate: 5.8, minimumPayment: 280, extraPayment: 0, order: 1 },
      ],
      goals: [
        { id: 'goal-1', name: 'Emergency Fund', type: 'emergency', targetAmount: 15000, currentAmount: 3000, monthlyContribution: 200, order: 0 },
        { id: 'goal-2', name: 'Vacation Fund', type: 'vacation', targetAmount: 5000, currentAmount: 500, monthlyContribution: 100, order: 1 },
      ],
    },
    plan: {
      name: 'Plan Budget',
      income: [
        { id: 'inc-1', name: 'Primary Salary', type: 'salary', amount: 5000 },
      ],
      expenses: [
        { id: 'exp-1', name: 'Rent/Mortgage', category: 'housing', amount: 1500, isFixed: true },
        { id: 'exp-2', name: 'Groceries', category: 'food', amount: 350, isFixed: false },
        { id: 'exp-3', name: 'Utilities', category: 'utilities', amount: 150, isFixed: true },
        { id: 'exp-4', name: 'Car Payment', category: 'transport', amount: 350, isFixed: true },
        { id: 'exp-5', name: 'Gas', category: 'transport', amount: 100, isFixed: false },
        { id: 'exp-6', name: 'Insurance', category: 'insurance', amount: 200, isFixed: true },
        { id: 'exp-7', name: 'Entertainment', category: 'entertainment', amount: 100, isFixed: false },
        { id: 'exp-8', name: 'Subscriptions', category: 'subscriptions', amount: 30, isFixed: true },
      ],
      debts: [
        { id: 'debt-1', name: 'Credit Card', type: 'credit_card', balance: 5000, interestRate: 19.99, minimumPayment: 150, extraPayment: 100, order: 0 },
        { id: 'debt-2', name: 'Student Loan', type: 'student_loan', balance: 25000, interestRate: 5.8, minimumPayment: 280, extraPayment: 0, order: 1 },
      ],
      goals: [
        { id: 'goal-1', name: 'Emergency Fund', type: 'emergency', targetAmount: 15000, currentAmount: 3000, monthlyContribution: 400, order: 0 },
        { id: 'goal-2', name: 'Vacation Fund', type: 'vacation', targetAmount: 5000, currentAmount: 500, monthlyContribution: 150, order: 1 },
      ],
    },
  },
  version: 1,
  theme: 'dark',
};

