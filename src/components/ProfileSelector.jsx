import React, { useState, useEffect } from 'react';
import { User, Plus, LogIn, Lock, Trash2, X, AlertCircle, Check, Users } from 'lucide-react';

const API_BASE = '/api';

const ProfileSelector = ({ onProfileLoad, currentProfile, onLogout, embedded = false }) => {
  const [profiles, setProfiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('select'); // 'select', 'login', 'create', 'delete'
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', pin: '', confirmPin: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch profiles on mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch(`${API_BASE}/profiles`);
      const data = await res.json();
      setProfiles(data);
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/profiles/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedProfile.name, pin: formData.pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      onProfileLoad(data);
      setIsOpen(false);
      resetForm();
    } catch (err) {
      setError('Connection error');
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.pin !== formData.confirmPin) {
      setError('PINs do not match');
      return;
    }

    if (formData.pin.length < 4 || formData.pin.length > 6) {
      setError('PIN must be 4-6 digits');
      return;
    }

    if (!/^\d+$/.test(formData.pin)) {
      setError('PIN must be numbers only');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, pin: formData.pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create profile');
        setLoading(false);
        return;
      }

      onProfileLoad(data);
      fetchProfiles();
      setIsOpen(false);
      resetForm();
    } catch (err) {
      setError('Connection error');
    }
    setLoading(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/profiles/${selectedProfile._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: formData.pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to delete profile');
        setLoading(false);
        return;
      }

      if (currentProfile?._id === selectedProfile._id) {
        onLogout();
      }
      fetchProfiles();
      setMode('select');
      resetForm();
    } catch (err) {
      setError('Connection error');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ name: '', pin: '', confirmPin: '' });
    setError('');
    setSelectedProfile(null);
    setMode('select');
  };

  const openModal = () => {
    resetForm();
    setIsOpen(true);
  };

  // Embedded mode content (for login screen)
  const renderContent = () => (
    <>
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Select Mode */}
      {mode === 'select' && (
        <div className="space-y-3">
          {profiles.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {profiles.map((profile) => (
                <button
                  key={profile._id}
                  onClick={() => {
                    setSelectedProfile(profile);
                    setMode('login');
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                    currentProfile?._id === profile._id
                      ? 'bg-accent-teal/20 border-accent-teal/50 text-accent-teal'
                      : 'bg-dark-700/50 border-dark-600/50 text-gray-200 hover:border-dark-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    <span className="font-medium">{profile.name}</span>
                  </div>
                  {currentProfile?._id === profile._id && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No profiles yet</p>
              <p className="text-sm text-gray-500">Create one to get started</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setMode('create')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-teal text-white font-medium hover:bg-accent-teal/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Profile
            </button>
            {profiles.length > 0 && (
              <button
                onClick={() => setMode('delete')}
                className="px-4 py-2.5 rounded-xl bg-dark-700 text-red-400 border border-dark-600 hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Login Mode */}
      {mode === 'login' && selectedProfile && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-center py-2">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-accent-teal/20 flex items-center justify-center">
              <User className="w-8 h-8 text-accent-teal" />
            </div>
            <p className="text-lg font-medium text-gray-100">{selectedProfile.name}</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Enter PIN</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-700 border border-dark-600 text-gray-100 text-center text-xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal/50"
                placeholder="••••"
                autoFocus
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-2.5 rounded-xl bg-dark-700 text-gray-300 border border-dark-600 hover:bg-dark-600 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || formData.pin.length < 4}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-teal text-white font-medium hover:bg-accent-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : (
                <>
                  <LogIn className="w-4 h-4" />
                  Login
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Create Mode */}
      {mode === 'create' && (
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Profile Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-dark-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal/50"
              placeholder="e.g., My Budget"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Create PIN (4-6 digits)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-700 border border-dark-600 text-gray-100 text-center text-xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal/50"
                placeholder="••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Confirm PIN</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={formData.confirmPin}
                onChange={(e) => setFormData({ ...formData, confirmPin: e.target.value.replace(/\D/g, '') })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-700 border border-dark-600 text-gray-100 text-center text-xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal/50"
                placeholder="••••"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-2.5 rounded-xl bg-dark-700 text-gray-300 border border-dark-600 hover:bg-dark-600 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name || formData.pin.length < 4}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-teal text-white font-medium hover:bg-accent-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : (
                <>
                  <Plus className="w-4 h-4" />
                  Create
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Delete Mode */}
      {mode === 'delete' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Select a profile to delete:</p>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {profiles.map((profile) => (
              <button
                key={profile._id}
                onClick={() => setSelectedProfile(profile)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                  selectedProfile?._id === profile._id
                    ? 'bg-red-500/20 border-red-500/50 text-red-400'
                    : 'bg-dark-700/50 border-dark-600/50 text-gray-200 hover:border-dark-500'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">{profile.name}</span>
              </button>
            ))}
          </div>

          {selectedProfile && (
            <form onSubmit={handleDelete} className="space-y-4 pt-2 border-t border-dark-600">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-red-400">
                  This will permanently delete <strong>{selectedProfile.name}</strong> and all its data.
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Enter PIN to confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-700 border border-dark-600 text-gray-100 text-center text-xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50"
                    placeholder="••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || formData.pin.length < 4}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Profile
                  </>
                )}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={resetForm}
            className="w-full px-4 py-2.5 rounded-xl bg-dark-700 text-gray-300 border border-dark-600 hover:bg-dark-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );

  // Embedded mode - render directly without modal
  if (embedded) {
    return renderContent();
  }

  return (
    <>
      {/* Profile Button */}
      <button
        onClick={openModal}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-700/50 border border-dark-600/50 text-gray-300 hover:text-gray-100 hover:bg-dark-600/50 transition-all duration-200"
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium max-w-[120px] truncate">
          {currentProfile ? currentProfile.name : 'Select Profile'}
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-dark-600">
              <h2 className="text-lg font-display font-semibold text-gray-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent-teal" />
                {mode === 'select' && 'Select Profile'}
                {mode === 'login' && 'Enter PIN'}
                {mode === 'create' && 'Create Profile'}
                {mode === 'delete' && 'Delete Profile'}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-dark-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              {renderContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSelector;

