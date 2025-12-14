import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Receipt, 
  CreditCard, 
  Target 
} from 'lucide-react';

const tabs = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'income', name: 'Income', icon: TrendingUp },
  { id: 'expenses', name: 'Expenses', icon: Receipt },
  { id: 'debts', name: 'Debts', icon: CreditCard },
  { id: 'goals', name: 'Goals', icon: Target },
];

const TabNavigation = ({ onTabChange }) => {
  const { activeTab, setActiveTab } = useBudget();
  
  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setActiveTab(tabId);
    }
  };
  
  return (
    <div className="relative z-10 border-b border-dark-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-1 overflow-x-auto py-2 scrollbar-hide" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-dark-700/80 text-accent-teal border border-accent-teal/30 shadow-lg shadow-accent-teal/5'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700/50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-accent-teal' : ''}`} />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
