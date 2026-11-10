import React from 'react';
import { Search, SlidersHorizontal, LayoutGrid, Table, Download, UploadCloud, X, FileText } from 'lucide-react';
import { IceType } from '../types/iceMachine';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedIceTypes: IceType[];
  onToggleIceType: (type: IceType) => void;
  totalCount: number;
  filteredCount: number;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  onOpenImporter: () => void;
  onExportCsv: () => void;
  onOpenQuote?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedIceTypes,
  onToggleIceType,
  totalCount,
  filteredCount,
  viewMode,
  onViewModeChange,
  onOpenImporter,
  onExportCsv,
  onOpenQuote,
}) => {
  const iceOptions: { type: IceType; label: string; desc: string }[] = [
    { type: 'Cube', label: 'Cube & Dice', desc: 'Cocktails, beverages & banquet' },
    { type: 'Nugget', label: 'Nugget / Chewblet', desc: 'Chewable soft pellet ice' },
    { type: 'Flake', label: 'Flake Ice', desc: 'Seafood, salad bars & medical' },
    { type: 'Crescent', label: 'Crescent Cube', desc: 'Displacement & continuous flow' },
  ];

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden border-b border-slate-800">
      {/* Background imagery with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_commercial_ice_machine_1793852591869.jpg"
          alt="Commercial Ice Machine Specifications"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-25 filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Editorial Subtitle & Title */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-400 mb-2">
            <span>B2B Technical Directory</span>
            <span aria-hidden="true">·</span>
            <span>AHRI Standard 810/820</span>
            <span aria-hidden="true">·</span>
            <span>ENERGY STAR® Verified</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
            Commercial Ice Machine Specification Database
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Independent equipment benchmarking, 24-hour harvest capacity ratings, and energy consumption metrics for foodservice consultants, facility engineers, and commercial buyers.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenQuote}
              style={{ cursor: 'pointer' }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Get a Commercial Quote</span>
            </button>
            <span className="text-xs text-slate-400">
              Direct pricing, freight quotes & lead times across 651 certified models.
            </span>
          </div>
        </div>

        {/* Search Bar & Quick Controls */}
        <div className="mt-8 max-w-3xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by brand (e.g. Scotsman, Manitowoc), model number, refrigerant (R-290)..."
              className="w-full pl-12 pr-10 py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 focus:placeholder:text-slate-500 rounded-xl border border-slate-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all duration-150 outline-none backdrop-blur-md font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 p-1 text-slate-400 hover:text-white rounded-md transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Ice Type Quick Segmented Filters */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 uppercase tracking-wider">
            Ice Form:
          </span>
          {iceOptions.map((opt) => {
            const isSelected = selectedIceTypes.includes(opt.type);
            return (
              <button
                key={opt.type}
                onClick={() => onToggleIceType(opt.type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
          {selectedIceTypes.length > 0 && (
            <button
              onClick={() => {
                for (const t of selectedIceTypes) {
                  onToggleIceType(t);
                }
              }}
              className="text-xs text-slate-400 hover:text-white underline ml-2 transition-colors"
            >
              Reset Ice Types
            </button>
          )}
        </div>

        {/* Bottom Bar: Status count & View toggles */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-medium text-slate-200">
              {totalCount === 0 ? (
                <span className="text-amber-400 font-semibold">
                  Database Empty — Ready for ENERGY STAR CSV Import
                </span>
              ) : (
                <>
                  Showing <strong className="text-white font-mono">{filteredCount}</strong> of{' '}
                  <strong className="text-white font-mono">{totalCount}</strong> specification records
                </>
              )}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Tested at AHRI 90°F ambient / 70°F water</span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode switcher */}
            <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Card View</span>
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Spec Table</span>
              </button>
            </div>

            {totalCount > 0 ? (
              <button
                onClick={onExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-medium transition-colors"
                title="Export current database to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            ) : (
              <button
                onClick={onOpenImporter}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload ENERGY STAR CSV</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
