import React from 'react';
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
  calculateDebtPayoffSchedule,
  calculateMonthsToDebtFree,
  calculateGoalProgress,
  calculateMonthsToGoal,
  calculateEmergencyFundTarget,
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
  
  // Debt payoff projection
  const debtPayoffSchedule = calculateDebtPayoffSchedule(currentScenario.debts, 60);
  const debtChartData = debtPayoffSchedule.filter((_, i) => i % 3 === 0).map(entry => ({
    month: `Mo ${entry.month}`,
    balance: entry.totalBalance,
  }));
  
  // Goal progress data
  const goalProgressData = currentScenario.goals.map(goal => ({
    name: goal.name,
    progress: calculateGoalProgress(goal.currentAmount, goal.targetAmount),
    current: goal.currentAmount,
    target: goal.targetAmount,
  }));
  
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-gray-100">Debt Payoff Projection</h3>
            <button 
              onClick={() => setActiveTab('debts')}
              className="text-sm text-accent-teal hover:underline"
            >
              Manage Debts
            </button>
          </div>
          {debtChartData.length > 1 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={debtChartData}>
                  <defs>
                    <linearGradient id="debtGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} stroke="#64748b" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    name="Debt Balance"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="url(#debtGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
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
    </div>
  );
};

export default Dashboard;

