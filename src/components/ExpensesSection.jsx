import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import { 
  calculateTotalExpenses, 
  calculateExpensesByType, 
  calculateExpensesByCategory,
  formatCurrency 
} from '../utils/calculations';
import { 
  Plus, 
  Trash2, 
  Home,
  Zap,
  UtensilsCrossed,
  Car,
  Shield,
  Heart,
  Tv,
  ShoppingBag,
  Sparkles,
  GraduationCap,
  CreditCard,
  MoreHorizontal,
  Lock,
  Unlock,
  Receipt
} from 'lucide-react';

const iconMap = {
  Home,
  Zap,
  UtensilsCrossed,
  Car,
  Shield,
  Heart,
  Tv,
  ShoppingBag,
  Sparkles,
  GraduationCap,
  CreditCard,
  MoreHorizontal,
};

const ExpensesSection = () => {
  const { currentScenario, addExpense, updateExpense, deleteExpense } = useBudget();
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: '', category: 'other', amount: '', isFixed: false });
  const [filterCategory, setFilterCategory] = useState('all');
  
  const totalExpenses = calculateTotalExpenses(currentScenario.expenses);
  const { fixed, variable } = calculateExpensesByType(currentScenario.expenses);
  const byCategory = calculateExpensesByCategory(currentScenario.expenses);
  
  const filteredExpenses = filterCategory === 'all' 
    ? currentScenario.expenses 
    : currentScenario.expenses.filter(e => e.category === filterCategory);
  
  const handleAdd = () => {
    if (newExpense.name && newExpense.amount) {
      addExpense({
        name: newExpense.name,
        category: newExpense.category,
        amount: parseFloat(newExpense.amount) || 0,
        isFixed: newExpense.isFixed,
      });
      setNewExpense({ name: '', category: 'other', amount: '', isFixed: false });
      setIsAdding(false);
    }
  };
  
  const handleUpdate = (id, field, value) => {
    const item = currentScenario.expenses.find(i => i.id === id);
    if (item) {
      updateExpense({
        ...item,
        [field]: field === 'amount' ? (parseFloat(value) || 0) : value,
      });
    }
  };
  
  const getIcon = (category) => {
    const cat = EXPENSE_CATEGORIES.find(c => c.id === category);
    const IconComponent = iconMap[cat?.icon] || MoreHorizontal;
    return <IconComponent className="w-5 h-5" />;
  };
  
  const getColor = (category) => {
    const cat = EXPENSE_CATEGORIES.find(c => c.id === category);
    return cat?.color || '#64748b';
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-100">Monthly Expenses</h2>
          <p className="text-gray-400 text-sm mt-1">Track where your money goes</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-gray-400">Fixed</p>
            <p className="text-lg font-mono font-semibold text-gray-300">{formatCurrency(fixed)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Variable</p>
            <p className="text-lg font-mono font-semibold text-gray-300">{formatCurrency(variable)}</p>
          </div>
          <div className="text-right pl-4 border-l border-dark-600">
            <p className="text-sm text-gray-400">Total Expenses</p>
            <p className="text-2xl font-mono font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
            <Receipt className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            filterCategory === 'all'
              ? 'bg-dark-600 text-gray-100 border border-dark-500'
              : 'text-gray-400 hover:text-gray-200 border border-transparent'
          }`}
        >
          All ({currentScenario.expenses.length})
        </button>
        {EXPENSE_CATEGORIES.filter(cat => byCategory[cat.id]).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              filterCategory === cat.id
                ? 'bg-dark-600 text-gray-100 border border-dark-500'
                : 'text-gray-400 hover:text-gray-200 border border-transparent'
            }`}
            style={filterCategory === cat.id ? { borderColor: cat.color + '50' } : {}}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            {cat.name}
          </button>
        ))}
      </div>
      
      {/* Expense List */}
      <div className="space-y-3">
        {filteredExpenses.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-4 p-4 rounded-xl bg-dark-800/60 border border-dark-600/50 hover:border-dark-500/50 transition-all duration-200 card-hover"
          >
            {/* Icon */}
            <div 
              className="p-2.5 rounded-lg"
              style={{ backgroundColor: getColor(item.category) + '20', color: getColor(item.category) }}
            >
              {getIcon(item.category)}
            </div>
            
            {/* Name & Category */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleUpdate(item.id, 'name', e.target.value)}
                className="w-full bg-transparent text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-accent-teal/30 rounded px-2 py-1 -ml-2"
                placeholder="Expense name"
              />
              <select
                value={item.category}
                onChange={(e) => handleUpdate(item.id, 'category', e.target.value)}
                className="mt-1 text-sm text-gray-400 bg-transparent border-none focus:outline-none cursor-pointer hover:text-gray-300"
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-dark-700">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Fixed/Variable Toggle */}
            <button
              onClick={() => handleUpdate(item.id, 'isFixed', !item.isFixed)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                item.isFixed
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-dark-600/50 text-gray-400 border border-dark-500/50 hover:text-gray-300'
              }`}
              title={item.isFixed ? 'Fixed expense (recurring)' : 'Variable expense'}
            >
              {item.isFixed ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              {item.isFixed ? 'Fixed' : 'Variable'}
            </button>
            
            {/* Amount */}
            <div className="flex items-center gap-1">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                value={item.amount || ''}
                onChange={(e) => handleUpdate(item.id, 'amount', e.target.value)}
                className="w-28 bg-dark-700/50 text-right text-lg font-mono font-semibold text-gray-100 rounded-lg px-3 py-2 border border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/30 focus:border-accent-teal/50"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            
            {/* Delete */}
            <button
              onClick={() => deleteExpense(item.id)}
              className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Delete expense"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        {/* Empty State */}
        {currentScenario.expenses.length === 0 && !isAdding && (
          <div className="text-center py-12 rounded-xl border-2 border-dashed border-dark-600/50">
            <Receipt className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No expenses yet</p>
            <p className="text-gray-500 text-sm">Add your monthly expenses to track spending</p>
          </div>
        )}
        
        {/* Add New Form */}
        {isAdding && (
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-dark-700/60 border border-accent-teal/30 animate-slide-up">
            <div 
              className="p-2.5 rounded-lg"
              style={{ backgroundColor: getColor(newExpense.category) + '20', color: getColor(newExpense.category) }}
            >
              {getIcon(newExpense.category)}
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={newExpense.name}
                onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                className="w-full bg-transparent text-gray-100 font-medium focus:outline-none placeholder-gray-500"
                placeholder="Expense name (e.g., Rent)"
                autoFocus
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="mt-1 text-sm text-gray-400 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-dark-700">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => setNewExpense({ ...newExpense, isFixed: !newExpense.isFixed })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                newExpense.isFixed
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-dark-600/50 text-gray-400 border border-dark-500/50'
              }`}
            >
              {newExpense.isFixed ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              {newExpense.isFixed ? 'Fixed' : 'Variable'}
            </button>
            
            <div className="flex items-center gap-1">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="w-28 bg-dark-600/50 text-right text-lg font-mono font-semibold text-gray-100 rounded-lg px-3 py-2 border border-dark-500/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/30"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-lg bg-accent-teal text-white font-medium hover:bg-accent-teal/90 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewExpense({ name: '', category: 'other', amount: '', isFixed: false });
              }}
              className="px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
        
        {/* Add Button */}
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-dark-600/50 text-gray-400 hover:border-accent-teal/50 hover:text-accent-teal transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        )}
      </div>
    </div>
  );
};

export default ExpensesSection;

