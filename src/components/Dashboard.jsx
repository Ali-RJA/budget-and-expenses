import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { EXPENSE_CATEGORIES, CHART_COLORS } from '../utils/constants';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateTotalDebtPayments,
  calculateTotalDebtBalance,
  calculateTotalGoalContributions,
  calculateNetSurplus,
  calculateSavingsRate,
  calculateExpensesByCategory,
  calculateExpensesByType,
  calculateDebtPayoffSchedule,
  calculateMonthsToDebtFree,
  calculateGoalProgress,
  calculateMonthsToGoal,
  calculateEmergencyFundTarget,
  calculateMonthlyInterest,
  formatCurrency,
  formatPercentage,
  formatMonths,
} from '../utils/calculations';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Target,
  PiggyBank,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Shield,
  Calendar,
  DollarSign,
  BarChart3,
  Percent,
  CircleDollarSign,
  Repeat,
  Pause,
} from 'lucide-react';

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-700 border border-dark-500 rounded-lg p-3 shadow-xl">
        {label && <p className="text-gray-400 text-sm mb-2">{label}</p>}
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-300 text-sm">{entry.name}:</span>
            <span className="text-white font-mono font-medium">
              {typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Summary Card Component
const SummaryCard = ({ title, value, subtitle, icon: Icon, trend, color = 'teal', onClick }) => {
  const colorClasses = {
    teal: 'from-accent-teal/20 to-accent-emerald/20 border-accent-teal/30',
    red: 'from-red-500/20 to-orange-500/20 border-red-500/30',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  };
  
  const iconColors = {
    teal: 'text-accent-teal',
    red: 'text-red-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
  };
  
  return (
    <div
      className={`p-5 rounded-xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm card-hover ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-mono font-bold mt-1 ${iconColors[color]}`}>{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-dark-700/50 ${iconColors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          {trend >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <span className={trend >= 0 ? 'text-green-400' : 'text-red-400'}>
            {trend >= 0 ? '+' : ''}{formatPercentage(trend)}
          </span>
          <span className="text-gray-500 text-sm">vs plan</span>
        </div>
      )}
    </div>
  );
};

// Insight Card Component
const InsightCard = ({ title, value, description, icon: Icon, color = 'teal', action }) => {
  const colorClasses = {
    teal: 'bg-accent-teal/10 border-accent-teal/30 text-accent-teal',
    yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
  };
  
  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium">{title}</p>
          <p className="text-2xl font-mono font-bold mt-1">{value}</p>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
          {action && (
            <button className="flex items-center gap-1 text-sm mt-2 hover:underline">
              {action} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { currentScenario, activeScenario, state, setActiveTab } = useBudget();
  const [debtPayoffMode, setDebtPayoffMode] = useState('independent'); // 'independent' or 'cascade'
  
  // Calculate all metrics
  const totalIncome = calculateTotalIncome(currentScenario.income);
  const totalExpenses = calculateTotalExpenses(currentScenario.expenses);
  const totalDebtPayments = calculateTotalDebtPayments(currentScenario.debts);
  const totalDebtBalance = calculateTotalDebtBalance(currentScenario.debts);
  const totalGoalContributions = calculateTotalGoalContributions(currentScenario.goals);
  const netSurplus = calculateNetSurplus(totalIncome, totalExpenses, totalDebtPayments, totalGoalContributions);
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses, totalDebtPayments);
  const monthsToDebtFree = calculateMonthsToDebtFree(currentScenario.debts);
  const expensesByCategory = calculateExpensesByCategory(currentScenario.expenses);
  
  // Emergency fund calculations
  const emergencyFundTarget = calculateEmergencyFundTarget(totalExpenses);
  const emergencyGoal = currentScenario.goals.find(g => g.type === 'emergency');
  const emergencyProgress = emergencyGoal 
    ? calculateGoalProgress(emergencyGoal.currentAmount, emergencyFundTarget)
    : 0;
  const monthsToEmergency = emergencyGoal 
    ? calculateMonthsToGoal(emergencyFundTarget, emergencyGoal.currentAmount, emergencyGoal.monthlyContribution)
    : Infinity;
  
  // Compare with other scenario
  const otherScenario = state.scenarios[activeScenario === 'current' ? 'plan' : 'current'];
  const otherIncome = calculateTotalIncome(otherScenario.income);
  const otherExpenses = calculateTotalExpenses(otherScenario.expenses);
  
  // Prepare chart data
  const expenseChartData = Object.entries(expensesByCategory)
    .map(([category, amount]) => {
      const cat = EXPENSE_CATEGORIES.find(c => c.id === category);
      return {
        name: cat?.name || category,
        value: amount,
        color: cat?.color || '#64748b',
      };
    })
    .sort((a, b) => b.value - a.value);
  
  const incomeVsExpenseData = [
    { name: 'Income', amount: totalIncome, fill: '#14b8a6' },
    { name: 'Expenses', amount: totalExpenses, fill: '#f43f5e' },
    { name: 'Debt Payments', amount: totalDebtPayments, fill: '#f59e0b' },
    { name: 'Savings', amount: totalGoalContributions, fill: '#10b981' },
  ];
  
  // Debt payoff projection - calculate both modes for comparison
  const debtPayoffScheduleIndependent = calculateDebtPayoffSchedule(currentScenario.debts, 360, 'independent');
  const debtPayoffScheduleCascade = calculateDebtPayoffSchedule(currentScenario.debts, 360, 'cascade');
  
  // Use the selected mode for display
  const debtPayoffSchedule = debtPayoffMode === 'cascade' ? debtPayoffScheduleCascade : debtPayoffScheduleIndependent;
  
  // Get months to debt-free for both modes
  const monthsIndependent = debtPayoffScheduleIndependent.length > 0 ? debtPayoffScheduleIndependent.length - 1 : 0;
  const monthsCascade = debtPayoffScheduleCascade.length > 0 ? debtPayoffScheduleCascade.length - 1 : 0;
  const monthsSaved = monthsIndependent - monthsCascade;
  
  // Calculate total interest for both modes
  const interestIndependent = debtPayoffScheduleIndependent.reduce((sum, entry) => sum + (entry.interestPaid || 0), 0);
  const interestCascade = debtPayoffScheduleCascade.reduce((sum, entry) => sum + (entry.interestPaid || 0), 0);
  const interestSaved = interestIndependent - interestCascade;
  
  // Determine optimal display: show monthly for shorter timeframes, sample for longer
  const totalMonths = debtPayoffSchedule.length - 1;
  let debtChartData = [];
  
  if (totalMonths <= 24) {
    // Show every month for 2 years or less
    debtChartData = debtPayoffSchedule.map(entry => ({
      month: entry.month === 0 ? 'Now' : `${entry.month}`,
      balance: entry.totalBalance,
      interest: entry.interestPaid || 0,
      principal: entry.principalPaid || 0,
    }));
  } else if (totalMonths <= 60) {
    // Show every month for up to 5 years
    debtChartData = debtPayoffSchedule.map(entry => ({
      month: entry.month === 0 ? 'Now' : entry.month % 12 === 0 ? `Yr ${entry.month / 12}` : `${entry.month}`,
      balance: entry.totalBalance,
      interest: entry.interestPaid || 0,
      principal: entry.principalPaid || 0,
    }));
  } else {
    // For longer timeframes, show key months (every 3 months) to keep chart readable
    debtChartData = debtPayoffSchedule
      .filter((entry, i) => i === 0 || i === debtPayoffSchedule.length - 1 || entry.month % 3 === 0)
      .map(entry => ({
        month: entry.month === 0 ? 'Now' : entry.month % 12 === 0 ? `Yr ${entry.month / 12}` : `${entry.month}`,
        balance: entry.totalBalance,
        interest: entry.interestPaid || 0,
        principal: entry.principalPaid || 0,
      }));
  }
  
  // Calculate total interest that will be paid (for current mode)
  const totalInterestToPay = debtPayoffSchedule.reduce((sum, entry) => sum + (entry.interestPaid || 0), 0);
  
  // Goal progress data
  const goalProgressData = currentScenario.goals.map(goal => ({
    name: goal.name,
    progress: calculateGoalProgress(goal.currentAmount, goal.targetAmount),
    current: goal.currentAmount,
    target: goal.targetAmount,
  }));
  
  // === NEW: Debt Interest vs Principal Breakdown ===
  const debtBreakdownData = currentScenario.debts
    .filter(debt => debt.balance > 0 && ((debt.minimumPayment || 0) + (debt.extraPayment || 0)) > 0)
    .map(debt => {
      const monthlyInterest = calculateMonthlyInterest(debt.balance, debt.interestRate);
      const totalPayment = (debt.minimumPayment || 0) + (debt.extraPayment || 0);
      // Cap interest at the payment amount (can't pay more interest than you're paying)
      const interestPortion = Math.min(monthlyInterest, totalPayment);
      const principalPortion = Math.max(0, totalPayment - interestPortion);
      
      return {
        name: debt.name.length > 15 ? debt.name.substring(0, 12) + '...' : debt.name,
        fullName: debt.name,
        interest: Math.round(interestPortion * 100) / 100,
        principal: Math.round(principalPortion * 100) / 100,
        total: Math.round(totalPayment * 100) / 100,
      };
    });
  
  const totalMonthlyInterest = debtBreakdownData.reduce((sum, d) => sum + d.interest, 0);
  const totalMonthlyPrincipal = debtBreakdownData.reduce((sum, d) => sum + d.principal, 0);
  
  // === NEW: 50/30/20 Budget Rule ===
  // Categorize expenses
  const { fixed: fixedExpenses, variable: variableExpenses } = calculateExpensesByType(currentScenario.expenses);
  
  // Calculate debt minimums (required payments = needs) vs extra (optional = savings)
  const debtMinimums = currentScenario.debts.reduce((sum, d) => sum + (d.minimumPayment || 0), 0);
  const debtExtras = currentScenario.debts.reduce((sum, d) => sum + (d.extraPayment || 0), 0);
  
  // 50/30/20 categories:
  // - Needs (50%): Fixed expenses + debt minimum payments
  // - Wants (30%): Variable expenses
  // - Savings (20%): Goal contributions + extra debt payments
  const needsAmount = fixedExpenses + debtMinimums;
  const wantsAmount = variableExpenses;
  const savingsAmount = totalGoalContributions + debtExtras;
  
  // Calculate percentages based on income
  const needsPercent = totalIncome > 0 ? (needsAmount / totalIncome) * 100 : 0;
  const wantsPercent = totalIncome > 0 ? (wantsAmount / totalIncome) * 100 : 0;
  const savingsPercent = totalIncome > 0 ? (savingsAmount / totalIncome) * 100 : 0;
  
  const budgetRuleData = [
    { 
      name: 'Needs', 
      target: 50, 
      actual: Math.round(needsPercent * 10) / 10,
      amount: needsAmount,
      description: 'Fixed expenses + debt minimums',
      color: '#3b82f6',
      status: needsPercent <= 50 ? 'good' : needsPercent <= 60 ? 'warning' : 'over'
    },
    { 
      name: 'Wants', 
      target: 30, 
      actual: Math.round(wantsPercent * 10) / 10,
      amount: wantsAmount,
      description: 'Variable/discretionary spending',
      color: '#f59e0b',
      status: wantsPercent <= 30 ? 'good' : wantsPercent <= 40 ? 'warning' : 'over'
    },
    { 
      name: 'Savings', 
      target: 20, 
      actual: Math.round(savingsPercent * 10) / 10,
      amount: savingsAmount,
      description: 'Goals + extra debt payments',
      color: '#10b981',
      status: savingsPercent >= 20 ? 'good' : savingsPercent >= 10 ? 'warning' : 'under'
    },
  ];
  
  return (
    <div className="space-y-8">
      {/* Scenario Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-100">
            {activeScenario === 'current' ? 'Current Reality' : 'Plan Budget'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {activeScenario === 'current' 
              ? 'Your actual monthly financial snapshot'
              : 'Your optimized monthly budget plan'
            }
          </p>
        </div>
        {activeScenario === 'current' && (
          <div className="text-right">
            <p className="text-sm text-gray-400">Quick Tip</p>
            <p className="text-sm text-accent-teal">
              Switch to "Plan Budget" to model changes
            </p>
          </div>
        )}
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Monthly Income"
          value={formatCurrency(totalIncome)}
          subtitle={`${currentScenario.income.length} source${currentScenario.income.length !== 1 ? 's' : ''}`}
          icon={TrendingUp}
          color="teal"
          onClick={() => setActiveTab('income')}
        />
        <SummaryCard
          title="Monthly Expenses"
          value={formatCurrency(totalExpenses)}
          subtitle={`${currentScenario.expenses.length} expense${currentScenario.expenses.length !== 1 ? 's' : ''}`}
          icon={Wallet}
          color="red"
          onClick={() => setActiveTab('expenses')}
        />
        <SummaryCard
          title="Total Debt"
          value={formatCurrency(totalDebtBalance)}
          subtitle={formatMonths(monthsToDebtFree) + ' to debt-free'}
          icon={CreditCard}
          color="purple"
          onClick={() => setActiveTab('debts')}
        />
        <SummaryCard
          title="Net Monthly"
          value={formatCurrency(netSurplus)}
          subtitle={netSurplus >= 0 ? 'Surplus' : 'Deficit'}
          icon={netSurplus >= 0 ? PiggyBank : AlertTriangle}
          color={netSurplus >= 0 ? 'green' : 'red'}
        />
      </div>
      
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InsightCard
          title="Savings Rate"
          value={formatPercentage(savingsRate)}
          description={savingsRate >= 20 ? 'Great! Above recommended 20%' : 'Aim for at least 20%'}
          icon={savingsRate >= 20 ? CheckCircle : Target}
          color={savingsRate >= 20 ? 'green' : 'yellow'}
        />
        <InsightCard
          title="Emergency Fund"
          value={formatPercentage(emergencyProgress)}
          description={`${formatCurrency(emergencyGoal?.currentAmount || 0)} of ${formatCurrency(emergencyFundTarget)} (3 months)`}
          icon={Shield}
          color={emergencyProgress >= 100 ? 'green' : emergencyProgress >= 50 ? 'yellow' : 'red'}
        />
        <InsightCard
          title="Debt-Free Timeline"
          value={formatMonths(monthsToDebtFree)}
          description={totalDebtBalance > 0 ? `Total debt: ${formatCurrency(totalDebtBalance)}` : 'No debt! 🎉'}
          icon={Calendar}
          color={monthsToDebtFree === 0 ? 'green' : monthsToDebtFree <= 24 ? 'teal' : 'yellow'}
        />
      </div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown Donut */}
        <div className="p-6 rounded-xl bg-dark-800/60 border border-dark-600/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-gray-100">Spending Breakdown</h3>
            <button 
              onClick={() => setActiveTab('expenses')}
              className="text-sm text-accent-teal hover:underline"
            >
              View All
            </button>
          </div>
          {expenseChartData.length > 0 ? (
            <div className="flex items-center gap-8">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {expenseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2 max-h-48 overflow-y-auto">
                {expenseChartData.slice(0, 6).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-gray-300">{entry.name}</span>
                    </div>
                    <span className="text-sm font-mono text-gray-100">{formatCurrency(entry.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              No expenses to display
            </div>
          )}
        </div>
        
        {/* Income vs Expenses Bar */}
        <div className="p-6 rounded-xl bg-dark-800/60 border border-dark-600/50">
          <h3 className="text-lg font-display font-semibold text-gray-100 mb-6">Cash Flow</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpenseData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} stroke="#64748b" />
                <YAxis type="category" dataKey="name" width={100} stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                  {incomeVsExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Debt Payoff Projection */}
        <div className="p-6 rounded-xl bg-dark-800/60 border border-dark-600/50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-display font-semibold text-gray-100">Debt Payoff Projection</h3>
            </div>
            <button 
              onClick={() => setActiveTab('debts')}
              className="text-sm text-accent-teal hover:underline"
            >
              Manage Debts
            </button>
          </div>
          
          {/* Mode Toggle */}
          {totalDebtBalance > 0 && (
            <div className="flex items-center gap-3 mb-3">
              <div className="flex rounded-lg bg-dark-700/50 p-0.5">
                <button
                  onClick={() => setDebtPayoffMode('independent')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    debtPayoffMode === 'independent'
                      ? 'bg-dark-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  title="Each debt uses only its own payments"
                >
                  <Pause className="w-3 h-3" />
                  Independent
                </button>
                <button
                  onClick={() => setDebtPayoffMode('cascade')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    debtPayoffMode === 'cascade'
                      ? 'bg-accent-teal text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  title="Freed payments cascade to next debt (snowball/avalanche)"
                >
                  <Repeat className="w-3 h-3" />
                  Cascade
                </button>
              </div>
              
              {/* Savings comparison */}
              {monthsSaved > 0 && debtPayoffMode === 'cascade' && (
                <span className="text-xs text-green-400">
                  {monthsSaved} mo faster • Save {formatCurrency(interestSaved)} interest
                </span>
              )}
              {monthsSaved > 0 && debtPayoffMode === 'independent' && (
                <span className="text-xs text-gray-400">
                  Cascade saves {monthsSaved} mo & {formatCurrency(interestSaved)}
                </span>
              )}
            </div>
          )}
          
          {/* Stats row */}
          {totalDebtBalance > 0 && (
            <div className="flex gap-4 text-sm mb-3">
              <div>
                <span className="text-gray-400">Debt-free in: </span>
                <span className="text-white font-mono font-medium">{formatMonths(totalMonths)}</span>
              </div>
              <div>
                <span className="text-gray-400">Total interest: </span>
                <span className="text-yellow-400 font-mono">{formatCurrency(totalInterestToPay)}</span>
              </div>
            </div>
          )}
          {debtChartData.length > 1 ? (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={debtChartData}>
                  <defs>
                    <linearGradient id="debtGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b" 
                    tick={{ fontSize: 11 }}
                    interval={totalMonths <= 24 ? 2 : 'preserveStartEnd'}
                  />
                  <YAxis 
                    tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`} 
                    stroke="#64748b" 
                    tick={{ fontSize: 11 }}
                    width={50}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="linear"
                    dataKey="balance"
                    name="Debt Balance"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="url(#debtGradient)"
                    dot={{ r: 3, fill: '#f43f5e' }}
                    activeDot={{ r: 5, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-500">
              {totalDebtBalance === 0 ? 'Debt free! 🎉' : 'Add debt details to see projection'}
            </div>
          )}
        </div>
        
        {/* Goal Progress */}
        <div className="p-6 rounded-xl bg-dark-800/60 border border-dark-600/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-gray-100">Goal Progress</h3>
            <button 
              onClick={() => setActiveTab('goals')}
              className="text-sm text-accent-teal hover:underline"
            >
              View Goals
            </button>
          </div>
          {goalProgressData.length > 0 ? (
            <div className="space-y-4">
              {goalProgressData.slice(0, 4).map((goal, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{goal.name}</span>
                    <span className="text-sm font-mono text-gray-400">
                      {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                    </span>
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, goal.progress)}%`,
                        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-500">
              No goals set yet
            </div>
          )}
        </div>
      </div>
      
      {/* Comparison Banner (if viewing current and plan differs) */}
      {activeScenario === 'current' && (otherIncome !== totalIncome || otherExpenses !== totalExpenses) && (
        <div className="p-6 rounded-xl bg-gradient-to-r from-accent-teal/10 to-accent-emerald/10 border border-accent-teal/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BarChart3 className="w-8 h-8 text-accent-teal" />
              <div>
                <h3 className="text-lg font-display font-semibold text-gray-100">Compare with Plan</h3>
                <p className="text-gray-400 text-sm">
                  Your plan would save {formatCurrency(Math.abs((otherIncome - otherExpenses) - (totalIncome - totalExpenses)))} more per month
                </p>
              </div>
            </div>
            <button
              onClick={() => {}}
              className="px-4 py-2 rounded-lg bg-accent-teal text-white font-medium hover:bg-accent-teal/90 transition-colors"
            >
              View Side by Side
            </button>
          </div>
        </div>
      )}
      
      {/* Charts Row 3: New Infographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Debt Interest vs Principal Breakdown */}
        <div className="p-6 rounded-xl bg-dark-800/60 border border-dark-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <CircleDollarSign className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-display font-semibold text-gray-100">Where Your Debt Payments Go</h3>
                <p className="text-sm text-gray-400">Interest vs. actually paying down debt</p>
              </div>
            </div>
          </div>
          {debtBreakdownData.length > 0 ? (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="flex gap-4 p-3 rounded-lg bg-dark-700/50">
                <div className="flex-1 text-center">
                  <p className="text-xs text-gray-400 mb-1">Monthly Interest</p>
                  <p className="text-lg font-mono font-bold text-yellow-400">{formatCurrency(totalMonthlyInterest)}</p>
                  <p className="text-xs text-gray-500">
                    {totalDebtPayments > 0 ? `${((totalMonthlyInterest / totalDebtPayments) * 100).toFixed(0)}% of payments` : '0%'}
                  </p>
                </div>
                <div className="w-px bg-dark-600" />
                <div className="flex-1 text-center">
                  <p className="text-xs text-gray-400 mb-1">Paying Down Debt</p>
                  <p className="text-lg font-mono font-bold text-green-400">{formatCurrency(totalMonthlyPrincipal)}</p>
                  <p className="text-xs text-gray-500">
                    {totalDebtPayments > 0 ? `${((totalMonthlyPrincipal / totalDebtPayments) * 100).toFixed(0)}% of payments` : '0%'}
                  </p>
                </div>
              </div>
              
              {/* Bar Chart */}
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={debtBreakdownData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" horizontal={false} />
                    <XAxis type="number" tickFormatter={(v) => `$${v}`} stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" width={70} stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-dark-700 border border-dark-500 rounded-lg p-3 shadow-xl">
                              <p className="text-white font-medium mb-2">{data.fullName}</p>
                              <div className="space-y-1">
                                <div className="flex justify-between gap-4">
                                  <span className="text-yellow-400 text-sm">Interest:</span>
                                  <span className="text-white font-mono text-sm">{formatCurrency(data.interest)}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-green-400 text-sm">Principal:</span>
                                  <span className="text-white font-mono text-sm">{formatCurrency(data.principal)}</span>
                                </div>
                                <div className="flex justify-between gap-4 pt-1 border-t border-dark-500">
                                  <span className="text-gray-400 text-sm">Total:</span>
                                  <span className="text-white font-mono text-sm">{formatCurrency(data.total)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="interest" name="Interest" stackId="a" fill="#eab308" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="principal" name="Principal" stackId="a" fill="#22c55e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm text-gray-400">Interest (lost $)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-400">Principal (paying debt)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              {totalDebtBalance === 0 ? 'No debt to display' : 'Add payment amounts to see breakdown'}
            </div>
          )}
        </div>
        
        {/* 50/30/20 Budget Rule */}
        <div className="p-6 rounded-xl bg-dark-800/60 border border-dark-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Percent className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-display font-semibold text-gray-100">50/30/20 Budget Rule</h3>
                <p className="text-sm text-gray-400">How your spending compares to the recommended rule</p>
              </div>
            </div>
          </div>
          {totalIncome > 0 ? (
            <div className="space-y-5">
              {budgetRuleData.map((category, index) => {
                const isGood = category.status === 'good';
                const isWarning = category.status === 'warning';
                const barWidth = Math.min(100, Math.max(0, category.actual));
                const targetPosition = Math.min(100, category.target);
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-200">{category.name}</span>
                        <span className="text-xs text-gray-500">({category.description})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-mono font-bold ${
                          isGood ? 'text-green-400' : isWarning ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {category.actual}%
                        </span>
                        <span className="text-xs text-gray-500">/ {category.target}%</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative h-4 bg-dark-700 rounded-full overflow-hidden">
                      {/* Actual bar */}
                      <div
                        className="absolute h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: isGood ? '#22c55e' : isWarning ? '#eab308' : '#ef4444',
                        }}
                      />
                      {/* Target marker */}
                      <div
                        className="absolute top-0 h-full w-0.5 bg-white/50"
                        style={{ left: `${targetPosition}%` }}
                      />
                      {/* Target label */}
                      <div
                        className="absolute -top-5 text-xs text-gray-400 transform -translate-x-1/2"
                        style={{ left: `${targetPosition}%` }}
                      >
                        {category.target}%
                      </div>
                    </div>
                    
                    {/* Amount */}
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{formatCurrency(category.amount)}/month</span>
                      <span className={`${
                        isGood ? 'text-green-400' : isWarning ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {category.name === 'Savings' 
                          ? (isGood ? '✓ On track' : isWarning ? '↑ Could save more' : '⚠ Below target')
                          : (isGood ? '✓ Within budget' : isWarning ? '↑ Slightly over' : '⚠ Over budget')
                        }
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {/* Summary */}
              <div className="pt-3 mt-3 border-t border-dark-600">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Unallocated</span>
                  <span className={`font-mono font-medium ${
                    (100 - needsPercent - wantsPercent - savingsPercent) >= 0 ? 'text-gray-300' : 'text-red-400'
                  }`}>
                    {(100 - needsPercent - wantsPercent - savingsPercent).toFixed(1)}%
                    <span className="text-gray-500 ml-2">
                      ({formatCurrency(totalIncome - needsAmount - wantsAmount - savingsAmount)})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              Add income to see budget breakdown
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

