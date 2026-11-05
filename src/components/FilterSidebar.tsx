import React from 'react';
import { FilterState, IceType, EquipmentType, CondenserType } from '../types/iceMachine';
import { RotateCcw, Zap, Droplets, Check, ShieldCheck } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableBrands: { name: string; count: number }[];
  maxHarvestRate: number;
  totalLoaded: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  availableBrands,
  maxHarvestRate,
  totalLoaded,
}) => {
  const iceTypeOptions: { type: IceType; label: string }[] = [
    { type: 'Cube', label: 'Cube & Dice' },
    { type: 'Nugget', label: 'Nugget / Chewable' },
    { type: 'Flake', label: 'Flake Ice' },
    { type: 'Crescent', label: 'Crescent' },
    { type: 'Gourmet', label: 'Gourmet / Top Hat' },
  ];

  const equipmentOptions: { type: EquipmentType; label: string; sub: string }[] = [
    { type: 'IMH', label: 'Ice Making Head (IMH)', sub: 'Modular unit on top of bin' },
    { type: 'SCU', label: 'Self-Contained (SCU)', sub: 'Integrated storage bin under counter' },
    { type: 'RCU', label: 'Remote Condenser (RCU)', sub: 'Compressor on roof or outdoors' },
  ];

  const coolingOptions: { type: CondenserType; label: string }[] = [
    { type: 'Air-Cooled', label: 'Air-Cooled' },
    { type: 'Water-Cooled', label: 'Water-Cooled' },
    { type: 'Remote Air-Cooled', label: 'Remote Air-Cooled' },
  ];

  const handleBrandToggle = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: next });
  };

  const handleIceTypeToggle = (type: IceType) => {
    const next = filters.iceTypes.includes(type)
      ? filters.iceTypes.filter((t) => t !== type)
      : [...filters.iceTypes, type];
    onFilterChange({ ...filters, iceTypes: next });
  };

  const handleEquipTypeToggle = (type: EquipmentType) => {
    const next = filters.equipmentTypes.includes(type)
      ? filters.equipmentTypes.filter((t) => t !== type)
      : [...filters.equipmentTypes, type];
    onFilterChange({ ...filters, equipmentTypes: next });
  };

  const handleCoolingToggle = (type: CondenserType) => {
    const next = filters.coolingTypes.includes(type)
      ? filters.coolingTypes.filter((c) => c !== type)
      : [...filters.coolingTypes, type];
    onFilterChange({ ...filters, coolingTypes: next });
  };

  const handleReset = () => {
    onFilterChange({
      searchQuery: '',
      brands: [],
      iceTypes: [],
      productionMin: 0,
      productionMax: Math.max(maxHarvestRate, 2500),
      energyMaxKwh: 12.0,
      equipmentTypes: [],
      coolingTypes: [],
      energyStarOnly: false,
      sortBy: 'production-desc',
    });
  };

  const isFiltered =
    filters.brands.length > 0 ||
    filters.iceTypes.length > 0 ||
    filters.productionMin > 0 ||
    filters.productionMax < maxHarvestRate ||
    filters.energyMaxKwh < 12.0 ||
    filters.equipmentTypes.length > 0 ||
    filters.coolingTypes.length > 0 ||
    filters.energyStarOnly ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 divide-y divide-slate-100 shadow-xs">
      {/* Header & Reset */}
      <div className="pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Specification Filters
          </h2>
          <span className="text-xs text-slate-500">
            Filter by technical parameters
          </span>
        </div>
        {isFiltered && (
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Daily Ice Production (lbs/24h) */}
      <div className="py-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Daily Ice Production (lbs)
          </label>
          <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
            {filters.productionMin} – {filters.productionMax >= 2500 ? '2,500+' : `${filters.productionMax}`} lbs/day
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">Min:</span>
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
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">Max:</span>
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
          </div>
        </div>

        {/* Quick Capacity Presets */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
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
            onClick={() => onFilterChange({ ...filters, productionMin: 600, productionMax: 1000 })}
            className={`px-2 py-1 text-[11px] font-medium rounded border transition-colors text-left ${
              filters.productionMin === 600 && filters.productionMax === 1000
                ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            600 – 1,000 lbs <span className="block text-[10px] text-slate-400">High-volume kitchen</span>
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, productionMin: 1000, productionMax: 2500 })}
            className={`px-2 py-1 text-[11px] font-medium rounded border transition-colors text-left ${
              filters.productionMin === 1000 && filters.productionMax === 2500
                ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            1,000+ lbs <span className="block text-[10px] text-slate-400">Hotel / Stadium / Commissary</span>
          </button>
        </div>
      </div>

      {/* Energy Efficiency: Max Energy Use Rate (kWh / 100 lbs ice) */}
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
          Lower values signify higher energy efficiency under AHRI 810 test conditions.
        </p>
        <input
          type="range"
          min={3.0}
          max={10.0}
          step={0.1}
          value={filters.energyMaxKwh}
          onChange={(e) =>
            onFilterChange({ ...filters, energyMaxKwh: parseFloat(e.target.value) })
          }
          className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>3.0 (Super Efficient)</span>
          <span>6.0 (Mid)</span>
          <span>10.0+ (Standard)</span>
        </div>
      </div>

      {/* Ice Type (Cube, Flake, Nugget...) */}
      <div className="py-4 space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Ice Type / Shape
        </label>
        <div className="space-y-1.5">
          {iceTypeOptions.map((opt) => {
            const checked = filters.iceTypes.includes(opt.type);
            return (
              <label
                key={opt.type}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      checked
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-medium text-slate-700">{opt.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Brand Selector */}
      <div className="py-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Brand / Manufacturer
          </label>
          {filters.brands.length > 0 && (
            <button
              onClick={() => onFilterChange({ ...filters, brands: [] })}
              className="text-[11px] text-blue-600 hover:text-blue-800 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {availableBrands.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No brands loaded yet. Import CSV to populate manufacturers.
          </p>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {availableBrands.map((b) => {
              const checked = filters.brands.includes(b.name);
              return (
                <label
                  key={b.name}
                  className="flex items-center justify-between px-2 py-1 rounded hover:bg-slate-50 cursor-pointer text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                        checked
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className="font-medium text-slate-700 truncate max-w-[140px]">
                      {b.name}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                    {b.count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Equipment Type (IMH, SCU, RCU) */}
      <div className="py-4 space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Equipment Configuration
        </label>
        <div className="space-y-1.5">
          {equipmentOptions.map((opt) => {
            const checked = filters.equipmentTypes.includes(opt.type);
            return (
              <label
                key={opt.type}
                className="flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer text-xs transition-colors"
              >
                <div
                  className={`w-3.5 h-3.5 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    checked
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <div>
                  <div className="font-medium text-slate-800">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{opt.sub}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Condenser Cooling Type */}
      <div className="py-4 space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Condenser Cooling Type
        </label>
        <div className="space-y-1">
          {coolingOptions.map((opt) => {
            const checked = filters.coolingTypes.includes(opt.type);
            return (
              <label
                key={opt.type}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer text-xs transition-colors"
              >
                <div
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                    checked
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span className="font-medium text-slate-700">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ENERGY STAR Verified Only */}
      <div className="pt-4">
        <label className="flex items-start gap-2.5 p-2 rounded-lg bg-blue-50/70 border border-blue-100 cursor-pointer transition-colors hover:bg-blue-50">
          <input
            type="checkbox"
            checked={filters.energyStarOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, energyStarOnly: e.target.checked })
            }
            className="mt-0.5 accent-blue-600 cursor-pointer"
          />
          <div>
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>ENERGY STAR® Only</span>
            </div>
            <div className="text-[11px] text-blue-700 leading-snug">
              Display models certified under EPA program requirements.
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};
