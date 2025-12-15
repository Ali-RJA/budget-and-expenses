// Calculate total income
export const calculateTotalIncome = (incomeItems) => {
  return incomeItems.reduce((sum, item) => sum + (item.amount || 0), 0);
};

// Calculate total expenses
export const calculateTotalExpenses = (expenseItems) => {
  return expenseItems.reduce((sum, item) => sum + (item.amount || 0), 0);
};

// Calculate fixed vs variable expenses
export const calculateExpensesByType = (expenseItems) => {
  const fixed = expenseItems.filter(e => e.isFixed).reduce((sum, e) => sum + (e.amount || 0), 0);
  const variable = expenseItems.filter(e => !e.isFixed).reduce((sum, e) => sum + (e.amount || 0), 0);
  return { fixed, variable };
};

// Calculate expenses by category
export const calculateExpensesByCategory = (expenseItems) => {
  const byCategory = {};
  expenseItems.forEach(expense => {
    const cat = expense.category || 'other';
    byCategory[cat] = (byCategory[cat] || 0) + (expense.amount || 0);
  });
  return byCategory;
};

// Calculate total debt payments (minimum + extra)
export const calculateTotalDebtPayments = (debtItems) => {
  return debtItems.reduce((sum, debt) => {
    return sum + (debt.minimumPayment || 0) + (debt.extraPayment || 0);
  }, 0);
};

// Calculate total debt balance
export const calculateTotalDebtBalance = (debtItems) => {
  return debtItems.reduce((sum, debt) => sum + (debt.balance || 0), 0);
};

// Calculate monthly interest for a debt
export const calculateMonthlyInterest = (balance, annualRate) => {
  return (balance * (annualRate / 100)) / 12;
};

// Calculate months to pay off a single debt
export const calculateMonthsToPayoff = (balance, annualRate, monthlyPayment) => {
  if (monthlyPayment <= 0 || balance <= 0) return Infinity;
  
  const monthlyRate = annualRate / 100 / 12;
  
  if (monthlyRate === 0) {
    return Math.ceil(balance / monthlyPayment);
  }
  
  const monthlyInterest = balance * monthlyRate;
  if (monthlyPayment <= monthlyInterest) {
    return Infinity; // Payment doesn't cover interest
  }
  
  // Formula: n = -log(1 - (r * P) / M) / log(1 + r)
  // where r = monthly rate, P = principal, M = monthly payment
  const months = -Math.log(1 - (monthlyRate * balance) / monthlyPayment) / Math.log(1 + monthlyRate);
  
  return Math.ceil(months);
};

// Calculate total interest paid over life of debt
export const calculateTotalInterestPaid = (balance, annualRate, monthlyPayment) => {
  if (monthlyPayment <= 0 || balance <= 0) return 0;
  
  const months = calculateMonthsToPayoff(balance, annualRate, monthlyPayment);
  if (months === Infinity) return Infinity;
  
  const totalPaid = monthlyPayment * months;
  return Math.max(0, totalPaid - balance);
};

// Calculate debt payoff schedule (for chart) - WYSIWYG: What You See Is What You Get
// Each debt uses ONLY its own payments - no cascading, no pooling, no implicit behavior
export const calculateDebtPayoffSchedule = (debtItems, maxMonths = 360) => {
  if (!debtItems.length) return [];
  
  // Filter out debts with zero balance
  const activeDebts = debtItems.filter(d => (d.balance || 0) > 0);
  if (!activeDebts.length) return [{ month: 0, totalBalance: 0, interestPaid: 0, principalPaid: 0 }];
  
  const schedule = [];
  
  // Create working copy of balances - each debt tracked independently
  let balances = activeDebts.map(d => d.balance || 0);
  
  // Month 0: Record starting state
  schedule.push({
    month: 0,
    totalBalance: balances.reduce((sum, b) => sum + b, 0),
    interestPaid: 0,
    principalPaid: 0,
    balances: [...balances],
  });
  
  for (let month = 1; month <= maxMonths; month++) {
    let monthlyInterest = 0;
    let monthlyPrincipal = 0;
    
    // Process each debt INDEPENDENTLY - no interaction between debts
    for (let i = 0; i < activeDebts.length; i++) {
      if (balances[i] <= 0) continue;
      
      const debt = activeDebts[i];
      const monthlyRate = (debt.interestRate || 0) / 100 / 12;
      
      // Step 1: Add interest
      const interest = balances[i] * monthlyRate;
      balances[i] += interest;
      monthlyInterest += interest;
      
      // Step 2: Calculate this debt's total payment (min + extra)
      const totalPayment = (debt.minimumPayment || 0) + (debt.extraPayment || 0);
      
      // Step 3: Apply payment - cap at remaining balance (no overpaying)
      const actualPayment = Math.min(totalPayment, balances[i]);
      
      if (actualPayment > 0) {
        balances[i] -= actualPayment;
        monthlyPrincipal += actualPayment;
        
        // If paid off, set to exactly 0
        if (balances[i] <= 0.01) {
          balances[i] = 0;
        }
      }
    }
    
    const totalBalance = balances.reduce((sum, b) => sum + Math.max(0, b), 0);
    
    schedule.push({
      month,
      totalBalance: Math.round(totalBalance * 100) / 100,
      interestPaid: Math.round(monthlyInterest * 100) / 100,
      principalPaid: Math.round(monthlyPrincipal * 100) / 100,
      balances: balances.map(b => Math.round(Math.max(0, b) * 100) / 100),
    });
    
    // Stop if all debts are paid off
    if (totalBalance <= 0) break;
  }
  
  return schedule;
};

// Calculate when debt-free (months from now)
export const calculateMonthsToDebtFree = (debtItems) => {
  if (!debtItems.length) return 0;
  
  const schedule = calculateDebtPayoffSchedule(debtItems);
  const lastEntry = schedule[schedule.length - 1];
  
  if (lastEntry && lastEntry.totalBalance <= 0) {
    return lastEntry.month;
  }
  
  return Infinity;
};

// Calculate months to reach a goal
export const calculateMonthsToGoal = (targetAmount, currentAmount, monthlyContribution) => {
  if (monthlyContribution <= 0) return Infinity;
  const remaining = targetAmount - currentAmount;
  if (remaining <= 0) return 0;
  return Math.ceil(remaining / monthlyContribution);
};

// Calculate goal progress percentage
export const calculateGoalProgress = (currentAmount, targetAmount) => {
  if (targetAmount <= 0) return 0;
  return Math.min(100, (currentAmount / targetAmount) * 100);
};

// Calculate total goal contributions
export const calculateTotalGoalContributions = (goals) => {
  return goals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0);
};

// Calculate net monthly surplus/deficit
export const calculateNetSurplus = (income, expenses, debtPayments, goalContributions) => {
  return income - expenses - debtPayments - goalContributions;
};

// Calculate savings rate
export const calculateSavingsRate = (income, expenses, debtPayments) => {
  if (income <= 0) return 0;
  const savings = income - expenses - debtPayments;
  return Math.max(0, (savings / income) * 100);
};

// Calculate emergency fund target (3 months of expenses)
export const calculateEmergencyFundTarget = (monthlyExpenses, months = 3) => {
  return monthlyExpenses * months;
};

// Calculate months to emergency fund
export const calculateMonthsToEmergencyFund = (currentSavings, targetAmount, monthlyContribution) => {
  if (monthlyContribution <= 0) return Infinity;
  const needed = targetAmount - currentSavings;
  if (needed <= 0) return 0;
  return Math.ceil(needed / monthlyContribution);
};

// Generate unique ID
export const generateId = (prefix = 'item') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format currency
export const formatCurrency = (amount, showCents = false) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  });
  return formatter.format(amount || 0);
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  return `${(value || 0).toFixed(decimals)}%`;
};

// Format months as human readable
export const formatMonths = (months) => {
  if (months === Infinity || months > 999) return 'Never';
  if (months === 0) return 'Done!';
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  }
  
  const yearStr = years === 1 ? '1 year' : `${years} years`;
  const monthStr = remainingMonths === 1 ? '1 month' : `${remainingMonths} months`;
  
  return `${yearStr}, ${monthStr}`;
};

