import React from 'react';
import { Database, Upload, BarChart3, FileText } from 'lucide-react';

interface NavbarProps {
  currentView: 'directory' | 'table' | 'standards' | 'blog' | 'quote';
  onViewChange: (view: 'directory' | 'table' | 'standards' | 'blog' | 'quote') => void;
  onOpenImporter: () => void;
  onOpenCompare: () => void;
  compareCount: number;
  totalMachines: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenImporter,
  onOpenCompare,
  compareCount,
  totalMachines,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onViewChange('directory')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-sm tracking-wider">
              KS
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
                KoldSpec
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                Commercial Ice Directory
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onViewChange('directory')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 py-1 ${
              currentView === 'directory' ? 'text-slate-900 border-b-2 border-slate-900 font-semibold' : ''
            }`}
          >
            Directory Catalog
          </button>
          <button
            onClick={() => onViewChange('table')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 py-1 flex items-center gap-1.5 ${
              currentView === 'table' ? 'text-slate-900 border-b-2 border-slate-900 font-semibold' : ''
            }`}
          >
            Specification Table
            {totalMachines > 0 && (
              <span className="font-mono text-xs text-slate-500">({totalMachines})</span>
            )}
          </button>
          <button
            onClick={onOpenCompare}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 py-1 flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>Compare Models</span>
            {compareCount > 0 && (
              <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[11px] font-semibold rounded font-mono">
                {compareCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onViewChange('standards')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 py-1 ${
              currentView === 'standards' ? 'text-slate-900 border-b-2 border-slate-900 font-semibold' : ''
            }`}
          >
            AHRI / ENERGY STAR Standards
          </button>
          <button
            onClick={() => onViewChange('blog')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 py-1 ${
              currentView === 'blog' ? 'text-slate-900 border-b-2 border-slate-900 font-semibold' : ''
            }`}
          >
            Guides
          </button>
          <button
            onClick={() => onViewChange('quote')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 font-semibold ${
              currentView === 'quote'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            Get a Quote
          </button>
        </nav>

        {/* Zone 3: Actions & Dataset Status */}
        <div className="flex items-center gap-3 shrink-0">
          {totalMachines > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-slate-800">ENERGY STAR®</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="font-mono text-[11px] text-slate-600 tabular-nums font-semibold">
                {totalMachines} models
              </span>
            </div>
          )}

          <button
            onClick={() => onViewChange('quote')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shadow-xs active:scale-[0.99] cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Get a Quote</span>
          </button>

          <button
            onClick={onOpenImporter}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shadow-2xs active:scale-[0.99]"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Import CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
};

