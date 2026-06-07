import React from 'react';
import { User, Mail, Lock } from 'lucide-react';

const RegisterForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  passwordConfirm,
  setPasswordConfirm
}) => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">First Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="block w-full pl-9 pr-3 py-2.5 bg-dark-800/80 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Last Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="block w-full pl-9 pr-3 py-2.5 bg-dark-800/80 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-9 pr-3 py-2.5 bg-dark-800/80 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Lock className="w-4 h-4" />
          </div>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-9 pr-3 py-2.5 bg-dark-800/80 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Confirm Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Lock className="w-4 h-4" />
          </div>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="block w-full pl-9 pr-3 py-2.5 bg-dark-800/80 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
