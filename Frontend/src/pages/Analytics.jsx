import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  ArrowLeft, Laptop, Smartphone, Globe, RefreshCw, HelpCircle 
} from 'lucide-react';
import AnalyticsSummary from '../components/analytics/AnalyticsSummary';
import ClicksTimelineChart from '../components/analytics/ClicksTimelineChart';
import DistributionPieChart from '../components/analytics/DistributionPieChart';
import GeoDistributionTable from '../components/analytics/GeoDistributionTable';
import VisitorLogsTable from '../components/analytics/VisitorLogsTable';

const Analytics = () => {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState('day'); // hour, day, month

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    setTimeframe('day');
    try {
      // Fetch full analytics data
      const response = await api.get(`/analytics/${shortCode}`);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeframeChange = async (tf) => {
    setTimeframe(tf);
    try {
      const response = await api.get(`/analytics/${shortCode}/timeline`, {
        params: { timeframe: tf }
      });
      if (response.data.success) {
        setData(prev => ({
          ...prev,
          timeline: response.data.data
        }));
      }
    } catch (err) {
      console.error('Failed to fetch timeline data', err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
        <p className="text-xs text-slate-500">Compiling analytics report...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <div className="bg-red-500/10 p-3.5 rounded-full border border-red-500/20 text-red-400">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">Analytics Error</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">{error || 'An unexpected error occurred.'}</p>
        <Link to="/dashboard" className="text-xs font-bold text-primary-400 hover:underline inline-flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const { summary, timeline, geographic, devices, browsers, os } = data;

  // Format timeline for display
  const chartData = timeline.map(item => {
    let dateStr = '';
    if (item.hour !== undefined) {
      dateStr = `${item.day}/${item.month} ${item.hour}:00`;
    } else if (item.day !== undefined) {
      dateStr = `${item.day}/${item.month}/${item.year}`;
    } else if (item.month !== undefined) {
      dateStr = `${item.month}/${item.year}`;
    }
    return {
      name: dateStr,
      Clicks: item.clicks,
      Visitors: item.uniqueVisitors
    };
  }).reverse(); // Sort oldest to newest

  const deviceChartData = devices.map(item => ({
    name: item.deviceType === 'unknown' ? 'Other' : item.deviceType,
    value: item.clicks
  }));

  const browserChartData = browsers.map(item => ({
    name: item.browserName === 'unknown' ? 'Other' : item.browserName,
    value: item.clicks
  }));

  const osChartData = os.map(item => ({
    name: item.osType === 'unknown' ? 'Other' : item.osType,
    value: item.clicks
  }));

  return (
    <div className="space-y-8 py-4 w-full">
      {/* Header and Back navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 transition-colors font-bold uppercase tracking-wider mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white m-0">Link Analytics</h1>
          <p className="text-slate-400 text-xs font-mono">/{shortCode}</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center space-x-1.5 bg-dark-800 text-slate-300 hover:bg-dark-700 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Summary Stats Cards */}
      <AnalyticsSummary summary={summary} />

      {/* Clicks Timeline Chart */}
      <ClicksTimelineChart 
        chartData={chartData} 
        timeframe={timeframe} 
        onTimeframeChange={handleTimeframeChange} 
      />

      {/* Grid Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DistributionPieChart
          title="Devices"
          subtitle="Distribution of client devices"
          icon={Laptop}
          chartData={deviceChartData}
          emptyMessage="No device data"
        />

        <DistributionPieChart
          title="Browsers"
          subtitle="Browsers used by visitors"
          icon={Globe}
          chartData={browserChartData}
          emptyMessage="No browser data"
        />

        <DistributionPieChart
          title="Operating Systems"
          subtitle="OS of visiting clients"
          icon={Smartphone}
          chartData={osChartData}
          emptyMessage="No OS data"
        />
      </div>

      {/* Geolocation Table */}
      <GeoDistributionTable geographic={geographic} totalClicks={summary.totalClicks} />

      {/* Visitor Logs Table */}
      <VisitorLogsTable logs={data.logs} />
    </div>
  );
};

export default Analytics;
