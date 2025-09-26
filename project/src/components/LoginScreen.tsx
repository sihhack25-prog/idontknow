import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Leaf, Mail, Lock, User, Shield, Loader2 } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'technician' | 'government'>('technician');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const roleEmail = selectedRole === 'technician' ? 'tech@campus.edu' : 'gov@ministry.gov';
    await login(roleEmail, password);
  };

  const demoCredentials = {
    technician: { email: 'tech@campus.edu', password: 'demo123' },
    government: { email: 'gov@ministry.gov', password: 'demo123' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-2xl w-fit mx-auto mb-4">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">EnergyFlow Pro</h1>
          <p className="text-gray-600">Smart Renewable Energy Monitoring</p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Select Your Role</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole('technician')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedRole === 'technician'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <User className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Campus Technician</div>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('government')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedRole === 'government'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <Shield className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Government Official</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                selectedRole === 'technician'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              } ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Technician:</strong> {demoCredentials.technician.email} / {demoCredentials.technician.password}</div>
              <div><strong>Government:</strong> {demoCredentials.government.email} / {demoCredentials.government.password}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail(demoCredentials[selectedRole].email);
                setPassword(demoCredentials[selectedRole].password);
              }}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Use Demo Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;