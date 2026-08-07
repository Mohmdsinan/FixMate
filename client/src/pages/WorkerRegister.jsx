import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Mail, Lock, User, Phone, MapPin, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const WorkerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    profession: '',
    experience_years: '',
    description: '',
    service_area: '',
    price_min: '',
    price_max: ''
  });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCategory = (catId) => {
    if (selectedCategoryIds.includes(catId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== catId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, catId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        categoryIds: selectedCategoryIds
      };
      const res = await api.post('/auth/worker/register', payload);
      login(res.data.token, res.data.user);
      navigate('/dashboard/worker');
    } catch (err) {
      setError(err.response?.data?.error || 'Worker registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F6F8FB]">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#1B225B]/10 text-[#1B225B] flex items-center justify-center mx-auto">
            <Briefcase size={24} />
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#1B225B]">Join FixMate as a Worker</h1>
          <p className="font-body text-xs text-gray-500">
            Build your profile, get verified by admins, and receive client bookings
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-body flex items-center space-x-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-xs text-[#39A8C7] uppercase tracking-wider">Account & Personal Info</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="Alex Morgan"
                    className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                  />
                </div>
              </div>

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
                    placeholder="alex@fixmate.com"
                    className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
          </div>

          {/* Professional Details */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-heading font-bold text-xs text-[#39A8C7] uppercase tracking-wider">Professional Profile</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-xs font-medium text-[#222222] mb-1">Profession Title</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="Master Plumber & Pipe Fitter"
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-[#222222] mb-1">Experience (Years)</label>
                <input
                  type="number"
                  name="experience_years"
                  min="0"
                  max="50"
                  value={formData.experience_years}
                  onChange={handleChange}
                  placeholder="5"
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>
            </div>

            {/* Select Categories */}
            <div>
              <label className="block font-body text-xs font-medium text-[#222222] mb-2">Select Primary Service Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-heading font-semibold border transition-all flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-[#39A8C7] text-white border-[#39A8C7]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {isSelected && <Check size={14} />}
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-body text-xs font-medium text-[#222222] mb-1">Service Area / Operating Region</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  name="service_area"
                  value={formData.service_area}
                  onChange={handleChange}
                  placeholder="Metro City, Downtown & Suburbs"
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-xs font-medium text-[#222222] mb-1">Min Rate ($/hr)</label>
                <input
                  type="number"
                  name="price_min"
                  step="0.01"
                  value={formData.price_min}
                  onChange={handleChange}
                  placeholder="35.00"
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-[#222222] mb-1">Max Rate ($/hr)</label>
                <input
                  type="number"
                  name="price_max"
                  step="0.01"
                  value={formData.price_max}
                  onChange={handleChange}
                  placeholder="100.00"
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-xs font-medium text-[#222222] mb-1">Professional Bio & Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your expertise, certifications, background, and equipment..."
                className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg p-3 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-lg bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-xs transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Submitting registration...' : 'Complete Worker Registration'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100 text-xs font-body text-gray-500">
          Already registered as a worker?{' '}
          <Link to="/login/worker" className="text-[#39A8C7] font-semibold hover:underline">
            Sign In to Worker Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkerRegister;
