import React, { useState } from 'react';
import { SoftwareSetup, GitHubAsset } from '../types';
import { formatCompactNumber, formatBytes } from '../services/github';
import { OSBadge } from './OSBadge';
import { Download, ChevronDown, ExternalLink, Tag, FileCode, Star, Calendar, HardDrive } from 'lucide-react';

interface SoftwareCardProps {
  setup: SoftwareSetup;
  onSelect: (setup: SoftwareSetup) => void;
  onSimulateDownload?: (assetName: string) => void;
  themeStyle?: 'vintage' | 'dark';
}

export const SoftwareCard: React.FC<SoftwareCardProps> = ({ setup, onSelect, onSimulateDownload, themeStyle = 'vintage' }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const isVintage = themeStyle === 'vintage';

  const latestRelease = setup.latestRelease;
  const assets = latestRelease?.assets || [];

  // Extract unique platforms supported in latest release
  const supportedPlatforms = Array.from(new Set(assets.map((a) => a.platform)));

  // Primary setup asset (e.g. windows .exe or first available)
  const primaryAsset =
    assets.find((a) => a.platform === setup.primaryOs) || assets[0];

  const handleDownloadClick = (asset: GitHubAsset, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSimulateDownload) {
      onSimulateDownload(asset.name);
    }
    window.open(asset.browser_download_url, '_blank');
  };

  return (
    <div
      onClick={() => onSelect(setup)}
      className={`group relative p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
        isVintage
          ? 'bg-[#d8d8ce] hover:bg-[#cfcfc4] border-[#191a1c] shadow-md hover:shadow-xl rounded-none'
          : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-indigo-500/50 rounded-2xl shadow-lg hover:shadow-indigo-500/10'
      }`}
    >
      <div>
        {/* Header: Icon, Title, Version */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {setup.iconUrl ? (
              <img
                src={setup.iconUrl}
                alt={setup.displayName}
                className={`w-12 h-12 object-cover p-0.5 shadow-sm ${
                  isVintage ? 'bg-[#191a1c] border border-[#191a1c] rounded-none' : 'bg-slate-800 border border-slate-700/60 rounded-xl'
                }`}
              />
            ) : (
              <div className={`w-12 h-12 flex items-center justify-center font-bold text-lg shadow-sm ${
                isVintage ? 'bg-[#191a1c] text-[#dcdcd3] font-syne rounded-none' : 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-xl'
              }`}>
                {setup.displayName.charAt(0)}
              </div>
            )}
            <div>
              <h3 className={`text-base font-bold line-clamp-1 uppercase tracking-tight ${
                isVintage ? 'font-syne text-[#191a1c] group-hover:underline' : 'font-sans text-slate-100 group-hover:text-indigo-300'
              }`}>
                {setup.displayName}
              </h3>
              <p className={`text-xs font-mono flex items-center gap-1 mt-0.5 ${
                isVintage ? 'text-[#191a1c]/70' : 'text-slate-400'
              }`}>
                <span>{setup.owner}/{setup.repo}</span>
              </p>
            </div>
          </div>

          {/* Release Tag Pill */}
          {latestRelease && (
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-mono font-bold shrink-0 ${
              isVintage
                ? 'bg-[#191a1c] text-[#dcdcd3] rounded-full border border-[#191a1c]'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full'
            }`}>
              <Tag className="w-3 h-3" />
              {latestRelease.tag_name}
            </span>
          )}
        </div>

        {/* Description */}
        <p className={`text-xs line-clamp-2 mb-4 leading-relaxed min-h-[2.25rem] ${
          isVintage ? 'font-space text-[#191a1c]/80 uppercase text-[11px] tracking-wide font-medium' : 'text-slate-300/90'
        }`}>
          {setup.description || 'No description provided for this software release.'}
        </p>

        {/* OS Platform Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {supportedPlatforms.length > 0 ? (
            supportedPlatforms.map((platform) => (
              <OSBadge key={platform} platform={platform} size="sm" />
            ))
          ) : (
            <span className="text-xs text-slate-500 italic">No release binaries attached yet</span>
          )}
        </div>
      </div>

      {/* Footer Stats & Download Controls */}
      <div className={`pt-3 border-t ${
        isVintage ? 'border-[#191a1c]/30' : 'border-slate-800/80'
      }`}>
        <div className={`flex items-center justify-between text-xs mb-3 ${
          isVintage ? 'text-[#191a1c]/80 font-mono font-semibold' : 'text-slate-400'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1 font-bold ${
              isVintage ? 'text-[#191a1c]' : 'text-indigo-400'
            }`}>
              <Download className="w-3.5 h-3.5" />
              {formatCompactNumber(setup.totalDownloads)} downloads
            </span>
            {setup.starsCount !== undefined && setup.starsCount > 0 && (
              <span className="flex items-center gap-1">
                <Star className={`w-3 h-3 ${isVintage ? 'text-[#191a1c] fill-[#191a1c]' : 'text-amber-400 fill-amber-400/20'}`} />
                {formatCompactNumber(setup.starsCount)}
              </span>
            )}
          </div>
          <span className="text-[11px] opacity-70">
            {latestRelease ? new Date(latestRelease.published_at).toLocaleDateString() : 'No releases'}
          </span>
        </div>

        {/* Action Button Area */}
        <div className="flex items-center gap-2">
          {primaryAsset ? (
            <div className="relative flex-1">
              <div className="inline-flex shadow-sm w-full">
                <button
                  type="button"
                  onClick={(e) => handleDownloadClick(primaryAsset, e)}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-all ${
                    isVintage
                      ? 'bg-[#191a1c] hover:bg-[#2c2e33] text-[#dcdcd3] rounded-l-full'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white rounded-l-xl shadow-md shadow-indigo-600/20'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="truncate">Download ({primaryAsset.fileExtension.toUpperCase()})</span>
                </button>

                {assets.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(!showDropdown);
                    }}
                    className={`px-2.5 py-2.5 border-l transition-colors ${
                      isVintage
                        ? 'bg-[#2b2d31] hover:bg-[#191a1c] text-[#dcdcd3] border-[#191a1c]/40 rounded-r-full'
                        : 'bg-indigo-700 hover:bg-indigo-600 text-white border-indigo-500/40 rounded-r-xl'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dropdown for multiple assets */}
              {showDropdown && assets.length > 1 && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute right-0 bottom-full mb-2 w-64 shadow-2xl z-20 overflow-hidden py-1 ${
                    isVintage
                      ? 'bg-[#191a1c] text-[#dcdcd3] border border-[#191a1c] rounded-none'
                      : 'bg-slate-950 text-slate-100 border border-slate-800 rounded-xl'
                  }`}
                >
                  <div className={`px-3 py-1.5 border-b text-[11px] font-semibold uppercase tracking-wider font-mono ${
                    isVintage ? 'border-white/10 text-[#dcdcd3]/70' : 'border-slate-800 text-slate-400'
                  }`}>
                    Available Installers
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-white/10">
                    {assets.map((ast) => (
                      <button
                        key={ast.id}
                        onClick={(e) => {
                          handleDownloadClick(ast, e);
                          setShowDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 transition-colors flex items-center justify-between text-xs ${
                          isVintage ? 'hover:bg-white/10 text-[#dcdcd3]' : 'hover:bg-slate-800/80 text-slate-200'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="font-mono font-semibold truncate">{ast.name}</p>
                          <p className="text-[10px] font-mono opacity-70">
                            {formatBytes(ast.size)} • {ast.download_count} downloads
                          </p>
                        </div>
                        <OSBadge platform={ast.platform} showLabel={false} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onSelect(setup)}
              className={`w-full py-2 text-xs font-mono font-semibold uppercase transition-colors ${
                isVintage
                  ? 'bg-[#191a1c] text-[#dcdcd3] hover:bg-[#2b2d31] rounded-full'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl'
              }`}
            >
              View Repository Details
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(setup);
            }}
            title="View Release Notes & Details"
            className={`p-2.5 transition-colors shrink-0 ${
              isVintage
                ? 'bg-[#191a1c] hover:bg-[#2b2d31] text-[#dcdcd3] rounded-full border border-[#191a1c]'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/50'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
