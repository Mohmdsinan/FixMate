import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, Users } from 'lucide-react';
import api from '../api/axios';
import WorkerCard from '../components/WorkerCard';

const WorkersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [available, setAvailable] = useState(searchParams.get('available') === 'true');

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (minRating) params.minRating = minRating;
      if (maxPrice) params.maxPrice = maxPrice;
      if (available) params.available = 'true';

      const res = await api.get('/workers', { params });
      setWorkers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch workers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
    const newParams = {};
    if (search) newParams.search = search;
    if (category) newParams.category = category;
    if (minRating) newParams.minRating = minRating;
    if (maxPrice) newParams.maxPrice = maxPrice;
    if (available) newParams.available = 'true';
    setSearchParams(newParams);
  }, [category, minRating, maxPrice, available]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchWorkers();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setMinRating('');
    setMaxPrice('');
    setAvailable(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F6F8FB]">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-heading font-bold text-[#39A8C7] uppercase tracking-wide">
          Direct Directory
        </span>
        <h1 className="font-heading font-bold text-3xl text-[#1B225B]">Find Skilled Local Workers</h1>
        <p className="font-body text-xs text-gray-500">
          Compare verified workers by experience, specialty category, pricing, and client reviews
        </p>
      </div>

      {/* Filter Toolbar & Search Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by worker name, skill, or service description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7] focus:border-[#39A8C7]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-heading font-semibold text-[#1B225B] mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-3 py-2 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Min Rating Dropdown */}
          <div>
            <label className="block text-xs font-heading font-semibold text-[#1B225B] mb-1">Min Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-3 py-2 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5★ & above</option>
              <option value="4.0">4.0★ & above</option>
              <option value="3.5">3.5★ & above</option>
            </select>
          </div>

          {/* Max Price Rate */}
          <div>
            <label className="block text-xs font-heading font-semibold text-[#1B225B] mb-1">Max Rate ($/hr)</label>
            <input
              type="number"
              placeholder="e.g. 100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg px-3 py-2 text-xs font-body text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#39A8C7]"
            />
          </div>

          {/* Availability Toggle & Reset */}
          <div className="flex items-end justify-between space-x-2">
            <label className="flex items-center space-x-2 cursor-pointer bg-[#F6F8FB] border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#222222] w-full font-body">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-[#39A8C7] focus:ring-[#39A8C7]"
              />
              <span className="font-medium">Available Only</span>
            </label>

            <button
              onClick={handleClearFilters}
              title="Reset all filters"
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 transition-colors shrink-0"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Workers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
          ))}
        </div>
      ) : workers.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center space-y-3 border border-gray-200/80 shadow-sm">
          <Users size={32} className="text-gray-400 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-[#1B225B]">No workers match your search</h3>
          <p className="font-body text-xs text-gray-500 max-w-sm mx-auto">
            Try broadening your category or price parameters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2 bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-xs rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkersPage;
