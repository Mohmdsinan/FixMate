import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/auth/customer/register', formData);
      login(res.data.token, res.data.user);
      navigate('/dashboard/customer');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F6F8FB]">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#39A8C7]/10 text-[#39A8C7] flex items-center justify-center mx-auto">
            <User size={24} />
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#1B225B]">Create Customer Account</h1>
          <p className="font-body text-xs text-gray-500">Join FixMate to find and book local skilled workers</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-body flex items-center space-x-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-body text-xs font-medium text-[#222222] mb-1">Full Name *</label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs font-medium text-[#222222] mb-1">Email Address *</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-xs font-medium text-[#222222] mb-1">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2831"
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-body text-xs font-medium text-[#222222] mb-1">Password *</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
              />
            </div>
          </div>

          <div>
            <label className="block font-body text-xs font-medium text-[#222222] mb-1">Default Address</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, Apartment 4B"
                className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-lg bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-xs transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100 text-xs font-body text-gray-500">
          Already have an account?{' '}
          <Link to="/login/customer" className="text-[#39A8C7] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
