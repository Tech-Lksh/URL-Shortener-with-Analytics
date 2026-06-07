import React from 'react';
import { KeyRound } from 'lucide-react';

const VerifyEmailForm = ({
  token,
  setToken
}) => {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Verification/Reset Token</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <KeyRound className="w-4 h-4" />
          </div>
          <input
            type="text"
            required
            placeholder="Paste your development/email token here"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="block w-full pl-9 pr-3 py-2.5 bg-dark-800/80 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500 text-sm font-mono"
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailForm;
