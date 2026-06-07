import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, LogOut, LayoutDashboard, LogIn, UserPlus, Home, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-50 w-full border-b border-white/10 px-4 sm:px-6 py-4 shadow-lg backdrop-blur-md">
      <div className="max-w-[92vw] 2xl:max-w-[1536px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-white hover:opacity-90 transition-opacity">
          <div className="bg-primary-500 p-2 rounded-xl text-white shadow-lg shadow-primary-500/30">
            <Link2 className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-bold text-2xl tracking-wider bg-gradient-to-r from-white via-slate-100 to-primary-400 bg-clip-text text-transparent font-sans">
            SnapCut
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`flex items-center space-x-1 font-medium text-sm transition-colors ${
              isActive('/') ? 'text-primary-400' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>

          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-1 font-medium text-sm transition-colors ${
                  isActive('/dashboard') ? 'text-primary-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              
              <div className="h-4 w-px bg-white/10" />

              <span className="text-slate-400 text-sm font-medium">
                Hi, <span className="text-slate-200">{user.firstName || 'User'}</span>
              </span>

              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors font-medium text-sm bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors font-medium text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>

              <Link 
                to="/register" 
                className="flex items-center space-x-1 bg-primary-600 hover:bg-primary-500 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-lg shadow-primary-600/25 transition-all duration-300 hover:scale-[1.02]"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-300 hover:text-white focus:outline-none p-1"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col space-y-3 animate-fadeIn">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center space-x-2 font-medium text-sm py-2 px-3 rounded-lg transition-colors ${
              isActive('/') ? 'bg-primary-500/10 text-primary-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>

          {user ? (
            <>
              <Link 
                to="/dashboard" 
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 font-medium text-sm py-2.5 px-3 rounded-lg transition-colors ${
                  isActive('/dashboard') ? 'bg-primary-500/10 text-primary-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              
              <div className="px-3 text-slate-400 text-xs font-semibold uppercase tracking-wider py-1 border-t border-white/5 mt-1">
                Hi, <span className="text-slate-200 normal-case">{user.firstName || 'User'}</span>
              </div>

              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors font-medium text-sm bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg border border-red-500/20 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-slate-300 hover:bg-white/5 hover:text-white transition-colors font-medium text-sm py-2 px-3 rounded-lg"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>

              <Link 
                to="/register" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-primary-600/25 transition-all duration-300"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
