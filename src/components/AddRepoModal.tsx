import React, { useState } from 'react';
import { fetchGitHubRepoSetup, parseGitHubRepoInput } from '../services/github';
import { SoftwareSetup } from '../types';
import { X, Search, Github, AlertCircle, CheckCircle2, Loader2, Plus, Sparkles, Layers } from 'lucide-react';

interface AddRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSetup: (setup: SoftwareSetup) => void;
  githubToken?: string;
}

const CATEGORIES = [
  'Utilities',
  'Developer Tools',
  'Gaming',
  'Audio & Music',
  'Productivity',
  'Design & Graphics',
  'Security & Privacy',
  'Cross-Platform Apps',
];

const QUICK_SAMPLES = [
  { owner: 'obs-studio', repo: 'obs-studio', name: 'OBS Studio', category: 'Audio & Music' },
  { owner: 'tauri-apps', repo: 'tauri', name: 'Tauri Framework', category: 'Developer Tools' },
  { owner: 'videolan', repo: 'vlc', name: 'VLC Media Player', category: 'Audio & Music' },
  { owner: 'Heroic-Games-Launcher', repo: 'HeroicGamesLauncher', name: 'Heroic Games Launcher', category: 'Gaming' },
];

export const AddRepoModal: React.FC<AddRepoModalProps> = ({
  isOpen,
  onClose,
  onAddSetup,
  githubToken,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Utilities');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewSetup, setPreviewSetup] = useState<SoftwareSetup | null>(null);

  if (!isOpen) return null;

  const handleFetchPreview = async (ownerArg?: string, repoArg?: string) => {
    let owner = ownerArg;
    let repo = repoArg;

    if (!owner || !repo) {
      const parsed = parseGitHubRepoInput(inputUrl);
      if (!parsed) {
        setErrorMsg('Please enter a valid GitHub repository link (e.g., https://github.com/owner/repo or owner/repo)');
        return;
      }
      owner = parsed.owner;
      repo = parsed.repo;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setPreviewSetup(null);

    try {
      const setup = await fetchGitHubRepoSetup(owner, repo, githubToken, selectedCategory);
      setPreviewSetup(setup);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch repository details from GitHub.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAdd = () => {
    if (previewSetup) {
      onAddSetup({
        ...previewSetup,
        category: selectedCategory,
      });
      setInputUrl('');
      setPreviewSetup(null);
      onClose();
    }
  };

  const handleSampleClick = (sample: typeof QUICK_SAMPLES[0]) => {
    setInputUrl(`${sample.owner}/${sample.repo}`);
    setSelectedCategory(sample.category);
    handleFetchPreview(sample.owner, sample.repo);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden my-8 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Track New Software Setup</h3>
              <p className="text-xs text-slate-400">Connect any public or private GitHub repository</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="py-5 space-y-5">
          {/* Quick Sample Buttons */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Or Try Quick Open-Source Samples:
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_SAMPLES.map((sample) => (
                <button
                  key={sample.repo}
                  type="button"
                  onClick={() => handleSampleClick(sample)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:text-indigo-300 text-slate-300 transition-all flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>{sample.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* GitHub Repo Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              GitHub Repository URL or <code className="text-indigo-400 font-mono">owner/repo</code>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Github className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="e.g. username/my-software or https://github.com/owner/repo"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFetchPreview();
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => handleFetchPreview()}
                disabled={isLoading || !inputUrl.trim()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Verify Repo</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Software Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-950/40 border border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Fetched Preview Box */}
          {previewSetup && (
            <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Successfully Verified GitHub Repository!</span>
              </div>

              <div className="flex items-center gap-3">
                {previewSetup.iconUrl && (
                  <img
                    src={previewSetup.iconUrl}
                    alt={previewSetup.displayName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-800"
                  />
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{previewSetup.displayName}</h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {previewSetup.owner}/{previewSetup.repo} • {previewSetup.releases.length} releases found
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2">{previewSetup.description}</p>

              {previewSetup.latestRelease && (
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Latest Tag: {previewSetup.latestRelease.tag_name}</span>
                  <span className="text-indigo-400 font-bold">
                    {previewSetup.latestRelease.assets.length} binary files attached
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmAdd}
            disabled={!previewSetup}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            Add Software Setup
          </button>
        </div>
      </div>
    </div>
  );
};
