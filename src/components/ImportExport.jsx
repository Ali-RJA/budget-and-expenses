import React, { useRef, useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { Download, Upload, RotateCcw, Check, AlertCircle } from 'lucide-react';

const ImportExport = () => {
  const { exportData, importData, resetData } = useBudget();
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      await importData(file);
      setStatus({ type: 'success', message: 'Data imported successfully!' });
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to import data' });
      setTimeout(() => setStatus(null), 5000);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleReset = () => {
    resetData();
    setShowConfirmReset(false);
    setStatus({ type: 'success', message: 'Data reset to defaults' });
    setTimeout(() => setStatus(null), 3000);
  };
  
  return (
    <div className="flex items-center gap-2">
      {/* Status message */}
      {status && (
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm animate-fade-in ${
            status.type === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {status.type === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {status.message}
        </div>
      )}
      
      {/* Import button */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-700/50 border border-dark-600/50 text-gray-400 hover:text-gray-200 hover:bg-dark-600/50 transition-all duration-200 text-sm"
        title="Import from JSON"
      >
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline">Import</span>
      </button>
      
      {/* Export button */}
      <button
        onClick={exportData}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-700/50 border border-dark-600/50 text-gray-400 hover:text-gray-200 hover:bg-dark-600/50 transition-all duration-200 text-sm"
        title="Export to JSON"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
      </button>
      
      {/* Reset button */}
      <div className="relative">
        <button
          onClick={() => setShowConfirmReset(true)}
          className="p-2 rounded-xl bg-dark-700/50 border border-dark-600/50 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all duration-200"
          title="Reset to defaults"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        
        {/* Confirm reset modal */}
        {showConfirmReset && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowConfirmReset(false)}
            />
            <div className="absolute right-0 top-full mt-2 z-50 w-64 p-4 rounded-xl bg-dark-700 border border-dark-500 shadow-2xl animate-slide-up">
              <p className="text-sm text-gray-300 mb-3">
                Reset all data to defaults? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 px-3 py-2 rounded-lg bg-dark-600 text-gray-300 hover:bg-dark-500 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImportExport;

