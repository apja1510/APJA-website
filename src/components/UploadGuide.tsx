import React, { useState } from 'react';
import {
  Upload,
  Tag,
  FileCode,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Terminal,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Code2,
} from 'lucide-react';

export const UploadGuide: React.FC = () => {
  const [copiedAction, setCopiedAction] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'ci'>('manual');

  const githubActionYaml = `name: Build & Upload Release
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      # Build your installer binary here (e.g. Electron, Tauri, PyInstaller, C++, Go, etc.)
      - name: Build Software Installer
        run: |
          echo "Building binary executable..."
          # Replace with your build script, e.g.: npm run build:exe

      - name: Create GitHub Release & Upload Setup
        uses: softprops/action-gh-release@v1
        with:
          files: |
            dist/*.exe
            dist/*.dmg
            dist/*.AppImage
            dist/*.zip
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`;

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(githubActionYaml);
    setCopiedYamlState();
  };

  const setCopiedYamlState = () => {
    setCopiedAction(true);
    setTimeout(() => setCopiedAction(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Creator Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            How to Upload & Publish Software Setups
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Follow this simple guide each time you publish a new version or installer. Your website connects directly to GitHub Releases—so any file you upload on GitHub instantly syncs here with live download statistics!
          </p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-3 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'manual'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Manual Upload Guide (5 Clicks)</span>
        </button>

        <button
          onClick={() => setActiveTab('ci')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ci'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Automated GitHub Actions CI/CD</span>
        </button>
      </div>

      {/* MANUAL UPLOAD TAB */}
      {activeTab === 'manual' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl relative shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm font-mono">
                  01
                </span>
                <span className="text-xs text-slate-500 font-mono">On your PC / Mac</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Build Your Setup Binary File</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Compile your desktop or mobile app into an installer executable file:
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">• Windows:</span> .exe, .msi, .zip
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-slate-300 font-bold">• macOS:</span> .dmg, .pkg, .app.zip
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">• Linux:</span> .AppImage, .deb, .tar.gz
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl relative shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm font-mono">
                  02
                </span>
                <span className="text-xs text-slate-500 font-mono">GitHub Repository</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Create New GitHub Release</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Go to your repository on GitHub. Click on the <strong className="text-indigo-300">Releases</strong> link on the right sidebar, then click <strong className="text-indigo-300">"Draft a new release"</strong>.
              </p>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono">
                https://github.com/your-username/your-repo/releases/new
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl relative shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm font-mono">
                  03
                </span>
                <span className="text-xs text-slate-500 font-mono">Release Tagging</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Set Version Tag & Title</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Type a version tag like <code className="bg-slate-950 px-1.5 py-0.5 rounded text-indigo-300 font-mono">v1.0.0</code> or <code className="bg-slate-950 px-1.5 py-0.5 rounded text-indigo-300 font-mono">v1.2.0</code>. Set a clear Release Title and write release notes for users.
              </p>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
                💡 <span className="text-slate-300 font-medium">Tip:</span> Use markdown bullet points in the body for changelog notes!
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl relative shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm font-mono">
                  04
                </span>
                <span className="text-xs text-slate-500 font-mono">Attach Binaries</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Attach Installer Binaries & Publish</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Drag and drop your compiled <code className="text-indigo-300 font-mono">.exe</code>, <code className="text-indigo-300 font-mono">.dmg</code>, or <code className="text-indigo-300 font-mono">.AppImage</code> setup files into the drop box at the bottom. Once uploaded, click <strong className="text-emerald-400">"Publish Release"</strong>!
              </p>
              <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>That's it! GitHub now hosts your downloads on high-speed CDN.</span>
              </div>
            </div>
          </div>

          {/* Automatic Sync Notice */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Automatic Syncing & Download Counting</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Every time a user downloads your setup from this website or GitHub, GitHub's API increments the download counter in real-time!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CI/CD AUTOMATION TAB */}
      {activeTab === 'ci' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Automated Releases via GitHub Actions
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Place this workflow in your repository at <code className="text-indigo-300 font-mono">.github/workflows/release.yml</code>. Whenever you push a tag (e.g. <code className="text-indigo-300 font-mono">git push origin v1.0.0</code>), GitHub will automatically create the release and attach setup files!
                </p>
              </div>

              <button
                onClick={handleCopyYaml}
                className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 shrink-0"
              >
                {copiedAction ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Copied YAML!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Workflow</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800/90 rounded-2xl font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
              {githubActionYaml}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
