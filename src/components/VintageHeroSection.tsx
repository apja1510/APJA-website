import React from 'react';
import { ArrowDown, Plus, Settings, RefreshCw, Layers, HelpCircle } from 'lucide-react';

interface VintageHeroProps {
  onExploreClick: () => void;
  onGuideClick: () => void;
  onAddClick: () => void;
  onSettingsClick: () => void;
  onRefreshClick: () => void;
  isRefreshing: boolean;
  totalSetups: number;
  totalDownloads: number;
  themeStyle: 'vintage' | 'dark';
  onToggleTheme: (theme: 'vintage' | 'dark') => void;
}

export const VintageHeroSection: React.FC<VintageHeroProps> = ({
  onExploreClick,
  onGuideClick,
  onAddClick,
  onSettingsClick,
  onRefreshClick,
  isRefreshing,
  totalSetups,
  totalDownloads,
  themeStyle,
  onToggleTheme,
}) => {
  const isVintage = themeStyle === 'vintage';

  return (
    <div className="relative w-full overflow-hidden border-b border-[#191a1c] bg-[#dcdcd3] text-[#191a1c] select-none">
      
      {/* Top Brand Bar replacing Navbar */}
      <div className="max-w-[1400px] mx-auto px-6 py-4 border-b border-[#191a1c] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 font-syne font-extrabold text-lg sm:text-xl tracking-tight bg-[#191a1c] text-[#dcdcd3] flex items-center gap-2">
            <span>OldSoul</span>
            <span className="font-mono text-xs font-normal opacity-80 uppercase tracking-widest border-l border-white/20 pl-2">
              Builds.
            </span>
          </div>
        </div>

        {/* Quick Hero Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onToggleTheme(isVintage ? 'dark' : 'vintage')}
            className="px-3 py-1.5 rounded-full text-xs font-mono font-bold border border-[#191a1c]/30 bg-[#191a1c]/10 text-[#191a1c] hover:bg-[#191a1c]/20 transition-all"
            title="Toggle Visual Theme Style"
          >
            {isVintage ? '✦ VINTAGE' : '✦ DARK'}
          </button>

          <button
            onClick={onRefreshClick}
            disabled={isRefreshing}
            title="Refresh Repository Releases"
            className="p-2 border border-[#191a1c]/30 hover:bg-[#191a1c]/10 rounded-lg transition-colors text-[#191a1c]"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onSettingsClick}
            title="GitHub API Settings"
            className="p-2 border border-[#191a1c]/30 hover:bg-[#191a1c]/10 rounded-lg transition-colors text-[#191a1c]"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-5 py-2 bg-[#191a1c] hover:bg-[#2b2d31] text-[#dcdcd3] font-mono text-xs font-bold uppercase tracking-wider rounded-full transition-transform active:scale-95 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload My App</span>
          </button>
        </div>
      </div>

      {/* Top Split Canvas Layout */}
      <div className="max-w-[1400px] mx-auto min-h-[520px] lg:min-h-[620px] grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* Left Column (5/12): Architectural Facade Image & Bracket Accent */}
        <div className="lg:col-span-5 relative bg-[#cfcfc4] border-r border-[#191a1c] min-h-[380px] lg:min-h-full flex flex-col justify-between p-6 sm:p-8 overflow-hidden">
          
          {/* Top Bracket Motif */}
          <div className="flex items-center justify-between z-10">
            <span className="font-mono text-xl text-[#191a1c] font-bold tracking-widest">{`{  }`}</span>
            <span className="font-mono text-xs uppercase tracking-widest bg-[#191a1c] text-[#dcdcd3] px-3 py-1 rounded-full">
              EST. 2026
            </span>
          </div>

          {/* Background Architectural Facade Grayscale Image */}
          <div className="absolute inset-0 opacity-45 mix-blend-multiply pointer-events-none z-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
              alt="Classic Architectural Facade"
              className="w-full h-full object-cover grayscale contrast-125 brightness-95"
            />
          </div>

          {/* Slashes Decorator */}
          <div className="absolute top-1/3 left-10 font-mono text-sm text-[#191a1c]/60 select-none z-10">
            \\ \\
          </div>

          {/* Bottom Pill Action Bar */}
          <div className="z-10 mt-auto pt-8">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-[#191a1c] hover:bg-[#2c2e33] text-[#dcdcd3] font-mono text-xs font-bold uppercase tracking-wider rounded-2xl shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="w-5 h-5 rounded-full border border-[#dcdcd3]/40 flex items-center justify-center">
                <ArrowDown className="w-3 h-3 text-[#dcdcd3]" />
              </div>
              <span>JOURNEY THROUGH OUR PROJECTS</span>
            </button>
          </div>
        </div>

        {/* Right Column (7/12): Massive Header, Capsule Button, Statements, Inset Cathedral Photo */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative bg-[#dcdcd3]">
          
          {/* Slashes Decorator */}
          <div className="absolute top-8 right-12 font-mono text-sm text-[#191a1c]/40 hidden sm:block">
            \\ \\
          </div>

          {/* Massive Display Title Overlap Container */}
          <div className="relative pt-4 pb-8 z-10">
            
            {/* Main Headline Stack: VINTAGE LOOK MODERN BUILD */}
            <div className="font-syne font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#191a1c] leading-[0.9] uppercase">
              <div className="flex flex-wrap items-center gap-x-4">
                <span>VINTAGE</span>
                <span className="font-playfair italic font-normal text-4xl sm:text-6xl lg:text-7xl text-[#191a1c]/80">
                  LOOK
                </span>
                
                {/* 4-Point Star Motif inside Circle */}
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#191a1c] text-[#dcdcd3] shrink-0 my-1">
                  <span className="text-xl sm:text-2xl">✦</span>
                </div>
              </div>

              {/* Central Floating Capsule Pill: "+ UPLOAD MY APP" */}
              <div className="my-3 sm:my-4 inline-block">
                <button
                  onClick={onAddClick}
                  className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-[#dcdcd3] border-2 border-[#191a1c] font-space text-xs sm:text-sm font-bold tracking-wider text-[#191a1c] hover:bg-[#191a1c] hover:text-[#dcdcd3] transition-all shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>UPLOAD MY APP</span>
                </button>
              </div>

              <div className="block">
                MODERN BUILD
              </div>
            </div>

            {/* Inset Photo Card - Vaulted Ceiling Architecture */}
            <div className="mt-6 sm:absolute sm:top-12 sm:right-0 w-44 sm:w-56 h-32 sm:h-40 border-2 border-[#191a1c] bg-[#191a1c] p-1 shadow-2xl overflow-hidden rounded-sm transform sm:rotate-1 hover:rotate-0 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=800&q=80"
                alt="Vaulted Cathedral Architecture"
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </div>
          </div>

          {/* Mid Section Bracket & Year Indicator */}
          <div className="flex items-center justify-center py-4 my-2 font-mono text-sm text-[#191a1c] font-semibold border-y border-[#191a1c]/20">
            <span>( 2002 )</span>
          </div>

          {/* Statement Text Block */}
          <div className="my-6 space-y-4">
            <h2 className="font-syne font-bold text-xl sm:text-2xl lg:text-3xl text-[#191a1c] uppercase leading-snug tracking-tight max-w-2xl">
              WE'RE NOT JUST BUILDERS. WE'RE PROBLEM SOLVERS, INNOVATORS, AND YOUR TRUSTED PARTNERS.
            </h2>
          </div>

          {/* Bottom Detailed Paragraph & Slashes */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-4 border-t border-[#191a1c]/20">
            <div className="md:col-span-4 font-mono text-xs text-[#191a1c]/60 space-y-1">
              <div>\\ \\</div>
              <div className="font-bold text-[#191a1c]">TRACKED REPOS: {totalSetups}</div>
              <div className="font-bold text-[#191a1c]">DOWNLOADS: {totalDownloads.toLocaleString()}</div>
            </div>

            <div className="md:col-span-8 font-space text-xs sm:text-sm text-[#191a1c]/80 leading-relaxed uppercase tracking-wider font-medium">
              WITH OVER 22 YEARS OF EXPERIENCE IN THE INDUSTRY, WE'RE PASSIONATE ABOUT REVIVING CLASSIC ARCHITECTURAL STYLES, FROM VICTORIAN HOMES TO MID-CENTURY MODERN BUILDINGS.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
