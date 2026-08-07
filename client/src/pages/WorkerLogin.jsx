import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Briefcase, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const WorkerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/auth/worker/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard/worker');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#F6F8FB]">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#1B225B]/10 text-[#1B225B] flex items-center justify-center mx-auto">
            <Briefcase size={24} />
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#1B225B]">Worker Portal Login</h1>
          <p className="font-body text-xs text-gray-500">Sign in to manage your profile and incoming client bookings</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-body flex items-center space-x-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-body text-xs font-medium text-[#222222] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.plumbing@fixmate.com"
                className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
              />
            </div>
          </div>

          <div>
            <label className="block font-body text-xs font-medium text-[#222222] mb-1.5">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-lg bg-[#1B225B] hover:bg-[#151a47] text-white font-heading font-semibold text-xs transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Signing in...' : 'Sign In as Worker'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100 text-xs font-body text-gray-500 space-y-2">
          <p>
            New skilled technician?{' '}
            <Link to="/register/worker" className="text-[#39A8C7] font-semibold hover:underline">
              Join FixMate Network
            </Link>
          </p>
          <p>
            Looking for a service?{' '}
            <Link to="/login/customer" className="text-[#1B225B] font-semibold hover:underline">
              Customer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;
