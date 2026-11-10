import React, { useState } from 'react';
import { IceMachine } from '../types/iceMachine';
import { X, ShieldCheck, Zap, Droplets, Gauge, Calculator, CheckSquare, Square, Printer, Check, Share2, Link2, FileText, Box, Sparkles, Snowflake, Layers, Award } from 'lucide-react';
import { getBaseMachineSlug, DOMAIN } from '../utils/sitemapGenerator';

interface MachineDetailModalProps {
  machine: IceMachine | null;
  onClose: () => void;
  isCompared: boolean;
  onToggleCompare: (machine: IceMachine) => void;
  onOpenQuote?: (machine: IceMachine) => void;
}

const renderIceIcon = (iceType: string, sizeClass = 'w-4 h-4') => {
  switch (iceType) {
    case 'Nugget':
      return <Sparkles className={`${sizeClass} text-cyan-600`} />;
    case 'Flake':
      return <Snowflake className={`${sizeClass} text-sky-600`} />;
    case 'Crescent':
      return <Layers className={`${sizeClass} text-indigo-600`} />;
    case 'Gourmet':
      return <Award className={`${sizeClass} text-amber-600`} />;
    case 'Cube':
    default:
      return <Box className={`${sizeClass} text-blue-600`} />;
  }
};

export const MachineDetailModal: React.FC<MachineDetailModalProps> = ({
  machine,
  onClose,
  isCompared,
  onToggleCompare,
  onOpenQuote,
}) => {
  const [kwhRate, setKwhRate] = useState<number>(0.14); // $0.14 / kWh commercial average
  const [operatingDays, setOperatingDays] = useState<number>(365);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!machine) return null;

  // Operating cost calculations
  const annualLbsProduced = machine.harvestRateLbs * operatingDays;
  const annualKwh = (annualLbsProduced / 100) * machine.energyUseRateKwh;
  const annualEnergyCost = Math.round(annualKwh * kwhRate);

  // Non-certified benchmark is ~18% higher energy consumption according to EPA ENERGY STAR criteria
  const baselineKwh = annualKwh * 1.18;
  const baselineCost = Math.round(baselineKwh * kwhRate);
  const annualSavings = Math.max(0, baselineCost - annualEnergyCost);

  // Water calculations
  const annualWaterGal = machine.potableWaterUseGal
    ? Math.round((annualLbsProduced / 100) * machine.potableWaterUseGal)
    : null;

  const handleCopyLink = () => {
    const slug = getBaseMachineSlug(machine);
    const url = `${DOMAIN}/machine/${slug}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wide">
              {machine.brand.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-800">{machine.brand}</span>
                <span aria-hidden="true">·</span>
                <span>{machine.equipmentType} Configuration</span>
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
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                {machine.modelNumber}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              title="Copy direct SEO URL for this model"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share URL</span>
                </>
              )}
            </button>

            <button
              onClick={() => onToggleCompare(machine)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                isCompared
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isCompared ? (
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
              <span>{isCompared ? 'Compared' : 'Compare'}</span>
            </button>

            <button
              onClick={() => onOpenQuote?.(machine)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
              title="Request commercial pricing for this model"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Get a Quote</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors"
              title="Print Specification Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          {/* Top Banner & Photo */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
              {renderIceIcon(machine.iceType, 'w-8 h-8')}
            </div>
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {machine.iceType} Ice Form
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {machine.modelName || `${machine.brand} Commercial ${machine.iceType} Maker`}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {machine.iceShapeDetail || `High-density ${machine.iceType} form suitable for high-volume commercial hospitality, dining, and healthcare applications.`}
              </p>
            </div>
          </div>

          {/* Primary Specification Metric Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <Gauge className="w-3.5 h-3.5 text-blue-600" />
                <span>Daily Harvest Rate</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {machine.harvestRateLbs.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-slate-500">lbs / 24h</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                AHRI Standard 810 (90°F air / 70°F water)
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Energy Use Rate</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {machine.energyUseRateKwh.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-slate-500">kWh / 100 lbs</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                AHRI tested normalized consumption
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                <span>Potable Water Rate</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {machine.potableWaterUseGal !== undefined
                    ? machine.potableWaterUseGal.toFixed(1)
                    : '—'}
                </span>
                <span className="text-xs font-semibold text-slate-500">gal / 100 lbs</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Potable drinking water consumption
              </p>
            </div>
          </div>

          {/* Interactive Annual Operating Cost Calculator */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Annual Utility & Energy Cost Estimator
                </h4>
              </div>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Est. ~${annualSavings}/yr vs. Baseline
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Electricity Rate: <strong className="font-mono text-slate-900">${kwhRate.toFixed(2)}/kWh</strong>
                </label>
                <input
                  type="range"
                  min={0.08}
                  max={0.35}
                  step={0.01}
                  value={kwhRate}
                  onChange={(e) => setKwhRate(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Operational Days/Year: <strong className="font-mono text-slate-900">{operatingDays} days</strong>
                </label>
                <input
                  type="range"
                  min={180}
                  max={365}
                  step={5}
                  value={operatingDays}
                  onChange={(e) => setOperatingDays(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200/80 text-center">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Annual Production
                </span>
                <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                  {Math.round(annualLbsProduced).toLocaleString()} lbs
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Annual Energy
                </span>
                <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                  {Math.round(annualKwh).toLocaleString()} kWh
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Annual Electric Cost
                </span>
                <span className="font-mono font-bold text-sm text-blue-700 tabular-nums">
                  ${annualEnergyCost.toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Potable Water
                </span>
                <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                  {annualWaterGal ? `${annualWaterGal.toLocaleString()} gal` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Engineering Specification Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Technical Specification Breakdown
            </h4>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              <div className="grid grid-cols-3 p-3 bg-white hover:bg-slate-50">
                <span className="text-slate-500 font-medium">Manufacturer / Partner</span>
                <span className="col-span-2 font-semibold text-slate-900">{machine.brand}</span>
              </div>

              <div className="grid grid-cols-3 p-3 bg-white hover:bg-slate-50">
                <span className="text-slate-500 font-medium">Model Number</span>
                <span className="col-span-2 font-mono font-bold text-slate-900">{machine.modelNumber}</span>
              </div>

              <div className="grid grid-cols-3 p-3 bg-white hover:bg-slate-50">
                <span className="text-slate-500 font-medium">Equipment Type</span>
                <span className="col-span-2 text-slate-800">
                  {machine.equipmentType === 'IMH' && 'Ice Making Head (Modular Head Unit)'}
                  {machine.equipmentType === 'SCU' && 'Self-Contained Unit (Integrated Under-Counter Storage)'}
                  {machine.equipmentType === 'RCU' && 'Remote Condensing Unit (Outdoor/Rooftop Condenser)'}
                  {machine.equipmentType === 'Other' && 'Commercial Ice Maker'}
                </span>
              </div>

              <div className="grid grid-cols-3 p-3 bg-white hover:bg-slate-50">
                <span className="text-slate-500 font-medium">Ice Type & Geometry</span>
                <span className="col-span-2 text-slate-800">
                  {machine.iceType} {machine.iceShapeDetail ? `(${machine.iceShapeDetail})` : ''}
                </span>
              </div>

              <div className="grid grid-cols-3 p-3 bg-white hover:bg-slate-50">
                <span className="text-slate-500 font-medium">Condenser Cooling Method</span>
                <span className="col-span-2 text-slate-800">{machine.condenserCooling}</span>
              </div>

              <div className="grid grid-cols-3 p-3 bg-white hover:bg-slate-50">
                <span className="text-slate-500 font-medium">Refrigerant Type</span>
                <span className="col-span-2 font-mono text-slate-800">{machine.refrigerant || 'Manufacturer standard'}</span>
              </div>

              <div className="grid grid-cols-3 p-3 bg-white hover:bg-slate-50">
                <span className="text-slate-500 font-medium">Electrical Supply</span>
                <span className="col-span-2 font-mono text-slate-800">{machine.voltage || 'Standard commercial phase'}</span>
              </div>

              <div className="grid grid-cols-3 p-3 bg-white hover:bg-slate-50">
                <span className="text-slate-500 font-medium">ENERGY STAR Qualification</span>
                <span className="col-span-2 text-slate-800">
                  {machine.energyStarCertified ? (
                    <span className="text-blue-700 font-semibold inline-flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      Certified ({machine.certifiedDate || 'Current specification'})
                    </span>
                  ) : (
                    'Standard Efficiency'
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Ratings verified under AHRI Standard 810/820 testing protocol.
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onOpenQuote?.(machine)}
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Get a Quote for this Model</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
