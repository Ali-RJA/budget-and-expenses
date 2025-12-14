import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { INCOME_TYPES } from '../utils/constants';
import { calculateTotalIncome, formatCurrency } from '../utils/calculations';
import { 
  Plus, 
  Trash2, 
  Briefcase, 
  Laptop, 
  TrendingUp, 
  Building, 
  Store, 
  DollarSign,
  PiggyBank
} from 'lucide-react';

const iconMap = {
  Briefcase,
  Laptop,
  TrendingUp,
  Building,
  Store,
  DollarSign,
};

const IncomeSection = () => {
  const { currentScenario, addIncome, updateIncome, deleteIncome } = useBudget();
  const [isAdding, setIsAdding] = useState(false);
  const [newIncome, setNewIncome] = useState({ name: '', type: 'salary', amount: '' });
  
  const totalIncome = calculateTotalIncome(currentScenario.income);
  
  const handleAdd = () => {
    if (newIncome.name && newIncome.amount) {
      addIncome({
        name: newIncome.name,
        type: newIncome.type,
        amount: parseFloat(newIncome.amount) || 0,
      });
      setNewIncome({ name: '', type: 'salary', amount: '' });
      setIsAdding(false);
    }
  };
  
  const handleUpdate = (id, field, value) => {
    const item = currentScenario.income.find(i => i.id === id);
    if (item) {
      updateIncome({
        ...item,
        [field]: field === 'amount' ? (parseFloat(value) || 0) : value,
      });
    }
  };
  
  const getIcon = (type) => {
    const incomeType = INCOME_TYPES.find(t => t.id === type);
    const IconComponent = iconMap[incomeType?.icon] || DollarSign;
    return <IconComponent className="w-5 h-5" />;
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-100">Monthly Income</h2>
          <p className="text-gray-400 text-sm mt-1">All sources of monthly income</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">Total Income</p>
            <p className="text-2xl font-mono font-bold gradient-text">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-accent-teal/20 to-accent-emerald/20 border border-accent-teal/30">
            <PiggyBank className="w-8 h-8 text-accent-teal" />
          </div>
        </div>
      </div>
      
      {/* Income List */}
      <div className="space-y-3">
        {currentScenario.income.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-4 p-4 rounded-xl bg-dark-800/60 border border-dark-600/50 hover:border-dark-500/50 transition-all duration-200 card-hover"
          >
            {/* Icon */}
            <div className="p-2.5 rounded-lg bg-dark-700/80 text-accent-teal">
              {getIcon(item.type)}
            </div>
            
            {/* Name */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleUpdate(item.id, 'name', e.target.value)}
                className="w-full bg-transparent text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-accent-teal/30 rounded px-2 py-1 -ml-2"
                placeholder="Income name"
              />
              <select
                value={item.type}
                onChange={(e) => handleUpdate(item.id, 'type', e.target.value)}
                className="mt-1 text-sm text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer hover:text-gray-300"
              >
                {INCOME_TYPES.map(type => (
                  <option key={type.id} value={type.id} className="bg-dark-700">
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
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
              onClick={() => deleteIncome(item.id)}
              className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Delete income"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        {/* Empty State */}
        {currentScenario.income.length === 0 && !isAdding && (
          <div className="text-center py-12 rounded-xl border-2 border-dashed border-dark-600/50">
            <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No income sources yet</p>
            <p className="text-gray-500 text-sm">Add your monthly income to get started</p>
          </div>
        )}
        
        {/* Add New Form */}
        {isAdding && (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-dark-700/60 border border-accent-teal/30 animate-slide-up">
            <div className="p-2.5 rounded-lg bg-dark-600/80 text-gray-400">
              {getIcon(newIncome.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={newIncome.name}
                onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
                className="w-full bg-transparent text-gray-100 font-medium focus:outline-none placeholder-gray-500"
                placeholder="Income name (e.g., Monthly Salary)"
                autoFocus
              />
              <select
                value={newIncome.type}
                onChange={(e) => setNewIncome({ ...newIncome, type: e.target.value })}
                className="mt-1 text-sm text-gray-400 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                {INCOME_TYPES.map(type => (
                  <option key={type.id} value={type.id} className="bg-dark-700">
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                value={newIncome.amount}
                onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
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
                setNewIncome({ name: '', type: 'salary', amount: '' });
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
            Add Income Source
          </button>
        )}
      </div>
    </div>
  );
};

export default IncomeSection;

