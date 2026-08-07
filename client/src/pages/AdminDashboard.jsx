import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, Trash2, Plus } from 'lucide-react';
import api from '../api/axios';
import BookingStatusBadge from '../components/BookingStatusBadge';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');

  // Pending Workers
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);

  // All Users
  const [customers, setCustomers] = useState([]);
  const [workers, setWorkers] = useState([]);

  // All Bookings
  const [allBookings, setAllBookings] = useState([]);

  // Categories Management
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Wrench');
  const [catMsg, setCatMsg] = useState('');

  const fetchPendingWorkers = async () => {
    setLoadingPending(true);
    try {
      const res = await api.get('/admin/workers/pending');
      setPendingWorkers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPending(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setCustomers(res.data.customers || []);
      setWorkers(res.data.workers || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/admin/bookings');
      setAllBookings(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingWorkers();
    fetchUsers();
    fetchBookings();
    fetchCategories();
  }, []);

  const handleVerifyWorker = async (workerId) => {
    try {
      await api.put(`/admin/workers/${workerId}/verify`, { is_verified: true });
      fetchPendingWorkers();
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to verify worker');
    }
  };

  const handleToggleSuspend = async (userId, role, currentSuspendedState) => {
    const action = currentSuspendedState ? 'unsuspend' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await api.put(`/admin/users/${userId}/suspend`, {
        role,
        is_suspended: !currentSuspendedState
      });
      fetchUsers();
      fetchPendingWorkers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user suspension state');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCatMsg('');
    if (!newCatName.trim()) return;

    try {
      await api.post('/categories', { name: newCatName.trim(), icon: newCatIcon });
      setNewCatName('');
      setCatMsg('Category added successfully!');
      fetchCategories();
    } catch (err) {
      setCatMsg(err.response?.data?.error || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${catId}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete category');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F6F8FB]">
      {/* Admin Control Header */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-[#1B225B] text-white font-bold text-2xl flex items-center justify-center">
            <ShieldCheck size={30} />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#1B225B]">FixMate Admin Portal</h1>
            <p className="font-body text-xs text-gray-500">System oversight, worker verification, and category management</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-1 bg-[#F6F8FB] p-1.5 rounded-lg border border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all whitespace-nowrap ${
              activeTab === 'pending'
                ? 'bg-[#1B225B] text-white shadow-sm'
                : 'text-[#1B225B] hover:bg-gray-100'
            }`}
          >
            Pending Workers ({pendingWorkers.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-[#1B225B] text-white shadow-sm'
                : 'text-[#1B225B] hover:bg-gray-100'
            }`}
          >
            All Users ({customers.length + workers.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-[#1B225B] text-white shadow-sm'
                : 'text-[#1B225B] hover:bg-gray-100'
            }`}
          >
            All Bookings ({allBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-[#1B225B] text-white shadow-sm'
                : 'text-[#1B225B] hover:bg-gray-100'
            }`}
          >
            Manage Categories
          </button>
        </div>
      </div>

      {/* Pending Workers Tab */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          <h2 className="font-heading font-bold text-xl text-[#1B225B]">Workers Awaiting Verification</h2>

          {loadingPending ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
              ))}
            </div>
          ) : pendingWorkers.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center space-y-2 border border-gray-200/80 shadow-sm">
              <CheckCircle size={36} className="text-emerald-600 mx-auto" />
              <h3 className="font-heading font-bold text-lg text-[#1B225B]">All workers verified!</h3>
              <p className="font-body text-xs text-gray-500">There are no pending worker verification requests at this moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingWorkers.map((w) => (
                <div
                  key={w.id}
                  className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start space-x-4">
                    {w.profile_photo_url ? (
                      <img
                        src={w.profile_photo_url}
                        alt={w.name}
                        className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-[#1B225B] font-bold shrink-0">
                        {w.name[0]}
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-heading font-bold text-lg text-[#1B225B]">{w.name}</h4>
                        <span className="text-[11px] font-heading font-semibold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200">
                          Unverified
                        </span>
                      </div>
                      <p className="font-body text-xs font-semibold text-[#39A8C7]">{w.profession || 'Worker'}</p>
                      <p className="font-body text-xs text-gray-500">
                        Email: {w.email} • Phone: {w.phone || 'N/A'} • Exp: {w.experience_years} yrs
                      </p>
                      <p className="font-body text-xs text-gray-600 mt-1">{w.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleVerifyWorker(w.id)}
                    className="px-6 py-2.5 rounded-lg bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-xs transition-colors shadow-sm flex items-center space-x-1.5 shrink-0"
                  >
                    <ShieldCheck size={16} />
                    <span>Approve & Verify</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-8">
          {/* Customers Table */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#1B225B]">Registered Customers ({customers.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-body">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-heading">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F6F8FB] text-[#222222]">
                      <td className="py-3 px-4 font-bold text-[#1B225B]">{c.name}</td>
                      <td className="py-3 px-4">{c.email}</td>
                      <td className="py-3 px-4">{c.phone || '—'}</td>
                      <td className="py-3 px-4 max-w-xs truncate">{c.address || '—'}</td>
                      <td className="py-3 px-4">
                        {c.is_suspended ? (
                          <span className="text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            Suspended
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleSuspend(c.id, 'customer', c.is_suspended)}
                          className={`px-3 py-1 rounded-lg font-heading font-semibold text-[11px] transition-colors ${
                            c.is_suspended
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          {c.is_suspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Workers Table */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#1B225B]">Registered Workers ({workers.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-body">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-heading">
                    <th className="py-3 px-4">Worker Name</th>
                    <th className="py-3 px-4">Profession</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Verified</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {workers.map((w) => (
                    <tr key={w.id} className="hover:bg-[#F6F8FB] text-[#222222]">
                      <td className="py-3 px-4 font-bold text-[#1B225B]">{w.name}</td>
                      <td className="py-3 px-4 text-[#39A8C7] font-semibold">{w.profession || 'N/A'}</td>
                      <td className="py-3 px-4">{w.email}</td>
                      <td className="py-3 px-4 text-amber-600 font-bold">{w.rating_avg || '0.0'} ★</td>
                      <td className="py-3 px-4">
                        {w.is_verified ? (
                          <span className="text-[#39A8C7] font-semibold">Yes</span>
                        ) : (
                          <span className="text-amber-600">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {w.is_suspended ? (
                          <span className="text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            Suspended
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleSuspend(w.id, 'worker', w.is_suspended)}
                          className={`px-3 py-1 rounded-lg font-heading font-semibold text-[11px] transition-colors ${
                            w.is_suspended
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          {w.is_suspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* All Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="font-heading font-bold text-lg text-[#1B225B]">All Marketplace Bookings ({allBookings.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-body">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-heading">
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Worker</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F6F8FB] text-[#222222]">
                    <td className="py-3 px-4 font-mono text-gray-400">{b.id.substring(0, 8)}</td>
                    <td className="py-3 px-4 font-semibold text-[#1B225B]">{b.customer_name}</td>
                    <td className="py-3 px-4 font-semibold text-[#39A8C7]">{b.worker_name}</td>
                    <td className="py-3 px-4">{b.category_name || 'General'}</td>
                    <td className="py-3 px-4">{b.date} at {b.time}</td>
                    <td className="py-3 px-4">
                      <BookingStatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manage Categories Tab */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Category */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#1B225B]">Add New Category</h3>

            {catMsg && (
              <p className="font-body text-xs text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                {catMsg}
              </p>
            )}

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block font-body text-xs font-medium text-[#222222] mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Roofing Repair"
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-[#222222] mb-1">Icon Name</label>
                <input
                  type="text"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  placeholder="Wrench, Zap, Hammer, etc."
                  className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-xs transition-colors shadow-sm flex items-center justify-center space-x-2"
              >
                <Plus size={16} />
                <span>Create Category</span>
              </button>
            </form>
          </div>

          {/* Categories Grid List */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#1B225B]">Existing Categories ({categories.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-lg bg-[#F6F8FB] border border-gray-200 flex items-center justify-between"
                >
                  <div>
                    <p className="font-heading font-bold text-xs text-[#1B225B]">{c.name}</p>
                    <p className="font-body text-[10px] text-gray-500">Icon: {c.icon || 'Wrench'}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(c.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
