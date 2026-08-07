import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Shield, ChevronDown, Menu, X, LayoutDashboard, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Official FixMate Brand Logo */}
          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-heading font-semibold text-sm transition-colors ${
                isActive('/') ? 'text-[#39A8C7]' : 'text-[#1B225B] hover:text-[#39A8C7]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/workers"
              className={`font-heading font-semibold text-sm transition-colors ${
                isActive('/workers') ? 'text-[#39A8C7]' : 'text-[#1B225B] hover:text-[#39A8C7]'
              }`}
            >
              Services / Workers
            </Link>

            {user && (
              <>
                {user.role === 'customer' && (
                  <Link
                    to="/dashboard/customer"
                    className={`font-heading font-semibold text-sm flex items-center space-x-1.5 transition-colors ${
                      isActive('/dashboard/customer') ? 'text-[#39A8C7]' : 'text-[#1B225B] hover:text-[#39A8C7]'
                    }`}
                  >
                    <LayoutDashboard size={16} />
                    <span>My Dashboard</span>
                  </Link>
                )}

                {user.role === 'worker' && (
                  <Link
                    to="/dashboard/worker"
                    className={`font-heading font-semibold text-sm flex items-center space-x-1.5 transition-colors ${
                      isActive('/dashboard/worker') ? 'text-[#39A8C7]' : 'text-[#1B225B] hover:text-[#39A8C7]'
                    }`}
                  >
                    <Briefcase size={16} />
                    <span>Worker Dashboard</span>
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/dashboard/admin"
                    className={`font-heading font-semibold text-sm flex items-center space-x-1.5 text-purple-700 hover:text-purple-900 transition-colors`}
                  >
                    <Shield size={16} />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2.5 bg-[#F6F8FB] px-3.5 py-1.5 rounded-full border border-gray-200">
                  <div className="w-7 h-7 rounded-full bg-[#1B225B] flex items-center justify-center text-white text-xs font-heading font-bold uppercase">
                    {user.name ? user.name[0] : user.username ? user.username[0] : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-heading font-bold text-[#1B225B] leading-tight">
                      {user.name || user.username}
                    </p>
                    <p className="text-[10px] text-[#39A8C7] font-body capitalize">{user.role}</p>
                  </div>
                </div>

                <Link
                  to={user.role === 'customer' ? '/dashboard/customer' : user.role === 'worker' ? '/dashboard/worker' : '/dashboard/admin'}
                  className="bg-[#39A8C7] hover:bg-[#3195b1] text-white rounded-full px-5 py-2 font-heading font-semibold text-sm transition-colors shadow-sm"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2.5 rounded-full bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                    className="px-4 py-2 text-sm font-heading font-semibold text-[#1B225B] hover:text-[#39A8C7] flex items-center space-x-1 transition-colors"
                  >
                    <span>Sign In</span>
                    <ChevronDown size={14} />
                  </button>

                  {authDropdownOpen && (
                    <div
                      onClick={() => setAuthDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-100 shadow-xl py-2 z-50 animate-fade-in"
                    >
                      <div className="px-4 py-1.5 border-b border-gray-100">
                        <p className="text-[11px] font-heading font-bold text-gray-400 uppercase tracking-wider">
                          Customer
                        </p>
                      </div>
                      <Link
                        to="/login/customer"
                        className="block px-4 py-2 text-xs font-body text-[#222222] hover:bg-[#F6F8FB] hover:text-[#39A8C7]"
                      >
                        Customer Login
                      </Link>
                      <Link
                        to="/register/customer"
                        className="block px-4 py-2 text-xs font-body text-[#222222] hover:bg-[#F6F8FB] hover:text-[#39A8C7]"
                      >
                        Customer Register
                      </Link>

                      <div className="px-4 py-1.5 border-t border-b border-gray-100 mt-1">
                        <p className="text-[11px] font-heading font-bold text-gray-400 uppercase tracking-wider">
                          Worker
                        </p>
                      </div>
                      <Link
                        to="/login/worker"
                        className="block px-4 py-2 text-xs font-body text-[#222222] hover:bg-[#F6F8FB] hover:text-[#39A8C7]"
                      >
                        Worker Login
                      </Link>
                      <Link
                        to="/register/worker"
                        className="block px-4 py-2 text-xs font-body text-[#222222] hover:bg-[#F6F8FB] hover:text-[#39A8C7]"
                      >
                        Join as Worker
                      </Link>

                      <div className="border-t border-gray-100 mt-1">
                        <Link
                          to="/login/admin"
                          className="block px-4 py-2 text-[11px] font-body text-gray-400 hover:text-purple-700"
                        >
                          Admin Portal
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/workers"
                  className="bg-[#39A8C7] hover:bg-[#3195b1] text-white rounded-full px-5 py-2 font-heading font-semibold text-sm transition-colors shadow-sm"
                >
                  Book a Service
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1B225B] hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-heading font-semibold text-[#1B225B]"
          >
            Home
          </Link>
          <Link
            to="/workers"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-heading font-semibold text-[#1B225B]"
          >
            Services / Browse Workers
          </Link>

          {user ? (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              {user.role === 'customer' && (
                <Link
                  to="/dashboard/customer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 font-heading font-semibold text-[#39A8C7]"
                >
                  Customer Dashboard
                </Link>
              )}
              {user.role === 'worker' && (
                <Link
                  to="/dashboard/worker"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 font-heading font-semibold text-[#39A8C7]"
                >
                  Worker Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/dashboard/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 font-heading font-semibold text-purple-700"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 font-heading font-semibold text-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <Link
                to="/workers"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 bg-[#39A8C7] text-white font-heading font-semibold rounded-full"
              >
                Book a Service
              </Link>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login/customer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 bg-gray-100 text-[#1B225B] font-heading font-semibold text-xs rounded-lg"
                >
                  Customer Sign In
                </Link>
                <Link
                  to="/login/worker"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 bg-gray-100 text-[#1B225B] font-heading font-semibold text-xs rounded-lg"
                >
                  Worker Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
