import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const NewBookingPage = () => {
  const { workerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);

    const fetchData = async () => {
      setLoading(true);
      try {
        const [wRes, catRes, meRes] = await Promise.all([
          api.get(`/workers/${workerId}`),
          api.get('/categories'),
          api.get('/customers/me')
        ]);
        setWorker(wRes.data);
        setCategories(catRes.data || []);
        if (meRes.data && meRes.data.address) {
          setAddress(meRes.data.address);
        }
      } catch (err) {
        console.error('Failed to load booking page info:', err);
        setError('Worker info could not be retrieved');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [workerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!date || !time || !address.trim()) {
      setError('Date, time, and service address are required');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/bookings', {
        worker_id: workerId,
        category_id: categoryId || null,
        date,
        time,
        address: address.trim(),
        notes: notes.trim() || null
      });

      navigate('/dashboard/customer');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit booking request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4 animate-pulse bg-[#F6F8FB]">
        <div className="h-40 bg-white rounded-xl"></div>
        <div className="h-80 bg-white rounded-xl"></div>
      </div>
    );
  }

  const defaultPhoto =
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F6F8FB]">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-3xl text-[#1B225B] mb-1">Book Service Appointment</h1>
        <p className="font-body text-xs text-gray-500">Fill in appointment details to send a direct request to the worker</p>
      </div>

      {/* Worker Summary Box */}
      {worker && (
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <img
            src={worker.profile_photo_url || defaultPhoto}
            alt={worker.name}
            className="w-16 h-16 rounded-xl object-cover border border-gray-200"
          />
          <div>
            <h3 className="font-heading font-bold text-lg text-[#1B225B]">{worker.name}</h3>
            <p className="font-body text-xs text-[#39A8C7] font-semibold">{worker.profession}</p>
            <p className="font-body text-xs text-gray-500 mt-0.5">
              Rate: {worker.price_min ? `$${worker.price_min}/hr` : 'Standard Rate'} • {worker.service_area || 'Local'}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 font-body text-xs flex items-center space-x-2">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
        {/* Category Picker */}
        <div>
          <label className="block font-body text-xs font-medium text-[#222222] mb-1.5">Select Service Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
          >
            <option value="">General Service Request</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-xs font-medium text-[#222222] mb-1.5">Appointment Date *</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
              />
            </div>
          </div>

          <div>
            <label className="block font-body text-xs font-medium text-[#222222] mb-1.5">Preferred Time *</label>
            <div className="relative">
              <Clock size={18} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block font-body text-xs font-medium text-[#222222] mb-1.5">Service Address *</label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main Street, Apt 4B"
              className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block font-body text-xs font-medium text-[#222222] mb-1.5">Notes or Issue Description</label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the job (e.g., Kitchen sink leaking under the pipe...)"
            className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg p-3 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <Link
            to={`/workers/${workerId}`}
            className="px-5 py-2.5 rounded-lg border border-[#1B225B] text-[#1B225B] hover:bg-[#1B225B]/5 font-heading font-semibold text-xs transition-colors"
          >
            ← Back to Profile
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-lg bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-xs transition-colors shadow-sm flex items-center space-x-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Sending Request...' : 'Confirm & Request Booking'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBookingPage;
