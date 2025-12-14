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

// Default template scenario with $0 values - ready to fill in
const createTemplateScenario = (name) => ({
  name,
  income: [
    { id: 'inc-1', name: 'Primary Salary', type: 'salary', amount: 0 },
    { id: 'inc-2', name: 'Side Income', type: 'freelance', amount: 0 },
    { id: 'inc-3', name: 'Investment Returns', type: 'investments', amount: 0 },
  ],
  expenses: [
    // Housing
    { id: 'exp-1', name: 'Rent/Mortgage', category: 'housing', amount: 0, isFixed: true },
    { id: 'exp-2', name: 'Property Tax', category: 'housing', amount: 0, isFixed: true },
    { id: 'exp-3', name: 'HOA Fees', category: 'housing', amount: 0, isFixed: true },
    // Utilities
    { id: 'exp-4', name: 'Electric', category: 'utilities', amount: 0, isFixed: false },
    { id: 'exp-5', name: 'Gas/Heating', category: 'utilities', amount: 0, isFixed: false },
    { id: 'exp-6', name: 'Water/Sewer', category: 'utilities', amount: 0, isFixed: false },
    { id: 'exp-7', name: 'Internet', category: 'utilities', amount: 0, isFixed: true },
    { id: 'exp-8', name: 'Phone', category: 'utilities', amount: 0, isFixed: true },
    // Food
    { id: 'exp-9', name: 'Groceries', category: 'food', amount: 0, isFixed: false },
    { id: 'exp-10', name: 'Dining Out', category: 'food', amount: 0, isFixed: false },
    // Transportation
    { id: 'exp-11', name: 'Car Payment', category: 'transport', amount: 0, isFixed: true },
    { id: 'exp-12', name: 'Gas/Fuel', category: 'transport', amount: 0, isFixed: false },
    { id: 'exp-13', name: 'Car Insurance', category: 'transport', amount: 0, isFixed: true },
    { id: 'exp-14', name: 'Maintenance/Repairs', category: 'transport', amount: 0, isFixed: false },
    { id: 'exp-15', name: 'Public Transit', category: 'transport', amount: 0, isFixed: false },
    // Insurance
    { id: 'exp-16', name: 'Health Insurance', category: 'insurance', amount: 0, isFixed: true },
    { id: 'exp-17', name: 'Life Insurance', category: 'insurance', amount: 0, isFixed: true },
    { id: 'exp-18', name: 'Renters/Home Insurance', category: 'insurance', amount: 0, isFixed: true },
    // Healthcare
    { id: 'exp-19', name: 'Medical/Doctor', category: 'healthcare', amount: 0, isFixed: false },
    { id: 'exp-20', name: 'Prescriptions', category: 'healthcare', amount: 0, isFixed: false },
    { id: 'exp-21', name: 'Dental', category: 'healthcare', amount: 0, isFixed: false },
    // Personal
    { id: 'exp-22', name: 'Clothing', category: 'shopping', amount: 0, isFixed: false },
    { id: 'exp-23', name: 'Personal Care', category: 'personal', amount: 0, isFixed: false },
    { id: 'exp-24', name: 'Gym/Fitness', category: 'personal', amount: 0, isFixed: true },
    // Entertainment
    { id: 'exp-25', name: 'Entertainment', category: 'entertainment', amount: 0, isFixed: false },
    { id: 'exp-26', name: 'Streaming Services', category: 'subscriptions', amount: 0, isFixed: true },
    { id: 'exp-27', name: 'Subscriptions', category: 'subscriptions', amount: 0, isFixed: true },
    // Other
    { id: 'exp-28', name: 'Pet Expenses', category: 'other', amount: 0, isFixed: false },
    { id: 'exp-29', name: 'Childcare', category: 'other', amount: 0, isFixed: true },
    { id: 'exp-30', name: 'Miscellaneous', category: 'other', amount: 0, isFixed: false },
  ],
  debts: [
    { id: 'debt-1', name: 'Credit Card 1', type: 'credit_card', balance: 0, interestRate: 19.99, minimumPayment: 0, extraPayment: 0, order: 0 },
    { id: 'debt-2', name: 'Credit Card 2', type: 'credit_card', balance: 0, interestRate: 22.99, minimumPayment: 0, extraPayment: 0, order: 1 },
    { id: 'debt-3', name: 'Student Loan', type: 'student_loan', balance: 0, interestRate: 5.8, minimumPayment: 0, extraPayment: 0, order: 2 },
    { id: 'debt-4', name: 'Auto Loan', type: 'auto_loan', balance: 0, interestRate: 6.5, minimumPayment: 0, extraPayment: 0, order: 3 },
    { id: 'debt-5', name: 'Personal Loan', type: 'personal_loan', balance: 0, interestRate: 10.0, minimumPayment: 0, extraPayment: 0, order: 4 },
  ],
  goals: [
    { id: 'goal-1', name: 'Emergency Fund (3 months)', type: 'emergency', targetAmount: 0, currentAmount: 0, monthlyContribution: 0, order: 0 },
    { id: 'goal-2', name: 'Debt Payoff', type: 'debt_free', targetAmount: 0, currentAmount: 0, monthlyContribution: 0, order: 1 },
    { id: 'goal-3', name: 'Vacation', type: 'vacation', targetAmount: 0, currentAmount: 0, monthlyContribution: 0, order: 2 },
    { id: 'goal-4', name: 'Retirement', type: 'retirement', targetAmount: 0, currentAmount: 0, monthlyContribution: 0, order: 3 },
  ],
});

// Default empty scenario (for fallback)
export const createEmptyScenario = (name) => ({
  name,
  income: [],
  expenses: [],
  debts: [],
  goals: [],
});

// Default data with template (all $0 values for user to fill in)
export const DEFAULT_DATA = {
  scenarios: {
    current: createTemplateScenario('Current Reality'),
    plan: createTemplateScenario('Plan Budget'),
  },
  version: 1,
  theme: 'dark',
};

// Export template creator for server use
export const getDefaultScenarios = () => ({
  current: createTemplateScenario('Current Reality'),
  plan: createTemplateScenario('Plan Budget'),
});
