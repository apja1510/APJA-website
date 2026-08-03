import React, { useState, useEffect, useMemo } from 'react';
import { SoftwareSetup, OSPlatform, SoftwareAnalytics } from './types';
import { INITIAL_REPOS, FALLBACK_SETUPS } from './data/defaultRepos';
import { fetchGitHubRepoSetup, formatCompactNumber } from './services/github';
import { VintageHeroSection } from './components/VintageHeroSection';
import { SoftwareCard } from './components/SoftwareCard';
import { SoftwareDetailModal } from './components/SoftwareDetailModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { UploadGuide } from './components/UploadGuide';
import { AddRepoModal } from './components/AddRepoModal';
import { SettingsModal } from './components/SettingsModal';
import {
  Search,
  Plus,
  Sparkles,
  Github,
  HelpCircle,
  CheckCircle2,
  HardDrive,
  ArrowUpDown,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'setup_hub_software_list';
const GITHUB_TOKEN_KEY = 'setup_hub_github_token';
const THEME_KEY = 'setup_hub_theme_style';

export default function App() {
  const [setups, setSetups] = useState<SoftwareSetup[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed: SoftwareSetup[] = JSON.parse(saved);
        // Filter out default sample apps if present
        const customOnly = parsed.filter(
          (s) =>
            s.id !== 'Heroic-Games-Launcher/HeroicGamesLauncher' &&
            s.id !== 'tauri-apps/tauri' &&
            s.id !== 'feditolerant/feditolerant-desktop' &&
            s.id !== 'myorg/my-awesome-app'
        );
        return customOnly;
      } catch (e) {
        console.error('Error loading saved setups', e);
      }
    }
    return [];
  });

  const [githubToken, setGithubToken] = useState<string>(() => {
    return localStorage.getItem(GITHUB_TOKEN_KEY) || '';
  });

  const [themeStyle, setThemeStyle] = useState<'vintage' | 'dark'>(() => {
    return (localStorage.getItem(THEME_KEY) as 'vintage' | 'dark') || 'vintage';
  });

  const [activeTab, setActiveTab] = useState<'catalog' | 'analytics' | 'guide' | 'manage'>('catalog');
  const [selectedSetup, setSelectedSetup] = useState<SoftwareSetup | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOsFilter, setSelectedOsFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'downloads' | 'newest' | 'name'>('downloads');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isVintage = themeStyle === 'vintage';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleTheme = (newTheme: 'vintage' | 'dark') => {
    setThemeStyle(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    showToast(`Switched theme to ${newTheme === 'vintage' ? 'Vintage Architectural' : 'Elegant Dark'}`);
  };

  // Save setups to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(setups));
  }, [setups]);

  // Initial Sync from GitHub API for initial repos on first render
  useEffect(() => {
    if (INITIAL_REPOS.length === 0) return;
    const syncInitialRepos = async () => {
      setIsRefreshing(true);
      const updatedSetups = [...setups];
      let hasChanges = false;

      for (const item of INITIAL_REPOS) {
        try {
          const liveSetup = await fetchGitHubRepoSetup(item.owner, item.repo, githubToken, item.category);
          const index = updatedSetups.findIndex((s) => s.id === liveSetup.id);
          if (index >= 0) {
            updatedSetups[index] = liveSetup;
          } else {
            updatedSetups.unshift(liveSetup);
          }
          hasChanges = true;
        } catch (err) {
          console.warn(`Could not sync ${item.owner}/${item.repo}:`, err);
        }
      }

      if (hasChanges) {
        setSetups(updatedSetups);
      }
      setIsRefreshing(false);
    };

    syncInitialRepos();
  }, []);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    const updated = [];
    let count = 0;

    for (const setup of setups) {
      try {
        const live = await fetchGitHubRepoSetup(setup.owner, setup.repo, githubToken, setup.category);
        updated.push(live);
        count++;
      } catch (e) {
        updated.push(setup); // Keep existing on error
      }
    }

    setSetups(updated);
    setIsRefreshing(false);
    showToast(`Refreshed live GitHub statistics for ${count} repositories!`);
  };

  const handleSaveToken = (token: string) => {
    setGithubToken(token);
    localStorage.setItem(GITHUB_TOKEN_KEY, token);
    showToast('Saved GitHub Personal Access Token');
  };

  const handleAddSetup = (newSetup: SoftwareSetup) => {
    setSetups((prev) => [newSetup, ...prev.filter((s) => s.id !== newSetup.id)]);
    showToast(`Added ${newSetup.displayName} to tracked software!`);
  };

  const handleRemoveSetup = (id: string) => {
    setSetups((prev) => prev.filter((s) => s.id !== id));
    showToast('Removed software setup');
  };

  const handleResetDefaults = () => {
    setSetups([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showToast('Cleared repository list');
  };

  const handleSimulateDownload = (assetName: string) => {
    showToast(`Started downloading ${assetName}!`);
  };

  // Compute categories list
  const categories = useMemo(() => {
    const cats = new Set(setups.map((s) => s.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [setups]);

  // Compute Filtered & Sorted Setups
  const filteredSetups = useMemo(() => {
    return setups
      .filter((setup) => {
        // Search query
        const matchesQuery =
          setup.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          setup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          setup.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
          setup.repo.toLowerCase().includes(searchQuery.toLowerCase());

        // Category
        const matchesCategory = selectedCategory === 'all' || setup.category === selectedCategory;

        // OS Platform
        let matchesOs = true;
        if (selectedOsFilter !== 'all') {
          const platforms = setup.latestRelease?.assets.map((a) => a.platform) || [];
          matchesOs = platforms.includes(selectedOsFilter as OSPlatform);
        }

        return matchesQuery && matchesCategory && matchesOs;
      })
      .sort((a, b) => {
        if (sortBy === 'downloads') {
          return b.totalDownloads - a.totalDownloads;
        }
        if (sortBy === 'newest') {
          const dateA = a.latestRelease ? new Date(a.latestRelease.published_at).getTime() : 0;
          const dateB = b.latestRelease ? new Date(b.latestRelease.published_at).getTime() : 0;
          return dateB - dateA;
        }
        return a.displayName.localeCompare(b.displayName);
      });
  }, [setups, searchQuery, selectedCategory, selectedOsFilter, sortBy]);

  // Analytics Calculation
  const analytics: SoftwareAnalytics = useMemo(() => {
    const totalSoftware = setups.length;
    const totalReleases = setups.reduce((acc, s) => acc + s.releases.length, 0);
    const totalDownloads = setups.reduce((acc, s) => acc + s.totalDownloads, 0);
    const avgDownloadsPerSoftware = totalSoftware > 0 ? Math.round(totalDownloads / totalSoftware) : 0;

    const sortedByDownloads = [...setups].sort((a, b) => b.totalDownloads - a.totalDownloads);
    const topSoftware = sortedByDownloads[0] || null;

    // OS counts
    const osCounts: Record<OSPlatform, number> = {
      windows: 0,
      macos: 0,
      linux: 0,
      android: 0,
      ios: 0,
      other: 0,
    };

    setups.forEach((s) => {
      (s.latestRelease?.assets || []).forEach((asset) => {
        if (osCounts[asset.platform] !== undefined) {
          osCounts[asset.platform] += asset.download_count;
        } else {
          osCounts.other += asset.download_count;
        }
      });
    });

    const osStats = (Object.keys(osCounts) as OSPlatform[]).map((platform) => {
      const count = osCounts[platform];
      const percentage = totalDownloads > 0 ? Math.round((count / totalDownloads) * 100) : 0;
      let label = 'Windows';
      if (platform === 'macos') label = 'macOS';
      else if (platform === 'linux') label = 'Linux';
      else if (platform === 'android') label = 'Android';
      else if (platform === 'ios') label = 'iOS';
      else if (platform === 'other') label = 'Other Files';

      return {
        platform,
        label,
        count,
        percentage,
        color: '',
      };
    });

    const softwareStats = setups.map((s) => ({
      name: s.displayName,
      downloads: s.totalDownloads,
      releasesCount: s.releases.length,
    }));

    return {
      totalSoftware,
      totalReleases,
      totalDownloads,
      avgDownloadsPerSoftware,
      topSoftware,
      osStats,
      softwareStats,
    };
  }, [setups]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isVintage ? 'bg-[#dcdcd3] text-[#191a1c] selection:bg-[#191a1c] selection:text-[#dcdcd3]' : 'bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white'
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 animate-bounce text-xs font-semibold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border ${
          isVintage
            ? 'bg-[#191a1c] text-[#dcdcd3] border-[#191a1c]'
            : 'bg-indigo-600 text-white border-indigo-400/30'
        }`}>
          <CheckCircle2 className={`w-4 h-4 ${isVintage ? 'text-emerald-400' : 'text-emerald-300'}`} />
          <span className="font-mono uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Banner (Replaces Top Navbar) */}
      {isVintage ? (
        <VintageHeroSection
          onExploreClick={() => {
            const el = document.getElementById('software-catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onGuideClick={() => setActiveTab('guide')}
          onAddClick={() => setIsAddModalOpen(true)}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onRefreshClick={handleRefreshAll}
          isRefreshing={isRefreshing}
          totalSetups={setups.length}
          totalDownloads={analytics.totalDownloads}
          themeStyle={themeStyle}
          onToggleTheme={handleToggleTheme}
        />
      ) : (
        <div className="bg-slate-900/60 border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct GitHub Release CDN & Analytics</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                Software Setup Distribution Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Upload your desktop installers (.exe, .dmg, .AppImage) directly on GitHub Releases, share download links with users, and monitor live download statistics.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('guide')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/80 transition-all shadow-sm"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>How to Upload Setups</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Add GitHub Repo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main id="software-catalog" className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: SOFTWARE LIBRARY / CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {setups.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#191a1c]/20 font-mono text-xs uppercase tracking-wider">
                  <span className="font-bold text-[#191a1c]">UPLOADED REPOSITORIES ({setups.length})</span>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 hover:underline font-bold text-[#191a1c]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload New App</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {setups.map((setup) => (
                    <SoftwareCard
                      key={setup.id}
                      setup={setup}
                      onSelect={(s) => setSelectedSetup(s)}
                      onSimulateDownload={handleSimulateDownload}
                      themeStyle={themeStyle}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className={`p-8 sm:p-12 border transition-colors space-y-6 ${
                isVintage
                  ? 'bg-[#cfcfc4] border-[#191a1c] text-[#191a1c]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-100 rounded-3xl'
              }`}>
                <div className="max-w-2xl mx-auto text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ${
                    isVintage ? 'bg-[#191a1c] text-[#dcdcd3]' : 'bg-indigo-600 text-white'
                  }`}>
                    <Plus className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-tight ${
                      isVintage ? 'font-syne text-[#191a1c]' : 'text-slate-100'
                    }`}>
                      No Software Apps Published Yet
                    </h2>
                    <p className={`text-xs sm:text-sm font-mono leading-relaxed ${
                      isVintage ? 'text-[#191a1c]/80' : 'text-slate-400'
                    }`}>
                      Publish and distribute your desktop installers (.exe, .dmg, .AppImage) directly through GitHub Releases CDN. Connect your GitHub repository to generate direct download links and track analytics.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className={`px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl ${
                        isVintage
                          ? 'bg-[#191a1c] text-[#dcdcd3] hover:bg-[#2b2d31]'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Your First App</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('guide')}
                      className={`px-5 py-3.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
                        isVintage
                          ? 'border border-[#191a1c] text-[#191a1c] hover:bg-[#191a1c]/10'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>How to Upload</span>
                    </button>
                  </div>
                </div>

                {/* Quick 3-Step Walkthrough */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t ${
                  isVintage ? 'border-[#191a1c]/20' : 'border-slate-800'
                }`}>
                  <div className={`p-4 border font-mono text-xs space-y-1.5 ${
                    isVintage ? 'bg-[#dcdcd3] border-[#191a1c]/40 text-[#191a1c]' : 'bg-slate-950/60 border-slate-800 text-slate-300 rounded-xl'
                  }`}>
                    <div className="font-bold text-amber-600 dark:text-amber-400">STEP 01</div>
                    <div className="font-bold">Create GitHub Release</div>
                    <div className="text-[11px] opacity-80">Attach your compiled installer (.exe, .dmg, .AppImage) to a GitHub Release tag.</div>
                  </div>

                  <div className={`p-4 border font-mono text-xs space-y-1.5 ${
                    isVintage ? 'bg-[#dcdcd3] border-[#191a1c]/40 text-[#191a1c]' : 'bg-slate-950/60 border-slate-800 text-slate-300 rounded-xl'
                  }`}>
                    <div className="font-bold text-amber-600 dark:text-amber-400">STEP 02</div>
                    <div className="font-bold">Add Repo Details</div>
                    <div className="text-[11px] opacity-80">Click "Upload Your First App" and input your repository owner and repo name.</div>
                  </div>

                  <div className={`p-4 border font-mono text-xs space-y-1.5 ${
                    isVintage ? 'bg-[#dcdcd3] border-[#191a1c]/40 text-[#191a1c]' : 'bg-slate-950/60 border-slate-800 text-slate-300 rounded-xl'
                  }`}>
                    <div className="font-bold text-amber-600 dark:text-amber-400">STEP 03</div>
                    <div className="font-bold">Instant Distribution</div>
                    <div className="text-[11px] opacity-80">Your app card, download links, OS detection, and analytics are generated live!</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            setups={setups}
            analytics={analytics}
            onSelectSetup={(s) => setSelectedSetup(s)}
          />
        )}

        {/* TAB 3: UPLOAD GUIDE */}
        {activeTab === 'guide' && <UploadGuide />}
      </main>

      {/* Footer */}
      <footer className={`border-t py-8 px-4 text-center text-xs mt-auto transition-colors ${
        isVintage
          ? 'bg-[#cfcfc4] border-[#191a1c] text-[#191a1c]'
          : 'bg-slate-900/80 border-slate-800/80 text-slate-500'
      }`}>
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-syne font-extrabold uppercase tracking-tight text-sm">OldSoul Builds</span>
            <span>• GitHub Releases CDN Distribution Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('guide')} className="hover:underline">
              Upload Guide
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="hover:underline">
              API Token
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1 font-bold"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Software Detail Modal */}
      <SoftwareDetailModal
        setup={selectedSetup}
        onClose={() => setSelectedSetup(null)}
        onSimulateDownload={handleSimulateDownload}
      />

      {/* Add Repo Modal */}
      <AddRepoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSetup={handleAddSetup}
        githubToken={githubToken}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        githubToken={githubToken}
        onSaveToken={handleSaveToken}
        setups={setups}
        onRemoveSetup={handleRemoveSetup}
        onResetDefaults={handleResetDefaults}
        onImportSetups={(imported) => {
          setSetups(imported);
          setIsSettingsOpen(false);
          showToast('Imported setup collection successfully');
        }}
      />
    </div>
  );
}
