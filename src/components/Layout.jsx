import React from 'react';
import { useBudget } from '../context/BudgetContext';
import TabNavigation from './TabNavigation';
import Dashboard from './Dashboard';
import IncomeSection from './IncomeSection';
import ExpensesSection from './ExpensesSection';
import DebtsSection from './DebtsSection';
import GoalsSection from './GoalsSection';
import ImportExport from './ImportExport';
import ProfileSelector from './ProfileSelector';
import { Moon, Sun, Wallet, LogOut, Cloud, User } from 'lucide-react';

const Layout = () => {
  const { 
    activeTab, 
    theme, 
    toggleTheme, 
    activeScenario, 
    setActiveScenario,
    profile,
    loadProfile,
    logout,
  } = useBudget();
  
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
  
  // Show login screen if no profile is selected
  if (!profile) {
    return (
      <div className="min-h-screen bg-mesh-gradient flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent-emerald/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-accent-cyan/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-accent-teal to-accent-emerald shadow-lg shadow-accent-teal/20 mb-4">
              <Wallet className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold gradient-text">Budget Dashboard</h1>
            <p className="text-gray-400 mt-2">Take control of your finances</p>
          </div>
          
          {/* Profile Selection Card */}
          <div className="bg-dark-800/80 backdrop-blur-xl border border-dark-600/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-accent-teal" />
              <h2 className="text-xl font-display font-semibold text-gray-100">Select Profile</h2>
            </div>
            
            <ProfileSelector 
              onProfileLoad={loadProfile}
              currentProfile={profile}
              onLogout={logout}
              embedded={true}
            />
          </div>
          
          {/* Theme Toggle */}
          <div className="text-center mt-6">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800/50 border border-dark-600/50 text-gray-400 hover:text-gray-200 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
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
              {/* Profile indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent-teal/10 border border-accent-teal/30 text-accent-teal">
                <Cloud className="w-4 h-4" />
                <span className="text-sm font-medium max-w-[100px] truncate">{profile.name}</span>
              </div>
              
              <ImportExport />
              
              <ProfileSelector 
                onProfileLoad={loadProfile}
                currentProfile={profile}
                onLogout={logout}
              />
              
              <button
                onClick={logout}
                className="p-2.5 rounded-xl bg-dark-700/50 border border-dark-600/50 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all duration-200"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
              
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
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Cloud className="w-4 h-4 text-accent-teal" />
            <span>Auto-saved to cloud</span>
            <span className="text-gray-600">•</span>
            <span>Profile: {profile.name}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
