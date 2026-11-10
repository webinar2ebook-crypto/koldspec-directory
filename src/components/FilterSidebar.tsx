import React, { useState } from 'react';
import { FilterState, IceType, EquipmentType, CondenserType } from '../types/iceMachine';
import { RotateCcw, Zap, Search, ShieldCheck, X } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableBrands: { name: string; count: number }[];
  maxHarvestRate: number;
  totalLoaded: number;
  iceTypeCounts?: Map<string, number>;
  equipmentTypeCounts?: Map<string, number>;
  coolingTypeCounts?: Map<string, number>;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  availableBrands,
  maxHarvestRate,
  totalLoaded,
  iceTypeCounts,
  equipmentTypeCounts,
  coolingTypeCounts,
}) => {
  const [brandSearch, setBrandSearch] = useState('');

  const iceTypeOptions: { type: IceType; label: string }[] = [
    { type: 'Cube', label: 'Cube & Dice' },
    { type: 'Nugget', label: 'Nugget / Chewable' },
    { type: 'Flake', label: 'Flake Ice' },
    { type: 'Crescent', label: 'Crescent Cube' },
    { type: 'Gourmet', label: 'Gourmet / Top Hat' },
  ];

  const equipmentOptions: { type: EquipmentType; label: string; sub: string }[] = [
    { type: 'IMH', label: 'Ice Making Head (IMH)', sub: 'Modular unit on top of bin' },
    { type: 'SCU', label: 'Self-Contained (SCU)', sub: 'Integrated storage bin undercounter' },
    { type: 'RCU', label: 'Remote Condenser (RCU)', sub: 'Compressor on roof or outdoors' },
  ];

  const coolingOptions: { type: CondenserType; label: string }[] = [
    { type: 'Air-Cooled', label: 'Air-Cooled' },
    { type: 'Water-Cooled', label: 'Water-Cooled' },
    { type: 'Remote Air-Cooled', label: 'Remote Air-Cooled' },
  ];

  // Toggle brand checkbox
  const handleBrandToggle = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: next });
  };

  // Toggle ice type checkbox
  const handleIceTypeToggle = (type: IceType) => {
    const next = filters.iceTypes.includes(type)
      ? filters.iceTypes.filter((t) => t !== type)
      : [...filters.iceTypes, type];
    onFilterChange({ ...filters, iceTypes: next });
  };

  // Toggle equipment type checkbox
  const handleEquipTypeToggle = (type: EquipmentType) => {
    const next = filters.equipmentTypes.includes(type)
      ? filters.equipmentTypes.filter((t) => t !== type)
      : [...filters.equipmentTypes, type];
    onFilterChange({ ...filters, equipmentTypes: next });
  };

  // Toggle cooling type checkbox
  const handleCoolingToggle = (type: CondenserType) => {
    const next = filters.coolingTypes.includes(type)
      ? filters.coolingTypes.filter((c) => c !== type)
      : [...filters.coolingTypes, type];
    onFilterChange({ ...filters, coolingTypes: next });
  };

  // Reset all filters to default empty state
  const handleReset = () => {
    onFilterChange({
      searchQuery: '',
      brands: [],
      iceTypes: [],
      productionMin: 0,
      productionMax: 2500,
      energyMaxKwh: 12.0,
      equipmentTypes: [],
      coolingTypes: [],
      energyStarOnly: false,
      sortBy: 'production-desc',
    });
    setBrandSearch('');
  };

  // Filter available brands by search term
  const filteredBrandList = availableBrands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.trim().toLowerCase())
  );

  // Total active filter count
  const activeFilterCount =
    filters.brands.length +
    filters.iceTypes.length +
    filters.equipmentTypes.length +
    filters.coolingTypes.length +
    (filters.productionMin > 0 ? 1 : 0) +
    (filters.productionMax < 2500 ? 1 : 0) +
    (filters.energyMaxKwh < 12.0 ? 1 : 0) +
    (filters.energyStarOnly ? 1 : 0) +
    (filters.searchQuery.trim() !== '' ? 1 : 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 divide-y divide-slate-100 shadow-xs">
      {/* Header & Reset */}
      <div className="pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Specification Filters
            </h2>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full font-mono">
                {activeFilterCount} active
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500">
            Filter by technical parameters
          </span>
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors py-1 px-1.5 rounded hover:bg-blue-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Active Filter Tags / Chips for quick dismissal */}
      {activeFilterCount > 0 && (
        <div className="py-3 flex flex-wrap gap-1.5">
          {filters.brands.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => handleBrandToggle(b)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium hover:bg-blue-100 transition-colors"
              title={`Remove ${b} filter`}
            >
              <span>{b}</span>
              <X className="w-3 h-3 text-blue-500" />
            </button>
          ))}
          {filters.iceTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleIceTypeToggle(t)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-medium hover:bg-indigo-100 transition-colors"
              title={`Remove ${t} ice filter`}
            >
              <span>{t} Ice</span>
              <X className="w-3 h-3 text-indigo-500" />
            </button>
          ))}
          {filters.equipmentTypes.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => handleEquipTypeToggle(e)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-medium hover:bg-slate-200 transition-colors"
              title={`Remove ${e} filter`}
            >
              <span>{e}</span>
              <X className="w-3 h-3 text-slate-500" />
            </button>
          ))}
          {filters.coolingTypes.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleCoolingToggle(c)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-medium hover:bg-slate-200 transition-colors"
              title={`Remove ${c} filter`}
            >
              <span>{c}</span>
              <X className="w-3 h-3 text-slate-500" />
            </button>
          ))}
        </div>
      )}

      {/* 1. Ice Type / Shape Filter */}
      <div className="py-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Ice Type / Shape
          </label>
          {filters.iceTypes.length > 0 && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, iceTypes: [] })}
              className="text-[11px] text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1">
          {iceTypeOptions.map((opt) => {
            const checked = filters.iceTypes.includes(opt.type);
            const count = iceTypeCounts?.get(opt.type);
            return (
              <label
                key={opt.type}
                htmlFor={`filter-ice-${opt.type}`}
                className={`flex items-center justify-between px-3 py-2.5 sm:py-1.5 rounded-lg cursor-pointer text-xs transition-colors select-none min-h-[44px] sm:min-h-0 ${
                  checked ? 'bg-blue-50/80 font-semibold text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`filter-ice-${opt.type}`}
                    checked={checked}
                    onChange={() => handleIceTypeToggle(opt.type)}
                    className="w-5 h-5 sm:w-4 sm:h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 shrink-0"
                  />
                  <span className="text-sm sm:text-xs">{opt.label}</span>
                </div>
                {count !== undefined && (
                  <span className={`font-mono text-xs sm:text-[11px] tabular-nums ${checked ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                    {count}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Brand / Manufacturer Filter */}
      <div className="py-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Brand / Manufacturer
          </label>
          {filters.brands.length > 0 && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, brands: [] })}
              className="text-[11px] text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              Clear ({filters.brands.length})
            </button>
          )}
        </div>

        {availableBrands.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No brands loaded yet.
          </p>
        ) : (
          <>
            {/* Quick search inside 40 brands */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brands (e.g. Hoshizaki)..."
                className="w-full pl-8 pr-7 py-2 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
              />
              {brandSearch && (
                <button
                  type="button"
                  onClick={() => setBrandSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="max-h-56 sm:max-h-48 overflow-y-auto space-y-1 sm:space-y-0.5 pr-1 custom-scrollbar">
              {filteredBrandList.length === 0 ? (
                <div className="py-2 text-center text-xs text-slate-400">
                  No brand matching "{brandSearch}"
                </div>
              ) : (
                filteredBrandList.map((b) => {
                  const checked = filters.brands.includes(b.name);
                  return (
                    <label
                      key={b.name}
                      htmlFor={`filter-brand-${b.name.replace(/[^a-zA-Z0-9]/g, '_')}`}
                      className={`flex items-center justify-between px-2.5 py-2 sm:py-1 rounded-md cursor-pointer text-xs transition-colors select-none min-h-[40px] sm:min-h-0 ${
                        checked ? 'bg-blue-50/80 font-semibold text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          id={`filter-brand-${b.name.replace(/[^a-zA-Z0-9]/g, '_')}`}
                          checked={checked}
                          onChange={() => handleBrandToggle(b.name)}
                          className="w-5 h-5 sm:w-3.5 sm:h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 shrink-0"
                        />
                        <span className="truncate max-w-[150px] text-sm sm:text-xs">
                          {b.name}
                        </span>
                      </div>
                      <span className={`font-mono text-xs sm:text-[11px] tabular-nums shrink-0 ml-1 ${checked ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                        {b.count}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* 3. Daily Ice Production (lbs/24h) */}
      <div className="py-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Daily Ice Production
          </label>
          <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
            {filters.productionMin} – {filters.productionMax >= 2500 ? '2,500+' : `${filters.productionMax}`} lbs/day
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono w-8">Min:</span>
            <input
              type="range"
              min={0}
              max={1500}
              step={50}
              value={filters.productionMin}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  productionMin: Math.min(Number(e.target.value), filters.productionMax - 50),
                })
              }
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <span className="text-[11px] font-mono text-slate-600 w-12 text-right">{filters.productionMin} lbs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono w-8">Max:</span>
            <input
              type="range"
              min={100}
              max={2500}
              step={50}
              value={filters.productionMax}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  productionMax: Math.max(Number(e.target.value), filters.productionMin + 50),
                })
              }
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <span className="text-[11px] font-mono text-slate-600 w-12 text-right">
              {filters.productionMax >= 2500 ? '2500+' : `${filters.productionMax}`} lbs
            </span>
          </div>
        </div>

        {/* Quick Capacity Presets */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, productionMin: 0, productionMax: 300 })}
            className={`px-2 py-1 text-[11px] font-medium rounded border transition-colors text-left ${
              filters.productionMin === 0 && filters.productionMax === 300
                ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Under 300 lbs <span className="block text-[10px] text-slate-400">Under-counter / Bar</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, productionMin: 300, productionMax: 600 })}
            className={`px-2 py-1 text-[11px] font-medium rounded border transition-colors text-left ${
              filters.productionMin === 300 && filters.productionMax === 600
                ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            300 – 600 lbs <span className="block text-[10px] text-slate-400">Casual dining</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, productionMin: 600, productionMax: 1000 })}
            className={`px-2 py-1 text-[11px] font-medium rounded border transition-colors text-left ${
              filters.productionMin === 600 && filters.productionMax === 1000
                ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            600 – 1,000 lbs <span className="block text-[10px] text-slate-400">High volume</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, productionMin: 1000, productionMax: 2500 })}
            className={`px-2 py-1 text-[11px] font-medium rounded border transition-colors text-left ${
              filters.productionMin === 1000 && filters.productionMax === 2500
                ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            1,000+ lbs <span className="block text-[10px] text-slate-400">Hotel / Commissary</span>
          </button>
        </div>
      </div>

      {/* 4. Energy Efficiency Limit */}
      <div className="py-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Energy Efficiency Limit</span>
          </label>
          <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
            ≤ {filters.energyMaxKwh.toFixed(1)} kWh/100 lbs
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">
          AHRI 810 test rating: lower kWh per 100 lbs equals higher efficiency.
        </p>
        <input
          type="range"
          min={3.0}
          max={12.0}
          step={0.1}
          value={filters.energyMaxKwh}
          onChange={(e) =>
            onFilterChange({ ...filters, energyMaxKwh: parseFloat(e.target.value) })
          }
          className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>3.0 (Super)</span>
          <span>6.0 (Mid)</span>
          <span>12.0 (All models)</span>
        </div>
      </div>

      {/* 5. Equipment Configuration (IMH, SCU, RCU) */}
      <div className="py-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Equipment Configuration
          </label>
          {filters.equipmentTypes.length > 0 && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, equipmentTypes: [] })}
              className="text-[11px] text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1">
          {equipmentOptions.map((opt) => {
            const checked = filters.equipmentTypes.includes(opt.type);
            const count = equipmentTypeCounts?.get(opt.type);
            return (
              <label
                key={opt.type}
                htmlFor={`filter-equip-${opt.type}`}
                className={`flex items-start justify-between p-3 sm:p-2 rounded-lg cursor-pointer text-xs transition-colors select-none min-h-[48px] sm:min-h-0 ${
                  checked ? 'bg-blue-50/80 font-semibold text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`filter-equip-${opt.type}`}
                    checked={checked}
                    onChange={() => handleEquipTypeToggle(opt.type)}
                    className="w-5 h-5 sm:w-4 sm:h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 shrink-0"
                  />
                  <div>
                    <div className="text-slate-800 font-medium text-sm sm:text-xs">{opt.label}</div>
                    <div className="text-[11px] sm:text-[10px] text-slate-400 font-normal">{opt.sub}</div>
                  </div>
                </div>
                {count !== undefined && (
                  <span className={`font-mono text-xs sm:text-[11px] tabular-nums ${checked ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                    {count}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. Condenser Cooling Type */}
      <div className="py-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Condenser Cooling Type
          </label>
          {filters.coolingTypes.length > 0 && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, coolingTypes: [] })}
              className="text-[11px] text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1">
          {coolingOptions.map((opt) => {
            const checked = filters.coolingTypes.includes(opt.type);
            const count = coolingTypeCounts?.get(opt.type);
            return (
              <label
                key={opt.type}
                htmlFor={`filter-cooling-${opt.type.replace(/[^a-zA-Z0-9]/g, '_')}`}
                className={`flex items-center justify-between px-3 py-2.5 sm:py-1.5 rounded-lg cursor-pointer text-xs transition-colors select-none min-h-[44px] sm:min-h-0 ${
                  checked ? 'bg-blue-50/80 font-semibold text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`filter-cooling-${opt.type.replace(/[^a-zA-Z0-9]/g, '_')}`}
                    checked={checked}
                    onChange={() => handleCoolingToggle(opt.type)}
                    className="w-5 h-5 sm:w-4 sm:h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 shrink-0"
                  />
                  <span className="text-sm sm:text-xs">{opt.label}</span>
                </div>
                {count !== undefined && (
                  <span className={`font-mono text-xs sm:text-[11px] tabular-nums ${checked ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                    {count}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* 7. ENERGY STAR Verified Only */}
      <div className="pt-4">
        <label
          htmlFor="filter-energystar"
          className="flex items-start gap-3 p-3.5 sm:p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/80 cursor-pointer transition-colors hover:bg-blue-50 select-none min-h-[48px] sm:min-h-0"
        >
          <input
            type="checkbox"
            id="filter-energystar"
            checked={filters.energyStarOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, energyStarOnly: e.target.checked })
            }
            className="w-5 h-5 sm:w-4 sm:h-4 mt-0.5 rounded border-blue-400 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 shrink-0"
          />
          <div>
            <div className="text-sm sm:text-xs font-bold text-blue-900 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-blue-600" />
              <span>ENERGY STAR® Only</span>
            </div>
            <div className="text-xs sm:text-[11px] text-blue-700 leading-snug">
              Show only models certified under EPA specification standards.
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};
