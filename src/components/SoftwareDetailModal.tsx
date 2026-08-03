import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SoftwareSetup, GitHubRelease, GitHubAsset } from '../types';
import { formatBytes, formatCompactNumber } from '../services/github';
import { OSBadge } from './OSBadge';
import {
  X,
  Download,
  Github,
  Tag,
  Copy,
  Check,
  Calendar,
  HardDrive,
  ExternalLink,
  Terminal,
  ShieldCheck,
  ChevronRight,
  Layers
} from 'lucide-react';

interface SoftwareDetailModalProps {
  setup: SoftwareSetup | null;
  onClose: () => void;
  onSimulateDownload?: (assetName: string) => void;
}

export const SoftwareDetailModal: React.FC<SoftwareDetailModalProps> = ({
  setup,
  onClose,
  onSimulateDownload,
}) => {
  const [selectedReleaseIndex, setSelectedReleaseIndex] = useState<number>(0);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!setup) return null;

  const currentRelease: GitHubRelease | undefined =
    setup.releases[selectedReleaseIndex] || setup.latestRelease;

  const assets = currentRelease?.assets || [];

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCmd(command);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownloadAsset = (asset: GitHubAsset) => {
    if (onSimulateDownload) {
      onSimulateDownload(asset.name);
    }
    window.open(asset.browser_download_url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            {setup.iconUrl ? (
              <img
                src={setup.iconUrl}
                alt={setup.displayName}
                className="w-14 h-14 rounded-2xl object-cover bg-slate-800 border border-slate-700/80 p-0.5 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                {setup.displayName.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100">{setup.displayName}</h2>
                <a
                  href={setup.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Open GitHub Repo"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{setup.owner}/{setup.repo}</p>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">{setup.description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/50 border border-slate-800/80 p-3.5 rounded-2xl">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                Total Downloads
              </span>
              <span className="text-lg font-bold text-indigo-400 flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                {formatCompactNumber(setup.totalDownloads)}
              </span>
            </div>

            <div className="bg-slate-950/50 border border-slate-800/80 p-3.5 rounded-2xl">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                Latest Tag
              </span>
              <span className="text-lg font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                <Tag className="w-4 h-4" />
                {setup.latestRelease?.tag_name || 'N/A'}
              </span>
            </div>

            <div className="bg-slate-950/50 border border-slate-800/80 p-3.5 rounded-2xl">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                Releases Count
              </span>
              <span className="text-lg font-bold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400" />
                {setup.releases.length}
              </span>
            </div>

            <div className="bg-slate-950/50 border border-slate-800/80 p-3.5 rounded-2xl">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                Category
              </span>
              <span className="text-sm font-semibold text-slate-300 mt-1 block">
                {setup.category || 'Software'}
              </span>
            </div>
          </div>

          {/* Release Version Switcher (If multiple) */}
          {setup.releases.length > 1 && (
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Select Release Version:
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {setup.releases.map((rel, idx) => (
                  <button
                    key={rel.id}
                    onClick={() => setSelectedReleaseIndex(idx)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                      selectedReleaseIndex === idx
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>{rel.tag_name}</span>
                    {idx === 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] rounded bg-emerald-500/20 text-emerald-300">
                        Latest
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Release Binaries & Installers Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-indigo-400" />
                <span>Installer Binaries & Files ({assets.length})</span>
              </h3>
              {currentRelease && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Published {new Date(currentRelease.published_at).toLocaleDateString()}
                </span>
              )}
            </div>

            {assets.length === 0 ? (
              <div className="p-6 bg-slate-950/40 border border-slate-800 rounded-2xl text-center text-slate-400 text-sm">
                No setup files or binaries attached to this release on GitHub yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-2xl hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-semibold text-slate-200 truncate pr-2" title={asset.name}>
                          {asset.name}
                        </span>
                        <OSBadge platform={asset.platform} size="sm" />
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                        <span>{formatBytes(asset.size)}</span>
                        <span>•</span>
                        <span className="text-indigo-400 font-medium">
                          {formatCompactNumber(asset.download_count)} downloads
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadAsset(asset)}
                      className="w-full flex items-center justify-center gap-2 px-3.5 py-2 bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Terminal Command */}
          {currentRelease && (
            <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Terminal CLI Direct Download
                </span>
                <span className="text-[11px] text-slate-500">GitHub CLI / curl</span>
              </div>
              <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto">
                <code className="truncate">
                  gh release download {currentRelease.tag_name} --repo {setup.owner}/{setup.repo}
                </code>
                <button
                  onClick={() =>
                    handleCopyCommand(
                      `gh release download ${currentRelease.tag_name} --repo ${setup.owner}/${setup.repo}`
                    )
                  }
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors shrink-0"
                  title="Copy command"
                >
                  {copiedCmd === `gh release download ${currentRelease.tag_name} --repo ${setup.owner}/${setup.repo}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Release Notes (Markdown) */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Release Notes
            </h3>
            <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed max-h-72 overflow-y-auto prose prose-invert max-w-none">
              {currentRelease?.body ? (
                <ReactMarkdown>{currentRelease.body}</ReactMarkdown>
              ) : (
                <p className="text-slate-500 italic">No release notes provided for this tag.</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Directly served from GitHub's CDN</span>
          </div>

          <a
            href={currentRelease?.html_url || setup.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            <span>View Release on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
