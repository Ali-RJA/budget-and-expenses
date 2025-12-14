import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { DEBT_TYPES } from '../utils/constants';
import { 
  calculateTotalDebtBalance,
  calculateTotalDebtPayments,
  calculateMonthlyInterest,
  calculateMonthsToPayoff,
  calculateTotalInterestPaid,
  calculateMonthsToDebtFree,
  formatCurrency,
  formatMonths
} from '../utils/calculations';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  Trash2, 
  GripVertical,
  CreditCard,
  Wallet,
  GraduationCap,
  Car,
  Home,
  Heart,
  FileText,
  AlertTriangle,
  TrendingDown,
  Calendar
} from 'lucide-react';

const iconMap = {
  CreditCard,
  Wallet,
  GraduationCap,
  Car,
  Home,
  Heart,
  FileText,
};

// Sortable Debt Item Component
const SortableDebtItem = ({ item, onUpdate, onDelete, getIcon, filterType, setFilterType }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const totalPayment = (item.minimumPayment || 0) + (item.extraPayment || 0);
  const monthlyInterest = calculateMonthlyInterest(item.balance, item.interestRate);
  const monthsToPayoff = calculateMonthsToPayoff(item.balance, item.interestRate, totalPayment);
  const totalInterest = calculateTotalInterestPaid(item.balance, item.interestRate, totalPayment);
  const principalPortion = Math.max(0, totalPayment - monthlyInterest);
  
  const debtType = DEBT_TYPES.find(t => t.id === item.type);
  const isFiltered = filterType === item.type;
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex flex-col gap-4 p-4 rounded-xl bg-dark-800/60 border border-dark-600/50 hover:border-dark-500/50 transition-all duration-200 ${
        isDragging ? 'shadow-2xl shadow-accent-teal/20 border-accent-teal/50 z-50' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <button
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-dark-600/50 cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>
        
        {/* Icon - Clickable for filtering */}
        <button 
          onClick={() => setFilterType(isFiltered ? 'all' : item.type)}
          className={`p-2.5 rounded-lg bg-red-500/20 text-red-400 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg ${
            isFiltered ? 'ring-2 ring-offset-2 ring-offset-dark-800 ring-red-400' : ''
          }`}
          title={isFiltered ? 'Click to show all' : `Filter by ${debtType?.name || item.type}`}
        >
          {getIcon(item.type)}
        </button>
        
        {/* Name & Type */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={item.name}
            onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
            className="w-full bg-transparent text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-accent-teal/30 rounded px-2 py-1 -ml-2"
            placeholder="Debt name"
          />
          <select
            value={item.type}
            onChange={(e) => onUpdate(item.id, 'type', e.target.value)}
            className="mt-1 text-sm text-gray-400 bg-transparent border-none focus:outline-none cursor-pointer hover:text-gray-300"
          >
            {DEBT_TYPES.map(type => (
              <option key={type.id} value={type.id} className="bg-dark-700">
                {type.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Balance */}
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Balance</p>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">$</span>
            <input
              type="number"
              value={item.balance || ''}
              onChange={(e) => onUpdate(item.id, 'balance', e.target.value)}
              className="w-28 bg-dark-700/50 text-right text-lg font-mono font-semibold text-red-400 rounded-lg px-3 py-2 border border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/30"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        {/* Delete */}
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Delete debt"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* Details Row */}
      <div className="flex flex-wrap items-center gap-4 pl-12">
        {/* Interest Rate */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">APR:</span>
          <div className="flex items-center">
            <input
              type="number"
              value={item.interestRate || ''}
              onChange={(e) => onUpdate(item.id, 'interestRate', e.target.value)}
              className="w-20 bg-dark-700/50 text-right text-sm font-mono text-gray-100 rounded-lg px-2 py-1.5 border border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/30"
              placeholder="0"
              min="0"
              max="100"
              step="0.01"
            />
            <span className="text-gray-400 ml-1">%</span>
          </div>
        </div>
        
        {/* Minimum Payment */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Min. Payment:</span>
          <div className="flex items-center">
            <span className="text-gray-400">$</span>
            <input
              type="number"
              value={item.minimumPayment || ''}
              onChange={(e) => onUpdate(item.id, 'minimumPayment', e.target.value)}
              className="w-24 bg-dark-700/50 text-right text-sm font-mono text-gray-100 rounded-lg px-2 py-1.5 border border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/30"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        {/* Extra Payment */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-accent-teal">Extra:</span>
          <div className="flex items-center">
            <span className="text-gray-400">$</span>
            <input
              type="number"
              value={item.extraPayment || ''}
              onChange={(e) => onUpdate(item.id, 'extraPayment', e.target.value)}
              className="w-24 bg-accent-teal/10 text-right text-sm font-mono text-accent-teal rounded-lg px-2 py-1.5 border border-accent-teal/30 focus:outline-none focus:ring-2 focus:ring-accent-teal/30"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-6 w-px bg-dark-600 hidden md:block" />
        
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5" title="Monthly interest">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500 font-mono">{formatCurrency(monthlyInterest)}</span>
            <span className="text-gray-500">interest/mo</span>
          </div>
          
          <div className="flex items-center gap-1.5" title="Principal portion of payment">
            <TrendingDown className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-mono">{formatCurrency(principalPortion)}</span>
            <span className="text-gray-500">to principal</span>
          </div>
          
          <div className="flex items-center gap-1.5" title="Time to pay off">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-medium">{formatMonths(monthsToPayoff)}</span>
            <span className="text-gray-500">to pay off</span>
          </div>
          
          {totalInterest !== Infinity && totalInterest > 0 && (
            <div className="flex items-center gap-1.5 text-gray-400" title="Total interest you'll pay">
              <span className="text-gray-500">Total interest:</span>
              <span className="font-mono text-yellow-500">{formatCurrency(totalInterest)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DebtsSection = () => {
  const { currentScenario, addDebt, updateDebt, deleteDebt, reorderDebts } = useBudget();
  const [isAdding, setIsAdding] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [newDebt, setNewDebt] = useState({ 
    name: '', 
    type: 'credit_card', 
    balance: '', 
    interestRate: '', 
    minimumPayment: '', 
    extraPayment: '' 
  });
  
  const sortedDebts = [...currentScenario.debts].sort((a, b) => a.order - b.order);
  const filteredDebts = filterType === 'all' 
    ? sortedDebts 
    : sortedDebts.filter(d => d.type === filterType);
  
  const totalBalance = calculateTotalDebtBalance(currentScenario.debts);
  const totalPayments = calculateTotalDebtPayments(currentScenario.debts);
  const monthsToDebtFree = calculateMonthsToDebtFree(currentScenario.debts);
  
  // Get unique types that exist in debts
  const existingTypes = [...new Set(currentScenario.debts.map(d => d.type))];
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = sortedDebts.findIndex(d => d.id === active.id);
      const newIndex = sortedDebts.findIndex(d => d.id === over.id);
      
      const newOrder = arrayMove(sortedDebts, oldIndex, newIndex);
      reorderDebts(newOrder);
    }
  };
  
  const handleAdd = () => {
    if (newDebt.name && newDebt.balance) {
      addDebt({
        name: newDebt.name,
        type: newDebt.type,
        balance: parseFloat(newDebt.balance) || 0,
        interestRate: parseFloat(newDebt.interestRate) || 0,
        minimumPayment: parseFloat(newDebt.minimumPayment) || 0,
        extraPayment: parseFloat(newDebt.extraPayment) || 0,
      });
      setNewDebt({ name: '', type: 'credit_card', balance: '', interestRate: '', minimumPayment: '', extraPayment: '' });
      setIsAdding(false);
    }
  };
  
  const handleUpdate = (id, field, value) => {
    const item = currentScenario.debts.find(i => i.id === id);
    if (item) {
      const numericFields = ['balance', 'interestRate', 'minimumPayment', 'extraPayment'];
      updateDebt({
        ...item,
        [field]: numericFields.includes(field) ? (parseFloat(value) || 0) : value,
      });
    }
  };
  
  const getIcon = (type) => {
    const debtType = DEBT_TYPES.find(t => t.id === type);
    const IconComponent = iconMap[debtType?.icon] || CreditCard;
    return <IconComponent className="w-5 h-5" />;
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-100">Debts</h2>
          <p className="text-gray-400 text-sm mt-1">Drag to reorder payment priority (debt avalanche/snowball)</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-gray-400">Monthly Payments</p>
            <p className="text-lg font-mono font-semibold text-gray-300">{formatCurrency(totalPayments)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Debt-Free In</p>
            <p className="text-lg font-mono font-semibold text-accent-teal">{formatMonths(monthsToDebtFree)}</p>
          </div>
          <div className="text-right pl-4 border-l border-dark-600">
            <p className="text-sm text-gray-400">Total Debt</p>
            <p className="text-2xl font-mono font-bold text-red-400">{formatCurrency(totalBalance)}</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
            <CreditCard className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>
      
      {/* Type Filter - only show if there are debts */}
      {existingTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              filterType === 'all'
                ? 'bg-dark-600 text-gray-100 border border-dark-500'
                : 'text-gray-400 hover:text-gray-200 border border-transparent'
            }`}
          >
            All ({currentScenario.debts.length})
          </button>
          {DEBT_TYPES.filter(type => existingTypes.includes(type.id)).map((type) => {
            const count = currentScenario.debts.filter(d => d.type === type.id).length;
            const IconComponent = iconMap[type.icon] || CreditCard;
            return (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterType === type.id
                    ? 'bg-dark-600 text-gray-100 border border-red-500/50'
                    : 'text-gray-400 hover:text-gray-200 border border-transparent'
                }`}
              >
                <IconComponent className="w-4 h-4 text-red-400" />
                {type.name} ({count})
              </button>
            );
          })}
        </div>
      )}
      
      {/* Info Card */}
      {sortedDebts.length > 1 && (
        <div className="p-4 rounded-xl bg-accent-teal/10 border border-accent-teal/30">
          <div className="flex items-start gap-3">
            <GripVertical className="w-5 h-5 text-accent-teal mt-0.5" />
            <div>
              <p className="text-accent-teal font-medium">Priority Order</p>
              <p className="text-gray-400 text-sm mt-1">
                Drag debts to reorder. The top debt receives extra payments first (after all minimum payments are made). 
                When it's paid off, extra payments cascade to the next debt.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Debt List */}
      <div className="space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredDebts.map(d => d.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredDebts.map((item, index) => (
              <div key={item.id} className="relative">
                {index === 0 && sortedDebts.length > 1 && filterType === 'all' && (
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-accent-teal/20 text-accent-teal text-xs font-medium">
                    #1
                  </div>
                )}
                <SortableDebtItem
                  item={item}
                  onUpdate={handleUpdate}
                  onDelete={deleteDebt}
                  getIcon={getIcon}
                  filterType={filterType}
                  setFilterType={setFilterType}
                />
              </div>
            ))}
          </SortableContext>
        </DndContext>
        
        {/* Empty State */}
        {currentScenario.debts.length === 0 && !isAdding && (
          <div className="text-center py-12 rounded-xl border-2 border-dashed border-dark-600/50">
            <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No debts yet</p>
            <p className="text-gray-500 text-sm">Add your debts to track payoff progress</p>
          </div>
        )}
        
        {/* Filtered Empty State */}
        {currentScenario.debts.length > 0 && filteredDebts.length === 0 && (
          <div className="text-center py-8 rounded-xl border border-dark-600/50">
            <p className="text-gray-400">No debts match this filter</p>
            <button 
              onClick={() => setFilterType('all')}
              className="text-accent-teal text-sm mt-2 hover:underline"
            >
              Show all debts
            </button>
          </div>
        )}
        
        {/* Add New Form */}
        {isAdding && (
          <div className="flex flex-col gap-4 p-4 rounded-xl bg-dark-700/60 border border-accent-teal/30 animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-red-500/20 text-red-400">
                {getIcon(newDebt.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={newDebt.name}
                  onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                  className="w-full bg-transparent text-gray-100 font-medium focus:outline-none placeholder-gray-500"
                  placeholder="Debt name (e.g., Chase Credit Card)"
                  autoFocus
                />
                <select
                  value={newDebt.type}
                  onChange={(e) => setNewDebt({ ...newDebt, type: e.target.value })}
                  className="mt-1 text-sm text-gray-400 bg-transparent border-none focus:outline-none cursor-pointer"
                >
                  {DEBT_TYPES.map(type => (
                    <option key={type.id} value={type.id} className="bg-dark-700">
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">Balance</p>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">$</span>
                  <input
                    type="number"
                    value={newDebt.balance}
                    onChange={(e) => setNewDebt({ ...newDebt, balance: e.target.value })}
                    className="w-28 bg-dark-600/50 text-right text-lg font-mono font-semibold text-gray-100 rounded-lg px-3 py-2 border border-dark-500/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/30"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pl-12">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">APR:</span>
                <input
                  type="number"
                  value={newDebt.interestRate}
                  onChange={(e) => setNewDebt({ ...newDebt, interestRate: e.target.value })}
                  className="w-20 bg-dark-600/50 text-right text-sm font-mono text-gray-100 rounded-lg px-2 py-1.5 border border-dark-500/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/30"
                  placeholder="0"
                  min="0"
                  max="100"
                />
                <span className="text-gray-400">%</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Min. Payment:</span>
                <span className="text-gray-400">$</span>
                <input
                  type="number"
                  value={newDebt.minimumPayment}
                  onChange={(e) => setNewDebt({ ...newDebt, minimumPayment: e.target.value })}
                  className="w-24 bg-dark-600/50 text-right text-sm font-mono text-gray-100 rounded-lg px-2 py-1.5 border border-dark-500/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/30"
                  placeholder="0"
                  min="0"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-accent-teal">Extra:</span>
                <span className="text-gray-400">$</span>
                <input
                  type="number"
                  value={newDebt.extraPayment}
                  onChange={(e) => setNewDebt({ ...newDebt, extraPayment: e.target.value })}
                  className="w-24 bg-accent-teal/10 text-right text-sm font-mono text-accent-teal rounded-lg px-2 py-1.5 border border-accent-teal/30 focus:outline-none focus:ring-2 focus:ring-accent-teal/30"
                  placeholder="0"
                  min="0"
                />
              </div>
              
              <div className="flex-1" />
              
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded-lg bg-accent-teal text-white font-medium hover:bg-accent-teal/90 transition-colors"
              >
                Add Debt
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewDebt({ name: '', type: 'credit_card', balance: '', interestRate: '', minimumPayment: '', extraPayment: '' });
                }}
                className="px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {/* Add Button */}
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-dark-600/50 text-gray-400 hover:border-accent-teal/50 hover:text-accent-teal transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Debt
          </button>
        )}
      </div>
    </div>
  );
};

export default DebtsSection;
