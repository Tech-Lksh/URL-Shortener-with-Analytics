import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, QrCode, BarChart3 } from 'lucide-react';

const ShortenerResult = ({
  result,
  copied,
  handleCopy,
  user
}) => {
  if (!result) return null;

  return (
    <div className="mt-8 pt-6 border-t border-white/10 space-y-6 animate-slideUp relative z-10">
      <div className="flex flex-col md:flex-row items-center gap-4 bg-dark-800/80 p-4 border border-white/5 rounded-2xl justify-between">
        <div className="space-y-1 text-center md:text-left overflow-hidden w-full">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Your Short Link</p>
          <a
            href={result.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:underline font-bold text-lg block truncate"
          >
            {result.shortUrl}
          </a>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className={`flex items-center space-x-1.5 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all ${
              copied
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                : 'bg-dark-700 text-slate-200 hover:bg-dark-600 border border-white/10'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* QR Code & Direct Analytics */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-dark-800/40 border border-white/5 rounded-2xl justify-between">
        <div className="flex flex-col items-center sm:items-start space-y-2">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold text-sm">
            <QrCode className="w-4 h-4 text-primary-400" />
            <span>Scan QR Code</span>
          </div>
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Scan to directly visit or share the short link.
          </p>
          {user ? (
            <Link
              to={`/analytics/${result.shortCode}`}
              className="inline-flex items-center space-x-1.5 text-xs text-primary-400 hover:text-primary-300 font-bold mt-2"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>View Analytics Dashboard</span>
            </Link>
          ) : (
            <p className="text-[11px] text-slate-500 mt-2">
              <Link to="/login" className="text-primary-400 hover:underline">Login</Link> to view detailed click tracking.
            </p>
          )}
        </div>
        <div className="bg-white p-2 rounded-xl border border-white/10 shadow-lg">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
              result.shortUrl
            )}`}
            alt="Short Link QR Code"
            className="w-24 h-24 block"
          />
        </div>
      </div>
    </div>
  );
};

export default ShortenerResult;
