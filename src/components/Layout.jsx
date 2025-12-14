import React from 'react';
import { useBudget } from '../context/BudgetContext';
import TabNavigation from './TabNavigation';
import Dashboard from './Dashboard';
import IncomeSection from './IncomeSection';
import ExpensesSection from './ExpensesSection';
import DebtsSection from './DebtsSection';
import GoalsSection from './GoalsSection';
import ImportExport from './ImportExport';
import { Moon, Sun, Wallet } from 'lucide-react';

const Layout = () => {
  const { activeTab, theme, toggleTheme, activeScenario, setActiveScenario } = useBudget();
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'income':
        return <IncomeSection />;
      case 'expenses':
        return <ExpensesSection />;
      case 'debts':
        return <DebtsSection />;
      case 'goals':
        return <GoalsSection />;
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <div className="min-h-screen bg-mesh-gradient">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent-emerald/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-accent-cyan/10 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-dark-600/50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-accent-teal to-accent-emerald shadow-lg shadow-accent-teal/20">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold gradient-text">Budget Dashboard</h1>
                <p className="text-xs text-gray-500">Take control of your finances</p>
              </div>
            </div>
            
            {/* Scenario Toggle */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-dark-700/50 border border-dark-600/50">
              <button
                onClick={() => setActiveScenario('current')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeScenario === 'current'
                    ? 'bg-gradient-to-r from-accent-teal to-accent-emerald text-white shadow-lg shadow-accent-teal/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-600/50'
                }`}
              >
                Current Reality
              </button>
              <button
                onClick={() => setActiveScenario('plan')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeScenario === 'plan'
                    ? 'bg-gradient-to-r from-accent-teal to-accent-emerald text-white shadow-lg shadow-accent-teal/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-600/50'
                }`}
              >
                Plan Budget
              </button>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <ImportExport />
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-dark-700/50 border border-dark-600/50 text-gray-400 hover:text-gray-200 hover:bg-dark-600/50 transition-all duration-200"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Tab Navigation */}
      <TabNavigation />
      
      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-dark-600/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Auto-saved to browser • Export to save permanently
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

