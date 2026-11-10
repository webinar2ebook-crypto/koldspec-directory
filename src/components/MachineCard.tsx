import React from 'react';
import { IceMachine } from '../types/iceMachine';
import { Zap, Droplets, Gauge, ShieldCheck, CheckSquare, Square, FileText, Box, Sparkles, Snowflake, Layers, Award } from 'lucide-react';

interface MachineCardProps {
  machine: IceMachine;
  onSelect: (machine: IceMachine) => void;
  isCompared: boolean;
  onToggleCompare: (machine: IceMachine) => void;
  onOpenQuote?: (machine: IceMachine) => void;
}

const renderIceIcon = (iceType: string) => {
  switch (iceType) {
    case 'Nugget':
      return <Sparkles className="w-4 h-4 text-cyan-600" />;
    case 'Flake':
      return <Snowflake className="w-4 h-4 text-sky-600" />;
    case 'Crescent':
      return <Layers className="w-4 h-4 text-indigo-600" />;
    case 'Gourmet':
      return <Award className="w-4 h-4 text-amber-600" />;
    case 'Cube':
    default:
      return <Box className="w-4 h-4 text-blue-600" />;
  }
};

export const MachineCard: React.FC<MachineCardProps> = ({
  machine,
  onSelect,
  isCompared,
  onToggleCompare,
  onOpenQuote,
}) => {
  // Standard energy cost calculation (AHRI 810 estimate: 365 days, 100 lbs/day ratio, $0.14/kWh)
  const annualLbsProduced = machine.harvestRateLbs * 365;
  const annualKwhUsed = (annualLbsProduced / 100) * machine.energyUseRateKwh;
  const estimatedAnnualEnergyCost = Math.round(annualKwhUsed * 0.14);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden group">
      {/* Top Header & Visual */}
      <div>
        <div className="p-5 pb-3">
          {/* Top Unboxed Metadata & Compare Toggle */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-slate-900 font-semibold">{machine.brand}</span>
              <span aria-hidden="true">·</span>
              <span>{machine.equipmentType}</span>
              {machine.energyStarCertified && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-blue-700 font-medium flex items-center gap-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 inline text-blue-600" />
                    ENERGY STAR®
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => onToggleCompare(machine)}
              className={`flex items-center gap-1 text-[11px] font-medium transition-colors px-2 py-0.5 rounded ${
                isCompared
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
              title="Add to side-by-side comparison"
            >
              {isCompared ? (
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
              <span>Compare</span>
            </button>
          </div>

          {/* Model Title */}
          <h3
            onClick={() => onSelect(machine)}
            className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer leading-tight"
          >
            {machine.modelNumber}
          </h3>
          {machine.modelName && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {machine.modelName}
            </p>
          )}
        </div>

        {/* Ice Type & Spec Snapshot Bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-y border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
              {renderIceIcon(machine.iceType)}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">
                {machine.iceType} Ice
              </div>
              <div className="text-[11px] text-slate-500">
                {machine.condenserCooling}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
              Refrigerant
            </span>
            <span className="font-mono text-xs font-medium text-slate-700">
              {machine.refrigerant || 'Standard HFC'}
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="p-5 grid grid-cols-2 gap-4">
          {/* Daily Ice Production */}
          <div>
            <div className="flex items-center gap-1 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
              <Gauge className="w-3 h-3 text-blue-500" />
              <span>Harvest Rate</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {machine.harvestRateLbs.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-slate-500">lbs / 24h</span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              AHRI 90°F air / 70°F water
            </span>
          </div>

          {/* Energy Use Rate */}
          <div>
            <div className="flex items-center gap-1 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Energy Use</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {machine.energyUseRateKwh.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-slate-500">kWh/100 lbs</span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              Est. ${estimatedAnnualEnergyCost.toLocaleString()}/yr electric
            </span>
          </div>
        </div>

        {/* Secondary Specs Row */}
        <div className="px-5 pb-3 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-cyan-600" />
            <span>Potable Water:</span>
            <strong className="font-mono text-slate-800 tabular-nums">
              {machine.potableWaterUseGal !== undefined
                ? `${machine.potableWaterUseGal} gal/100 lbs`
                : 'N/A'}
            </strong>
          </div>

          {machine.certifiedDate && (
            <div className="text-[11px] text-slate-400">
              Cert: {machine.certifiedDate}
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer with Thumb-Friendly Mobile Targets */}
      <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => onSelect(machine)}
          style={{ cursor: 'pointer' }}
          className="flex-1 py-3 sm:py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors text-center shadow-2xs active:scale-[0.99] cursor-pointer min-h-[44px] sm:min-h-0 flex items-center justify-center"
        >
          View Specs
        </button>
        <button
          type="button"
          onClick={() => onOpenQuote?.(machine)}
          style={{ cursor: 'pointer' }}
          className="flex-1 py-3 sm:py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-center shadow-2xs active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] sm:min-h-0"
          title="Get a commercial quote for this model"
        >
          <FileText className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span>Get a Quote</span>
        </button>
      </div>
    </div>
  );
};
