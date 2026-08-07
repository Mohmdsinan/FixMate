import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Briefcase, DollarSign, ArrowRight } from 'lucide-react';
import RatingStars from './RatingStars';

const WorkerCard = ({ worker }) => {
  const defaultPhoto =
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between space-x-4 mb-4">
          <div className="relative">
            <img
              src={worker.profile_photo_url || defaultPhoto}
              alt={worker.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-slate-100 group-hover:border-[#39A8C7] transition-colors"
            />
            {worker.is_available ? (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Available now"></span>
            ) : (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 border-2 border-white rounded-full" title="Currently unavailable"></span>
            )}
          </div>

          <div className="flex flex-col items-end">
            {worker.is_verified ? (
              <span className="inline-flex items-center space-x-1 text-xs font-heading font-semibold px-2.5 py-1 rounded-full bg-[#39A8C7]/10 text-[#39A8C7] border border-[#39A8C7]/20">
                <ShieldCheck size={14} />
                <span>Verified</span>
              </span>
            ) : (
              <span className="text-[11px] font-heading font-semibold text-gray-500 px-2.5 py-0.5 rounded-full bg-[#F6F8FB] border border-gray-200">
                Unverified
              </span>
            )}
          </div>
        </div>

        {/* Worker Info */}
        <h3 className="font-heading font-bold text-lg text-[#1B225B] group-hover:text-[#39A8C7] transition-colors">
          {worker.name}
        </h3>
        <p className="font-body text-sm text-[#39A8C7] font-semibold mb-2">
          {worker.profession || 'Skilled Professional'}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-4">
          <RatingStars rating={worker.rating_avg} count={worker.rating_count} />
          <span className="text-sm font-heading font-bold text-amber-500">
            {Number(worker.rating_avg || 0).toFixed(1)}
          </span>
        </div>

        {/* Details Grid */}
        <div className="space-y-2 text-xs font-body text-[#222222] mb-6">
          <div className="flex items-center space-x-2">
            <Briefcase size={14} className="text-gray-400" />
            <span>{worker.experience_years || 0} years experience</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin size={14} className="text-gray-400" />
            <span className="truncate">{worker.service_area || 'Local Region'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign size={14} className="text-[#39A8C7]" />
            <span className="font-semibold text-[#1B225B]">
              {worker.price_min && worker.price_max
                ? `$${worker.price_min} - $${worker.price_max} / hr`
                : worker.price_min
                ? `From $${worker.price_min} / hr`
                : 'Rates on request'}
            </span>
          </div>
        </div>

        {/* Categories Tags */}
        {worker.categories && worker.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {worker.categories.slice(0, 3).map((cat) => (
              <span
                key={cat.id}
                className="text-[11px] font-body px-2.5 py-0.5 rounded-full bg-[#F6F8FB] text-[#1B225B] font-medium border border-gray-200"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <Link
        to={`/workers/${worker.id}`}
        className="w-full py-2.5 px-4 rounded-lg bg-[#39A8C7] hover:bg-[#3195b1] text-white font-heading font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 group/btn shadow-sm"
      >
        <span>View Profile & Book</span>
        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default WorkerCard;
