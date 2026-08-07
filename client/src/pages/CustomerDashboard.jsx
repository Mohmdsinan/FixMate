import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Star, Edit3, Save, Ban } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookingStatusBadge from '../components/BookingStatusBadge';
import ReviewModal from '../components/ReviewModal';

const CustomerDashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState('all');
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  // Profile Form State
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await api.get('/customers/me/bookings');
      setBookings(res.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/customers/me');
      setProfile({
        name: res.data.name || '',
        phone: res.data.phone || '',
        address: res.data.address || ''
      });
    } catch (err) {
      console.error('Error fetching customer profile:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchProfile();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) return;
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await api.put('/customers/me', profile);
      updateUser({ name: res.data.name });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F6F8FB]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-[#1B225B] text-white font-heading font-bold text-xl flex items-center justify-center">
            {user?.name ? user.name[0] : 'C'}
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#1B225B]">Welcome back, {user?.name}!</h1>
            <p className="font-body text-xs text-gray-500">Manage your service appointments and profile details</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1.5 bg-[#F6F8FB] p-1.5 rounded-lg border border-gray-200">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'bg-[#1B225B] text-white shadow-sm'
                : 'text-[#1B225B] hover:bg-gray-100'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-[#1B225B] text-white shadow-sm'
                : 'text-[#1B225B] hover:bg-gray-100'
            }`}
          >
            Profile Settings
          </button>
        </div>
      </div>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Status Filter Buttons */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setBookingFilter(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold capitalize whitespace-nowrap border transition-all ${
                  bookingFilter === st
                    ? 'bg-[#39A8C7]/15 text-[#39A8C7] border-[#39A8C7]/30'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {loadingBookings ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center space-y-3 border border-gray-200/80 shadow-sm">
              <Calendar size={36} className="text-gray-400 mx-auto" />
              <h3 className="font-heading font-bold text-lg text-[#1B225B]">No bookings found</h3>
              <p className="font-body text-xs text-gray-500">
                You haven't requested any services under this status filter yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <BookingStatusBadge status={b.status} />
                      <span className="font-body text-xs text-gray-400 font-mono">
                        ID: {b.id.substring(0, 8)}
                      </span>
                    </div>

                    <div className="flex items-start space-x-4">
                      {b.worker_photo && (
                        <img
                          src={b.worker_photo}
                          alt={b.worker_name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                        />
                      )}
                      <div>
                        <h4 className="font-heading font-bold text-base text-[#1B225B]">{b.worker_name}</h4>
                        <p className="font-body text-xs text-[#39A8C7] font-semibold">
                          {b.worker_profession} • {b.category_name || 'Service'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 font-body text-xs text-[#222222]">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-[#39A8C7]" />
                        <span>Date: {b.date} at {b.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="truncate">Address: {b.address}</span>
                      </div>
                    </div>

                    {b.notes && (
                      <p className="font-body text-xs text-gray-600 bg-[#F6F8FB] p-2.5 rounded-lg border border-gray-200">
                        <span className="font-semibold text-[#1B225B]">Notes:</span> {b.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                    {(b.status === 'pending' || b.status === 'accepted') && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-heading font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-sm"
                      >
                        <Ban size={14} />
                        <span>Cancel Request</span>
                      </button>
                    )}

                    {b.status === 'completed' && !b.review_id && (
                      <button
                        onClick={() => setSelectedBookingForReview(b)}
                        className="px-5 py-2 rounded-lg bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-xs transition-colors shadow-sm flex items-center space-x-1.5"
                      >
                        <Star size={14} />
                        <span>Leave Review</span>
                      </button>
                    )}

                    {b.status === 'completed' && b.review_id && (
                      <div className="font-heading font-semibold text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center space-x-1">
                        <Star size={14} className="fill-amber-500" />
                        <span>Reviewed ({b.review_rating}★)</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Settings Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white p-8 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="font-heading font-bold text-xl text-[#1B225B] flex items-center space-x-2">
            <Edit3 size={20} className="text-[#39A8C7]" />
            <span>Edit Profile Details</span>
          </h2>

          {profileMsg.text && (
            <div
              className={`p-3 rounded-lg font-body text-xs font-semibold ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}
            >
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block font-body text-xs font-medium text-[#222222] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
              />
            </div>

            <div>
              <label className="block font-body text-xs font-medium text-[#222222] mb-1">Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
              />
            </div>

            <div>
              <label className="block font-body text-xs font-medium text-[#222222] mb-1">Default Address</label>
              <textarea
                rows={3}
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="Enter street, apartment, city..."
                className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg p-3 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-lg bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-xs transition-colors shadow-sm flex items-center space-x-2 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Updates'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          booking={selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          onSuccess={fetchBookings}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;
