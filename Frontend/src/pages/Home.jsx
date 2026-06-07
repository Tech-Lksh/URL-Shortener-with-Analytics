import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import HeroHeader from '../components/home/HeroHeader';
import ShortenerForm from '../components/home/ShortenerForm';
import ShortenerResult from '../components/home/ShortenerResult';
import FeatureGrid from '../components/home/FeatureGrid';

const Home = () => {
  const { user } = useAuth();
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!originalUrl) return;

    setLoading(true);
    setError('');
    setResult(null);

    // Auto prepend https:// if protocol is missing
    let formattedUrl = originalUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      const payload = { originalUrl: formattedUrl };
      if (customAlias) {
        payload.customAlias = customAlias;
      }

      const response = await api.post('/shorten', payload);
      if (response.data.success) {
        setResult(response.data.data);
        setOriginalUrl('');
        setCustomAlias('');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Something went wrong. Please check your URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-10">
      {/* Hero Header */}
      <HeroHeader />

      {/* Main Card (Shortener Form) */}
      <div className="w-full max-w-2xl glass-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl -mr-8 -mt-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -ml-8 -mb-8" />

        <ShortenerForm
          originalUrl={originalUrl}
          setOriginalUrl={setOriginalUrl}
          customAlias={customAlias}
          setCustomAlias={setCustomAlias}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          loading={loading}
          error={error}
          handleShorten={handleShorten}
        />

        {/* Shortener Success Result Screen */}
        <ShortenerResult
          result={result}
          copied={copied}
          handleCopy={handleCopy}
          user={user}
        />
      </div>

      {/* Feature Grid Section */}
      <FeatureGrid />
    </div>
  );
};

export default Home;
