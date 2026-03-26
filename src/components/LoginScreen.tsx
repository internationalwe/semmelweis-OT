import React, { useState } from 'react';
import { useTestStore } from '../store/useTestStore';
import { BookOpen, AlertCircle } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, register } = useTestStore();
  const [isLoginView, setIsLoginView] = useState(true);
  
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoginView) {
      if (!id || !password) return setError('Please enter ID and password.');
      const success = login(id, password);
      if (!success) setError('Invalid ID or password.');
    } else {
      if (!id || !password || !name) return setError('Please fill in all fields.');
      if (id.length < 3) return setError('ID must be at least 3 characters.');
      const success = register(id, password, name);
      if (!success) setError('User ID already exists. Try another.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/30">
          <BookOpen size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">OnTest Pro</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isLoginView ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-gray-500 mt-2">
            {isLoginView ? 'Sign in to manage your tests.' : 'Get started by creating a local account.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-bold flex items-center gap-2 border border-red-100">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Teacher Tom"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">User ID</label>
            <input 
              type="text" 
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. admin or user1"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 mt-4"
          >
            {isLoginView ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-gray-500 text-sm">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => { setIsLoginView(!isLoginView); setError(''); setPassword(''); }} 
              className="text-blue-600 font-bold ml-2 hover:underline"
            >
              {isLoginView ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>

        {/* Prototype helper */}
        <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-500">
          <p className="font-bold text-gray-700 mb-1">Prototype Default Admin Account:</p>
          <p>ID: <span className="font-mono bg-white px-1 border border-gray-200 rounded">admin</span> | Password: <span className="font-mono bg-white px-1 border border-gray-200 rounded">admin</span></p>
        </div>
      </div>
    </div>
  );
};
