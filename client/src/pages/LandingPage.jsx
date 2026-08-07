import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Sparkles,
  Tv,
  Flower2,
  Bug,
  Camera,
  Home,
  ShieldCheck,
  Star,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import api from '../api/axios';
import WorkerCard from '../components/WorkerCard';

const categoryIcons = {
  Plumbing: Wrench,
  Electrical: Zap,
  Carpentry: Hammer,
  Painting: Paintbrush,
  Cleaning: Sparkles,
  'Appliance Repair': Tv,
  Gardening: Flower2,
  'Pest Control': Bug,
  'CCTV Installation': Camera,
  'Interior Works': Home
};

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredWorkers, setFeaturedWorkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, workerRes] = await Promise.all([
          api.get('/categories'),
          api.get('/workers')
        ]);
        setCategories(catRes.data || []);
        const workers = (workerRes.data || []).filter((w) => w.is_verified).slice(0, 3);
        setFeaturedWorkers(workers.length > 0 ? workers : (workerRes.data || []).slice(0, 3));
      } catch (err) {
        console.error('Landing page fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/workers?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/workers');
    }
  };

  return (
    <div className="space-y-20 pb-16 bg-[#F6F8FB]">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text & CTAs */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#39A8C7]/10 border border-[#39A8C7]/20">
                <ShieldCheck size={16} className="text-[#39A8C7]" />
                <span className="text-xs font-heading font-semibold uppercase tracking-wide text-[#39A8C7]">
                  Verified Local Technicians
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-[#1B225B] leading-tight">
                Reliable Help.{' '}
                <span className="text-[#39A8C7]">Right When You Need It.</span>
              </h1>

              <p className="font-body text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
                Connect with background-checked plumbers, electricians, carpenters, and cleaners in your neighborhood fast and easily.
              </p>

              {/* Two CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/workers"
                  className="bg-[#1B225B] hover:bg-[#151a47] text-white rounded-lg px-6 py-3.5 font-heading font-semibold text-sm transition-colors shadow-sm inline-flex items-center space-x-2"
                >
                  <span>Book a Service</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/workers"
                  className="border border-[#1B225B] text-[#1B225B] hover:bg-[#1B225B]/5 bg-transparent rounded-lg px-6 py-3.5 font-heading font-semibold text-sm transition-colors inline-flex items-center space-x-2"
                >
                  <span>Explore Services</span>
                </Link>
              </div>

              {/* Search Box */}
              <form
                onSubmit={handleSearchSubmit}
                className="mt-6 p-2 rounded-xl bg-[#F6F8FB] border border-gray-200 flex items-center gap-2 max-w-lg shadow-inner"
              >
                <Search className="text-gray-400 ml-3 shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="Search by skill e.g. Plumber, Electrician, Painter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-[#222222] font-body text-sm focus:outline-none placeholder-gray-400 py-2.5"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-xs rounded-lg transition-colors shrink-0"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Right Column: Uniformed Worker Graphic / Visual */}
            <div className="relative flex justify-center items-center">
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-[#39A8C7]/15 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative bg-gradient-to-tr from-[#1B225B] to-[#39A8C7] p-2.5 rounded-3xl shadow-xl max-w-md w-full">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80"
                  alt="Uniformed Service Worker"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl border border-white/20"
                />
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs text-[#1B225B]">Instant Dispatch</p>
                    <p className="font-body text-[11px] text-gray-500">Verified Pros Nearby</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-heading font-bold text-[#39A8C7] uppercase tracking-wide">
              Top Categories
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1B225B] mt-1">
              Browse Service Specialties
            </h2>
          </div>
          <Link
            to="/workers"
            className="mt-3 md:mt-0 font-heading font-semibold text-sm text-[#39A8C7] hover:underline flex items-center space-x-1"
          >
            <span>View all categories</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const IconComp = categoryIcons[cat.name] || Wrench;
            return (
              <Link
                key={cat.id}
                to={`/workers?category=${encodeURIComponent(cat.name)}`}
                className="bg-white rounded-xl p-5 border border-gray-200/80 hover:border-[#39A8C7] hover:shadow-md transition-all duration-200 group flex flex-col items-center text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F6F8FB] text-[#1B225B] flex items-center justify-center group-hover:bg-[#39A8C7] group-hover:text-white transition-all">
                  <IconComp size={22} />
                </div>
                <span className="font-heading font-semibold text-xs text-[#1B225B]">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-200/80 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-heading font-bold text-[#39A8C7] uppercase tracking-wide">
              Simple Workflow
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1B225B] mt-1">
              How FixMate Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1B225B] text-white font-heading font-bold text-base flex items-center justify-center mx-auto shadow-sm">
                1
              </div>
              <h3 className="font-heading font-bold text-[#1B225B] text-base">Select Service</h3>
              <p className="font-body text-xs text-gray-500 leading-relaxed">
                Filter workers by skill, rating, price rate, and real-time availability.
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[#39A8C7] text-white font-heading font-bold text-base flex items-center justify-center mx-auto shadow-sm">
                2
              </div>
              <h3 className="font-heading font-bold text-[#1B225B] text-base">Book Appointment</h3>
              <p className="font-body text-xs text-gray-500 leading-relaxed">
                Select your preferred date, time slot, and home address.
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1B225B] text-white font-heading font-bold text-base flex items-center justify-center mx-auto shadow-sm">
                3
              </div>
              <h3 className="font-heading font-bold text-[#1B225B] text-base">Service Delivered</h3>
              <p className="font-body text-xs text-gray-500 leading-relaxed">
                The technician arrives on schedule to perform the job efficiently.
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[#39A8C7] text-white font-heading font-bold text-base flex items-center justify-center mx-auto shadow-sm">
                4
              </div>
              <h3 className="font-heading font-bold text-[#1B225B] text-base">Rate & Review</h3>
              <p className="font-body text-xs text-gray-500 leading-relaxed">
                Leave a verified review to help keep service standards high.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Workers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-heading font-bold text-[#39A8C7] uppercase tracking-wide">
              Verified Professionals
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1B225B] mt-1">
              Featured Skilled Workers
            </h2>
          </div>
          <Link
            to="/workers"
            className="mt-3 md:mt-0 font-heading font-semibold text-sm text-[#39A8C7] hover:underline flex items-center space-x-1"
          >
            <span>Explore all workers</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white rounded-xl animate-pulse border border-gray-200"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        )}
      </section>

      {/* Join as Worker CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1B225B] rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg text-white">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs font-heading font-bold text-[#39A8C7] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              For Technicians & Workers
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl leading-tight">
              Expand your skilled worker business
            </h2>
            <p className="font-body text-xs sm:text-sm text-gray-300 leading-relaxed">
              Build your public profile, receive direct booking requests, and get verified by administrators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/register/worker"
              className="bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-sm px-6 py-3.5 rounded-lg text-center shadow-sm"
            >
              Join as Worker
            </Link>
            <Link
              to="/login/worker"
              className="border border-white/30 text-white font-heading font-semibold text-sm px-6 py-3.5 rounded-lg hover:bg-white/10 text-center"
            >
              Worker Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
