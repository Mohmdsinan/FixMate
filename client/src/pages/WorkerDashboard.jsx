import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Calendar,
  Upload,
  CheckCircle2,
  XCircle,
  PlayCircle,
  CheckCheck,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Save,
  MessageSquare
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookingStatusBadge from '../components/BookingStatusBadge';
import RatingStars from '../components/RatingStars';

const WorkerDashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');

  // Profile Form State
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    profession: '',
    experience_years: 0,
    description: '',
    service_area: '',
    price_min: '',
    price_max: '',
    is_available: true,
    is_verified: false,
    profile_photo_url: '',
    rating_avg: 0,
    rating_count: 0
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const fetchProfile = async () => {
    try {
      const [wRes, catRes] = await Promise.all([
        api.get(`/workers/${user.id}`),
        api.get('/categories')
      ]);
      const data = wRes.data;
      setProfile({
        name: data.name || '',
        phone: data.phone || '',
        profession: data.profession || '',
        experience_years: data.experience_years || 0,
        description: data.description || '',
        service_area: data.service_area || '',
        price_min: data.price_min || '',
        price_max: data.price_max || '',
        is_available: Boolean(data.is_available),
        is_verified: Boolean(data.is_verified),
        profile_photo_url: data.profile_photo_url || '',
        rating_avg: data.rating_avg || 0,
        rating_count: data.rating_count || 0
      });
      setCategories(catRes.data || []);
      setSelectedCategoryIds((data.categories || []).map((c) => c.id));
    } catch (err) {
      console.error('Failed to load worker profile:', err);
    }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await api.get('/workers/me/bookings');
      setBookings(res.data || []);
    } catch (err) {
      console.error('Error fetching worker bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await api.get(`/workers/${user.id}/reviews`);
      setReviews(res.data || []);
    } catch (err) {
      console.error('Error fetching worker reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchBookings();
    fetchReviews();
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setUploadingPhoto(true);
    try {
      const res = await api.post('/workers/me/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile((prev) => ({ ...prev, profile_photo_url: res.data.profile_photo_url }));
      setProfileMsg({ type: 'success', text: 'Photo updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.error || 'Photo upload failed' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const payload = {
        ...profile,
        categoryIds: selectedCategoryIds
      };
      const res = await api.put('/workers/me', payload);
      updateUser({ name: res.data.name });
      setProfileMsg({ type: 'success', text: 'Worker profile saved successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.error || 'Failed to save profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const toggleAvailability = async () => {
    const newStatus = !profile.is_available;
    setProfile((prev) => ({ ...prev, is_available: newStatus }));
    try {
      await api.put('/workers/me', { is_available: newStatus });
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const toggleCategory = (catId) => {
    if (selectedCategoryIds.includes(catId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== catId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, catId]);
    }
  };

  const defaultPhoto =
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F6F8FB]">
      {/* Worker Header Card */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center space-x-5">
          <img
            src={profile.profile_photo_url || defaultPhoto}
            alt={profile.name}
            className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="font-heading font-bold text-2xl text-[#1B225B]">{profile.name}</h1>
              {profile.is_verified ? (
                <span className="inline-flex items-center space-x-1 text-xs font-heading font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck size={14} />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="text-xs font-heading text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Verification Pending
                </span>
              )}
            </div>
            <p className="font-body text-xs font-semibold text-[#39A8C7]">{profile.profession || 'Technician'}</p>
            <div className="flex items-center space-x-2 text-xs font-body text-gray-500">
              <RatingStars rating={profile.rating_avg} count={profile.rating_count} size={14} />
              <span className="font-heading font-bold text-amber-500">{Number(profile.rating_avg).toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Availability Toggle & Tabs */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Availability Button */}
          <button
            onClick={toggleAvailability}
            className={`px-4 py-2.5 rounded-lg border text-xs font-heading font-semibold transition-all flex items-center justify-center space-x-2 ${
              profile.is_available
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
            }`}
          >
            {profile.is_available ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
            <span>{profile.is_available ? 'Status: Accepting Jobs' : 'Status: Off Duty'}</span>
          </button>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 bg-[#F6F8FB] p-1.5 rounded-lg border border-gray-200">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-[#1B225B] text-white shadow-sm'
                  : 'text-[#1B225B] hover:bg-gray-100'
              }`}
            >
              Bookings ({bookings.filter((b) => b.status === 'pending').length} new)
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#1B225B] text-white shadow-sm'
                  : 'text-[#1B225B] hover:bg-gray-100'
              }`}
            >
              My Profile
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all ${
                activeTab === 'reviews'
                  ? 'bg-[#1B225B] text-white shadow-sm'
                  : 'text-[#1B225B] hover:bg-gray-100'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <h2 className="font-heading font-bold text-xl text-[#1B225B]">Incoming Client Bookings</h2>

          {loadingBookings ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center space-y-3 border border-gray-200/80 shadow-sm">
              <Calendar size={36} className="text-gray-400 mx-auto" />
              <h3 className="font-heading font-bold text-lg text-[#1B225B]">No incoming bookings yet</h3>
              <p className="font-body text-xs text-gray-500">
                Ensure your profile details and availability are turned ON to receive requests.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <BookingStatusBadge status={b.status} />
                      <span className="font-body text-xs text-gray-500 font-semibold">
                        Service Category: <span className="text-[#39A8C7]">{b.category_name || 'General'}</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading font-bold text-lg text-[#1B225B]">{b.customer_name}</h4>
                      <p className="font-body text-xs text-gray-500">
                        Phone: <span className="text-[#1B225B] font-medium">{b.customer_phone || 'N/A'}</span> • Email: {b.customer_email}
                      </p>
                    </div>

                    <div className="space-y-1 font-body text-xs text-[#222222]">
                      <p><span className="font-semibold text-gray-500">Scheduled Date:</span> {b.date} at {b.time}</p>
                      <p><span className="font-semibold text-gray-500">Address:</span> {b.address}</p>
                      {b.notes && (
                        <p className="bg-[#F6F8FB] p-2.5 rounded-lg border border-gray-200 mt-2">
                          <span className="font-semibold text-[#39A8C7]">Client Notes:</span> {b.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Worker Action Workflow Buttons */}
                  <div className="flex flex-wrap md:flex-col items-end justify-end gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'accepted')}
                          className="px-5 py-2 rounded-lg bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-xs transition-colors shadow-sm flex items-center space-x-1.5"
                        >
                          <CheckCircle2 size={16} />
                          <span>Accept Request</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'rejected')}
                          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-heading font-semibold text-xs transition-colors shadow-sm flex items-center space-x-1.5"
                        >
                          <XCircle size={16} />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {b.status === 'accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'in_progress')}
                        className="px-5 py-2 rounded-lg bg-[#1B225B] hover:bg-[#151a47] text-white font-heading font-semibold text-xs transition-colors shadow-sm flex items-center space-x-1.5"
                      >
                        <PlayCircle size={16} />
                        <span>Start Work (In Progress)</span>
                      </button>
                    )}

                    {b.status === 'in_progress' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'completed')}
                        className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-semibold text-xs transition-colors shadow-sm flex items-center space-x-1.5"
                      >
                        <CheckCheck size={16} />
                        <span>Mark Work Completed</span>
                      </button>
                    )}

                    {b.status === 'completed' && (
                      <span className="font-heading text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold">
                        ✓ Service Delivered
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white p-8 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="font-heading font-bold text-xl text-[#1B225B] flex items-center space-x-2">
            <Briefcase size={20} className="text-[#39A8C7]" />
            <span>Manage Worker Profile & Specialties</span>
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

          {/* Photo Upload Section */}
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-[#F6F8FB] border border-gray-200">
            <img
              src={profile.profile_photo_url || defaultPhoto}
              alt={profile.name}
              className="w-16 h-16 rounded-lg object-cover border border-gray-200"
            />
            <div className="space-y-1">
              <p className="font-body text-xs font-semibold text-[#1B225B]">Profile Photo</p>
              <label className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 text-xs font-heading font-semibold text-[#1B225B] cursor-pointer border border-gray-200 transition-colors shadow-sm">
                <Upload size={14} />
                <span>{uploadingPhoto ? 'Uploading...' : 'Upload New Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-xs font-medium text-[#222222] mb-1">Profession Title</label>
                <input
                  type="text"
                  value={profile.profession}
                  onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                  placeholder="Master Electrician"
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-[#222222] mb-1">Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  value={profile.experience_years}
                  onChange={(e) => setProfile({ ...profile, experience_years: e.target.value })}
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-xs font-medium text-[#222222] mb-2">Service Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-heading font-semibold border transition-all ${
                        isSelected
                          ? 'bg-[#39A8C7] text-white border-[#39A8C7]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-body text-xs font-medium text-[#222222] mb-1">Min Rate ($/hr)</label>
                <input
                  type="number"
                  step="0.01"
                  value={profile.price_min}
                  onChange={(e) => setProfile({ ...profile, price_min: e.target.value })}
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-[#222222] mb-1">Max Rate ($/hr)</label>
                <input
                  type="number"
                  step="0.01"
                  value={profile.price_max}
                  onChange={(e) => setProfile({ ...profile, price_max: e.target.value })}
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-[#222222] mb-1">Service Area</label>
                <input
                  type="text"
                  value={profile.service_area}
                  onChange={(e) => setProfile({ ...profile, service_area: e.target.value })}
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-xs font-medium text-[#222222] mb-1">Description & Bio</label>
              <textarea
                rows={4}
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg p-3 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-8 py-2.5 rounded-lg bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-xs transition-colors shadow-sm flex items-center space-x-2 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="bg-white p-8 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-heading font-bold text-xl text-[#1B225B] flex items-center space-x-2">
                <MessageSquare size={20} className="text-amber-500" />
                <span>My Client Ratings & Reviews</span>
              </h2>
              <p className="font-body text-xs text-gray-500">Read-only view of feedback left by your customers</p>
            </div>
            <div className="text-right">
              <p className="font-heading font-bold text-2xl text-amber-500">
                {Number(profile.rating_avg).toFixed(1)} ★
              </p>
              <p className="font-body text-xs text-gray-500">{reviews.length} total reviews</p>
            </div>
          </div>

          {loadingReviews ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 font-body text-xs text-gray-400 italic">
              No reviews recorded yet for your account.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-lg bg-[#F6F8FB] border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#1B225B]">{r.customer_name}</span>
                    <span className="font-body text-[11px] text-gray-400">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <RatingStars rating={r.rating} size={14} />
                  {r.review_text && (
                    <p className="font-body text-xs text-[#222222] leading-relaxed">{r.review_text}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
