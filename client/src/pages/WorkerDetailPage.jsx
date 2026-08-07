import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Briefcase,
  Calendar,
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react';
import api from '../api/axios';
import RatingStars from '../components/RatingStars';
import { useAuth } from '../context/AuthContext';

const WorkerDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkerData = async () => {
      setLoading(true);
      try {
        const [wRes, rRes] = await Promise.all([
          api.get(`/workers/${id}`),
          api.get(`/workers/${id}/reviews`)
        ]);
        setWorker(wRes.data);
        setReviews(rRes.data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Worker profile not found');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkerData();
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/login/customer');
    } else {
      navigate(`/booking/new/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6 animate-pulse bg-[#F6F8FB]">
        <div className="h-48 bg-white rounded-xl"></div>
        <div className="h-64 bg-white rounded-xl"></div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-heading font-bold text-2xl text-[#1B225B]">Worker Profile Unavailable</h2>
        <p className="font-body text-xs text-gray-500">{error || 'Unable to locate this profile.'}</p>
        <Link
          to="/workers"
          className="inline-block px-6 py-2.5 bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-xs rounded-lg"
        >
          Back to Workers Grid
        </Link>
      </div>
    );
  }

  const defaultPhoto =
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F6F8FB]">
      {/* Header Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-sm relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <img
                src={worker.profile_photo_url || defaultPhoto}
                alt={worker.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border-2 border-slate-100 shadow-md"
              />
              {worker.is_available ? (
                <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-heading font-bold text-[10px] uppercase tracking-wider border-2 border-white">
                  Available
                </span>
              ) : (
                <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-gray-400 text-white font-heading font-bold text-[10px] uppercase tracking-wider border-2 border-white">
                  Off Duty
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#1B225B]">{worker.name}</h1>
                {worker.is_verified ? (
                  <span className="inline-flex items-center space-x-1 text-xs font-heading font-semibold px-3 py-1 rounded-full bg-[#39A8C7]/10 text-[#39A8C7] border border-[#39A8C7]/20">
                    <ShieldCheck size={16} />
                    <span>Verified Pro</span>
                  </span>
                ) : (
                  <span className="text-xs font-heading font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Verification Pending
                  </span>
                )}
              </div>

              <p className="font-body text-sm font-semibold text-[#39A8C7]">{worker.profession || 'Technician'}</p>

              {/* Rating */}
              <div className="flex items-center space-x-2 pt-1">
                <RatingStars rating={worker.rating_avg} count={worker.rating_count} size={18} />
                <span className="font-heading font-bold text-sm text-amber-500">
                  {Number(worker.rating_avg || 0).toFixed(1)}
                </span>
                <span className="font-body text-xs text-gray-400">({worker.rating_count || 0} reviews)</span>
              </div>
            </div>
          </div>

          {/* Booking CTA */}
          <div className="w-full sm:w-auto flex flex-col items-stretch sm:items-end space-y-3">
            <div className="text-left sm:text-right">
              <p className="font-body text-xs text-gray-400">Standard Service Rate</p>
              <p className="font-heading font-bold text-2xl text-[#1B225B]">
                {worker.price_min && worker.price_max
                  ? `$${worker.price_min} - $${worker.price_max}`
                  : worker.price_min
                  ? `$${worker.price_min}`
                  : 'Contact for quote'}{' '}
                <span className="font-body text-xs text-gray-500 font-normal">/ hr</span>
              </p>
            </div>

            <button
              onClick={handleBookNow}
              className="px-8 py-3 rounded-lg bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-sm transition-colors shadow-sm flex items-center justify-center space-x-2"
            >
              <Calendar size={18} />
              <span>Book Appointment Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#1B225B]">About Professional</h3>
            <p className="font-body text-xs text-[#222222] leading-relaxed whitespace-pre-line">
              {worker.description || 'No detailed bio provided yet by the worker.'}
            </p>

            {/* Categories */}
            {worker.categories && worker.categories.length > 0 && (
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <h4 className="font-heading font-bold text-xs text-gray-400 uppercase tracking-wider">
                  Service Specialties
                </h4>
                <div className="flex flex-wrap gap-2">
                  {worker.categories.map((c) => (
                    <span
                      key={c.id}
                      className="px-3 py-1 rounded-full bg-[#F6F8FB] text-[#1B225B] border border-gray-200 text-xs font-body font-medium"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-heading font-bold text-lg text-[#1B225B] flex items-center space-x-2">
                <MessageSquare size={20} className="text-[#39A8C7]" />
                <span>Verified Customer Reviews</span>
              </h3>
              <span className="font-body text-xs text-gray-500 font-semibold">{reviews.length} reviews</span>
            </div>

            {reviews.length === 0 ? (
              <p className="font-body text-xs text-gray-400 italic">
                No reviews recorded yet. Be the first to book and leave feedback!
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-lg bg-[#F6F8FB] border border-gray-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs text-[#1B225B]">{rev.customer_name}</span>
                      <span className="font-body text-[11px] text-gray-400">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <RatingStars rating={rev.rating} size={14} />
                    {rev.review_text && (
                      <p className="font-body text-xs text-[#222222] leading-relaxed">{rev.review_text}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-[#1B225B] border-b border-gray-100 pb-3">
              Worker Credentials
            </h3>

            <div className="space-y-3 font-body text-xs text-[#222222]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#F6F8FB] flex items-center justify-center text-gray-500 shrink-0">
                  <Briefcase size={16} />
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Experience</p>
                  <p className="font-bold text-[#1B225B]">{worker.experience_years || 0} Years</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#F6F8FB] flex items-center justify-center text-gray-500 shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Service Area</p>
                  <p className="font-bold text-[#1B225B]">{worker.service_area || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#F6F8FB] flex items-center justify-center text-gray-500 shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Phone</p>
                  <p className="font-bold text-[#1B225B]">{worker.phone || 'Available upon booking'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#F6F8FB] flex items-center justify-center text-gray-500 shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Email</p>
                  <p className="font-bold text-[#1B225B]">{worker.email}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleBookNow}
                className="w-full py-2.5 rounded-lg bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-xs transition-colors shadow-sm"
              >
                Proceed to Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetailPage;
