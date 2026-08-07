import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, PhoneCall } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-[#1B225B] text-white font-body mt-20 border-t border-[#1B225B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" showTagline={true} onDark={true} />
            <p className="text-xs leading-relaxed text-gray-300">
              Reliable help right when you need it. Connecting homeowners and businesses with verified local skilled workers.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#39A8C7] font-heading font-semibold">
              <ShieldCheck size={16} />
              <span>100% Verified Skilled Workers</span>
            </div>
          </div>


          {/* Services */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link to="/workers" className="hover:text-[#39A8C7] transition-colors">
                  Browse All Workers
                </Link>
              </li>
              <li>
                <Link to="/workers?category=Plumbing" className="hover:text-[#39A8C7] transition-colors">
                  Plumbing Services
                </Link>
              </li>
              <li>
                <Link to="/workers?category=Electrical" className="hover:text-[#39A8C7] transition-colors">
                  Electrical Repair
                </Link>
              </li>
              <li>
                <Link to="/workers?category=Painting" className="hover:text-[#39A8C7] transition-colors">
                  Painting & Finishing
                </Link>
              </li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link to="/login/customer" className="hover:text-[#39A8C7] transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link to="/register/customer" className="hover:text-[#39A8C7] transition-colors">
                  Customer Registration
                </Link>
              </li>
              <li>
                <Link to="/register/worker" className="hover:text-[#39A8C7] transition-colors">
                  Become a FixMate Worker
                </Link>
              </li>
              <li>
                <Link to="/login/worker" className="hover:text-[#39A8C7] transition-colors">
                  Worker Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Fast Support
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Book online in seconds. Verified professionals arrive on schedule.
            </p>
            <div className="flex items-center space-x-2 text-xs text-white bg-white/10 p-3 rounded-xl border border-white/10">
              <PhoneCall size={14} className="text-[#39A8C7]" />
              <span>24/7 Verified Service Guarantee</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} FIXMATE. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Crafted for high-speed local service delivery</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
