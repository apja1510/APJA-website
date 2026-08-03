import React from 'react';
import { SoftwareSetup, SoftwareAnalytics } from '../types';
import { formatCompactNumber, formatBytes } from '../services/github';
import { OSBadge } from './OSBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  Download,
  Layers,
  HardDrive,
  TrendingUp,
  Award,
  PieChart as PieIcon,
  BarChart2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  setups: SoftwareSetup[];
  analytics: SoftwareAnalytics;
  onSelectSetup: (setup: SoftwareSetup) => void;
}

const OS_COLORS: Record<string, string> = {
  windows: '#3b82f6', // blue-500
  macos: '#94a3b8', // slate-400
  linux: '#f59e0b', // amber-500
  android: '#10b981', // emerald-500
  ios: '#6366f1', // indigo-500
  other: '#64748b', // slate-500
};

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  setups,
  analytics,
  onSelectSetup,
}) => {
  // Prepare data for Bar Chart: Top Software by Downloads
  const barChartData = analytics.softwareStats.map((item) => ({
    name: item.name.length > 18 ? item.name.substring(0, 15) + '...' : item.name,
    fullName: item.name,
    downloads: item.downloads,
  }));

  // Prepare data for OS Distribution Pie Chart
  const pieChartData = analytics.osStats.filter((item) => item.count > 0);

  // Flatten all assets across all setups to find the top individual setup binaries
  const allAssets = setups.flatMap((s) =>
    (s.latestRelease?.assets || []).map((a) => ({
      ...a,
      softwareName: s.displayName,
      softwareRepo: s.id,
      setup: s,
    }))
  );
  const topAssets = [...allAssets].sort((a, b) => b.download_count - a.download_count).slice(0, 6);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Section Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Real-time GitHub Metrics</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Download Statistics Dashboard</h2>
        <p className="text-sm text-slate-400 mt-1">
          Live analytics compiled across all software release setup files and binaries.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="absolute right-3 top-3 p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Download className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total Downloads
          </p>
          <h3 className="text-2xl font-black text-slate-100 mt-2">
            {formatCompactNumber(analytics.totalDownloads)}
          </h3>
          <p className="text-[11px] text-indigo-400 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Across all GitHub releases</span>
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="absolute right-3 top-3 p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Tracked Setups
          </p>
          <h3 className="text-2xl font-black text-slate-100 mt-2">{analytics.totalSoftware}</h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {analytics.totalReleases} total published release tags
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute right-3 top-3 p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Top Downloaded
          </p>
          <h3 className="text-lg font-bold text-slate-100 mt-2 truncate">
            {analytics.topSoftware?.displayName || 'N/A'}
          </h3>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">
            {analytics.topSoftware ? `${formatCompactNumber(analytics.topSoftware.totalDownloads)} downloads` : 'None'}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="absolute right-3 top-3 p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <HardDrive className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Avg Downloads / App
          </p>
          <h3 className="text-2xl font-black text-slate-100 mt-2">
            {formatCompactNumber(analytics.avgDownloadsPerSoftware)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Average per software library entry</p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Downloads by Software */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <span>Download Distribution by Software Setup</span>
              </h3>
              <p className="text-xs text-slate-400">Total downloads per tracked GitHub repository</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-xl text-xs">
                          <p className="font-bold text-slate-200">{data.fullName}</p>
                          <p className="text-indigo-400 font-semibold mt-1">
                            {data.downloads.toLocaleString()} downloads
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="downloads" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: OS Distribution */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-1">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <span>OS Platform Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Downloads categorized by operating system installer</p>
          </div>

          {pieChartData.length > 0 ? (
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={OS_COLORS[entry.platform] || '#6366f1'}
                        stroke="#0f172a"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs">
                            <span className="font-bold text-slate-200">{data.label}</span>: {' '}
                            <span className="text-indigo-400 font-mono">
                              {data.count.toLocaleString()} ({data.percentage}%)
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-slate-500 italic">
              No platform statistics available
            </div>
          )}

          <div className="space-y-2 mt-4 pt-3 border-t border-slate-800/80">
            {analytics.osStats.map((os) => (
              <div key={os.platform} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: OS_COLORS[os.platform] || '#6366f1' }}
                  />
                  <span className="text-slate-300 font-medium">{os.label}</span>
                </div>
                <span className="font-mono text-slate-400">
                  {formatCompactNumber(os.count)} ({os.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Individual Installer Binaries Table */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Most Downloaded Setup Binaries & Installers</span>
            </h3>
            <p className="text-xs text-slate-400">Individual file asset download counters from GitHub Releases</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                <th className="pb-3 pl-2">Installer File</th>
                <th className="pb-3">Software Setup</th>
                <th className="pb-3">OS Target</th>
                <th className="pb-3">File Size</th>
                <th className="pb-3 text-right pr-2">Downloads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {topAssets.length > 0 ? (
                topAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => onSelectSetup(asset.setup)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 pl-2 font-mono font-medium text-slate-100 max-w-xs truncate">
                      {asset.name}
                    </td>
                    <td className="py-3.5 text-slate-300 font-medium">{asset.softwareName}</td>
                    <td className="py-3.5">
                      <OSBadge platform={asset.platform} size="sm" />
                    </td>
                    <td className="py-3.5 text-slate-400 font-mono">{formatBytes(asset.size)}</td>
                    <td className="py-3.5 text-right pr-2 font-mono font-bold text-indigo-400">
                      {asset.download_count.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                    No individual binary files fetched yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
