import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { GOAL_TYPES } from '../utils/constants';
import { 
  calculateGoalProgress,
  calculateMonthsToGoal,
  calculateTotalGoalContributions,
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
  Shield,
  CheckCircle,
  Plane,
  Home,
  Car,
  Sunset,
  GraduationCap,
  TrendingUp,
  Target,
  Calendar,
  Sparkles
} from 'lucide-react';

const iconMap = {
  Shield,
  CheckCircle,
  Plane,
  Home,
  Car,
  Sunset,
  GraduationCap,
  TrendingUp,
  Target,
};

// Sortable Goal Item Component
const SortableGoalItem = ({ item, onUpdate, onDelete, getIcon, getColor }) => {
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
  
  const progress = calculateGoalProgress(item.currentAmount, item.targetAmount);
  const monthsToGoal = calculateMonthsToGoal(item.targetAmount, item.currentAmount, item.monthlyContribution);
  const remaining = Math.max(0, (item.targetAmount || 0) - (item.currentAmount || 0));
  const color = getColor(item.type);
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group p-4 rounded-xl bg-dark-800/60 border border-dark-600/50 hover:border-dark-500/50 transition-all duration-200 ${
        isDragging ? 'shadow-2xl shadow-accent-teal/20 border-accent-teal/50 z-50' : ''
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        {/* Drag Handle */}
        <button
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-dark-600/50 cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>
        
        {/* Icon */}
        <div 
          className="p-2.5 rounded-lg"
          style={{ backgroundColor: color + '20', color: color }}
        >
          {getIcon(item.type)}
        </div>
        
        {/* Name & Type */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={item.name}
            onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
            className="w-full bg-transparent text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-accent-teal/30 rounded px-2 py-1 -ml-2"
            placeholder="Goal name"
          />
          <select
            value={item.type}
            onChange={(e) => onUpdate(item.id, 'type', e.target.value)}
            className="mt-1 text-sm text-gray-400 bg-transparent border-none focus:outline-none cursor-pointer hover:text-gray-300"
          >
            {GOAL_TYPES.map(type => (
              <option key={type.id} value={type.id} className="bg-dark-700">
                {type.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Progress Badge */}
        <div 
          className="px-3 py-1.5 rounded-full text-sm font-medium"
          style={{ 
            backgroundColor: progress >= 100 ? '#10b98120' : color + '20', 
            color: progress >= 100 ? '#10b981' : color 
          }}
        >
          {progress >= 100 ? (
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Complete!
            </span>
          ) : (
            `${progress.toFixed(0)}%`
          )}
        </div>
        
        {/* Delete */}
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Delete goal"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4 ml-12">
        <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 progress-animated"
            style={{ 
              width: `${Math.min(100, progress)}%`,
              backgroundColor: progress >= 100 ? '#10b981' : color,
            }}
          />
        </div>
      </div>
      
      {/* Details Row */}
      <div className="flex flex-wrap items-center gap-4 ml-12">
        {/* Current Amount */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Saved:</span>
          <div className="flex items-center">
            <span className="text-gray-400">$</span>
            <input
              type="number"
              value={item.currentAmount || ''}
              onChange={(e) => onUpdate(item.id, 'currentAmount', e.target.value)}
              className="w-28 bg-dark-700/50 text-right text-sm font-mono text-green-400 rounded-lg px-2 py-1.5 border border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/30"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        {/* Target Amount */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Target:</span>
          <div className="flex items-center">
            <span className="text-gray-400">$</span>
            <input
              type="number"
              value={item.targetAmount || ''}
              onChange={(e) => onUpdate(item.id, 'targetAmount', e.target.value)}
              className="w-28 bg-dark-700/50 text-right text-sm font-mono text-gray-100 rounded-lg px-2 py-1.5 border border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/30"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        {/* Monthly Contribution */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-accent-teal">Monthly:</span>
          <div className="flex items-center">
            <span className="text-gray-400">$</span>
            <input
              type="number"
              value={item.monthlyContribution || ''}
              onChange={(e) => onUpdate(item.id, 'monthlyContribution', e.target.value)}
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
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Remaining:</span>
            <span className="font-mono text-gray-100">{formatCurrency(remaining)}</span>
          </div>
          
          {progress < 100 && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" style={{ color }} />
              <span style={{ color }} className="font-medium">{formatMonths(monthsToGoal)}</span>
              <span className="text-gray-500">to reach goal</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GoalsSection = () => {
  const { currentScenario, addGoal, updateGoal, deleteGoal, reorderGoals } = useBudget();
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ 
    name: '', 
    type: 'other', 
    targetAmount: '', 
    currentAmount: '', 
    monthlyContribution: '' 
  });
  
  const sortedGoals = [...currentScenario.goals].sort((a, b) => a.order - b.order);
  const totalContributions = calculateTotalGoalContributions(currentScenario.goals);
  const completedGoals = currentScenario.goals.filter(g => 
    calculateGoalProgress(g.currentAmount, g.targetAmount) >= 100
  ).length;
  
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
      const oldIndex = sortedGoals.findIndex(g => g.id === active.id);
      const newIndex = sortedGoals.findIndex(g => g.id === over.id);
      
      const newOrder = arrayMove(sortedGoals, oldIndex, newIndex);
      reorderGoals(newOrder);
    }
  };
  
  const handleAdd = () => {
    if (newGoal.name && newGoal.targetAmount) {
      addGoal({
        name: newGoal.name,
        type: newGoal.type,
        targetAmount: parseFloat(newGoal.targetAmount) || 0,
        currentAmount: parseFloat(newGoal.currentAmount) || 0,
        monthlyContribution: parseFloat(newGoal.monthlyContribution) || 0,
      });
      setNewGoal({ name: '', type: 'other', targetAmount: '', currentAmount: '', monthlyContribution: '' });
      setIsAdding(false);
    }
  };
  
  const handleUpdate = (id, field, value) => {
    const item = currentScenario.goals.find(i => i.id === id);
    if (item) {
      const numericFields = ['targetAmount', 'currentAmount', 'monthlyContribution'];
      updateGoal({
        ...item,
        [field]: numericFields.includes(field) ? (parseFloat(value) || 0) : value,
      });
    }
  };
  
  const getIcon = (type) => {
    const goalType = GOAL_TYPES.find(t => t.id === type);
    const IconComponent = iconMap[goalType?.icon] || Target;
    return <IconComponent className="w-5 h-5" />;
  };
  
  const getColor = (type) => {
    const goalType = GOAL_TYPES.find(t => t.id === type);
    return goalType?.color || '#64748b';
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-100">Savings Goals</h2>
          <p className="text-gray-400 text-sm mt-1">Drag to reorder by priority</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-gray-400">Completed</p>
            <p className="text-lg font-mono font-semibold text-green-400">
              {completedGoals}/{currentScenario.goals.length}
            </p>
          </div>
          <div className="text-right pl-4 border-l border-dark-600">
            <p className="text-sm text-gray-400">Monthly Contributions</p>
            <p className="text-2xl font-mono font-bold gradient-text">{formatCurrency(totalContributions)}</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-accent-teal/20 to-accent-emerald/20 border border-accent-teal/30">
            <Sparkles className="w-8 h-8 text-accent-teal" />
          </div>
        </div>
      </div>
      
      {/* Info Card */}
      {sortedGoals.length > 1 && (
        <div className="p-4 rounded-xl bg-accent-teal/10 border border-accent-teal/30">
          <div className="flex items-start gap-3">
            <GripVertical className="w-5 h-5 text-accent-teal mt-0.5" />
            <div>
              <p className="text-accent-teal font-medium">Priority Order</p>
              <p className="text-gray-400 text-sm mt-1">
                Drag goals to reorder by importance. Focus on your top priorities first.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Goal List */}
      <div className="space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedGoals.map(g => g.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedGoals.map((item, index) => (
              <div key={item.id} className="relative">
                {index === 0 && sortedGoals.length > 1 && (
                  <div className="absolute -left-8 top-6 px-2 py-1 rounded bg-accent-teal/20 text-accent-teal text-xs font-medium">
                    #1
                  </div>
                )}
                <SortableGoalItem
                  item={item}
                  onUpdate={handleUpdate}
                  onDelete={deleteGoal}
                  getIcon={getIcon}
                  getColor={getColor}
                />
              </div>
            ))}
          </SortableContext>
        </DndContext>
        
        {/* Empty State */}
        {currentScenario.goals.length === 0 && !isAdding && (
          <div className="text-center py-12 rounded-xl border-2 border-dashed border-dark-600/50">
            <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No savings goals yet</p>
            <p className="text-gray-500 text-sm">Add goals to track your progress</p>
          </div>
        )}
        
        {/* Add New Form */}
        {isAdding && (
          <div className="p-4 rounded-xl bg-dark-700/60 border border-accent-teal/30 animate-slide-up space-y-4">
            <div className="flex items-center gap-4">
              <div 
                className="p-2.5 rounded-lg"
                style={{ backgroundColor: getColor(newGoal.type) + '20', color: getColor(newGoal.type) }}
              >
                {getIcon(newGoal.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full bg-transparent text-gray-100 font-medium focus:outline-none placeholder-gray-500"
                  placeholder="Goal name (e.g., Emergency Fund)"
                  autoFocus
                />
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                  className="mt-1 text-sm text-gray-400 bg-transparent border-none focus:outline-none cursor-pointer"
                >
                  {GOAL_TYPES.map(type => (
                    <option key={type.id} value={type.id} className="bg-dark-700">
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pl-12">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Currently Saved:</span>
                <span className="text-gray-400">$</span>
                <input
                  type="number"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                  className="w-28 bg-dark-600/50 text-right text-sm font-mono text-gray-100 rounded-lg px-2 py-1.5 border border-dark-500/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/30"
                  placeholder="0"
                  min="0"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Target:</span>
                <span className="text-gray-400">$</span>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  className="w-28 bg-dark-600/50 text-right text-sm font-mono text-gray-100 rounded-lg px-2 py-1.5 border border-dark-500/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/30"
                  placeholder="0"
                  min="0"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-accent-teal">Monthly:</span>
                <span className="text-gray-400">$</span>
                <input
                  type="number"
                  value={newGoal.monthlyContribution}
                  onChange={(e) => setNewGoal({ ...newGoal, monthlyContribution: e.target.value })}
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
                Add Goal
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewGoal({ name: '', type: 'other', targetAmount: '', currentAmount: '', monthlyContribution: '' });
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
            Add Goal
          </button>
        )}
      </div>
    </div>
  );
};

export default GoalsSection;

