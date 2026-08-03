import React from 'react';
import { OSPlatform } from '../types';
import { Monitor, Apple, Terminal, Smartphone, ShieldAlert } from 'lucide-react';

interface OSBadgeProps {
  platform: OSPlatform;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const OSBadge: React.FC<OSBadgeProps> = ({ platform, showLabel = true, size = 'sm' }) => {
  let icon = <Monitor className="w-3.5 h-3.5" />;
  let label = 'Windows';
  let colorClass = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

  switch (platform) {
    case 'windows':
      icon = <Monitor className="w-3.5 h-3.5" />;
      label = 'Windows';
      colorClass = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      break;
    case 'macos':
      icon = <Apple className="w-3.5 h-3.5" />;
      label = 'macOS';
      colorClass = 'bg-slate-500/10 text-slate-300 border-slate-500/20';
      break;
    case 'linux':
      icon = <Terminal className="w-3.5 h-3.5" />;
      label = 'Linux';
      colorClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      break;
    case 'android':
      icon = <Smartphone className="w-3.5 h-3.5" />;
      label = 'Android';
      colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      break;
    case 'ios':
      icon = <Smartphone className="w-3.5 h-3.5" />;
      label = 'iOS';
      colorClass = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      break;
    default:
      icon = <ShieldAlert className="w-3.5 h-3.5" />;
      label = 'Binary';
      colorClass = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${colorClass} ${sizeClasses[size]}`}
    >
      {icon}
      {showLabel && <span>{label}</span>}
    </span>
  );
};
