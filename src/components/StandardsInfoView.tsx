import React from 'react';
import { ShieldCheck, Gauge, Zap, Droplets, CheckCircle2, ArrowLeft } from 'lucide-react';

interface StandardsInfoViewProps {
  onBackToDirectory: () => void;
  onOpenImporter: () => void;
}

export const StandardsInfoView: React.FC<StandardsInfoViewProps> = ({
  onBackToDirectory,
  onOpenImporter,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDirectory}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Specification Directory</span>
        </button>

        <button
          onClick={onOpenImporter}
          className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          Import Government CSV
        </button>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="text-xs uppercase font-bold tracking-wider text-blue-600">
          Engineering Benchmark Standards
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AHRI Standard 810/820 & ENERGY STAR® Commercial Ice Maker Criteria
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Understanding testing protocols, rating conditions, and government energy efficiency benchmarks used in commercial foodservice equipment specifications.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Gauge className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            AHRI Rating Conditions
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rated at <strong>90°F (32.2°C) ambient air</strong> and <strong>70°F (21.1°C) potable water inlet</strong>. Capacity listed in this directory represents continuous 24-hour harvest under these stringent summer test conditions.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Energy Consumption Metric
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Expressed in <strong>kWh per 100 lbs of ice produced</strong>. ENERGY STAR certified commercial ice makers are roughly <strong>15% to 20% more energy efficient</strong> than baseline units, saving operators hundreds of dollars annually.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
            <Droplets className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Potable Water Consumption
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Measured in <strong>gallons of water per 100 lbs of ice</strong>. Batch cube machines use a controlled water purge cycle to remove mineral scaling, while continuous flake/nugget machines freeze nearly 100% of incoming water.
          </p>
        </div>
      </div>

      {/* Deep Dive: Equipment Configuration Types */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">
          Commercial Equipment Configurations Explained
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[10px]">
                IMH
              </span>
              <span>Ice Making Head</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Modular unit designed to mount directly onto a standalone ice storage bin, beverage dispenser, or ice transport cart. Ideal for medium-to-large restaurants and bars.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px]">
                SCU
              </span>
              <span>Self-Contained Unit</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Integrated machine housing the refrigeration system and storage bin within a single compact cabinet. Commonly installed under counters in bars, coffee shops, and breakrooms.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="font-mono bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded text-[10px]">
                RCU
              </span>
              <span>Remote Condenser</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              The compressor and condensing coil are installed outdoors or on the roof. Eliminates heat output and compressor noise in kitchen spaces, improving HVAC efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Deep Dive: Ice Types & Application Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">
          Ice Form Performance & Commercial Application Matrix
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                <th className="py-2.5 px-3">Ice Form</th>
                <th className="py-2.5 px-3">Melt Rate</th>
                <th className="py-2.5 px-3">Displacement</th>
                <th className="py-2.5 px-3">Primary Commercial Application</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Cube / Dice</td>
                <td className="py-2.5 px-3 text-slate-600">Slowest (High Density)</td>
                <td className="py-2.5 px-3 text-slate-600">Moderate</td>
                <td className="py-2.5 px-3 text-slate-600">Cocktail lounges, liquor service, ice baggers, banquets</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Crescent Cube</td>
                <td className="py-2.5 px-3 text-slate-600">Slow</td>
                <td className="py-2.5 px-3 text-slate-600">High (Individual flow)</td>
                <td className="py-2.5 px-3 text-slate-600">Beverage dispensers, fast-food dining, hotels</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Nugget / Chewblet</td>
                <td className="py-2.5 px-3 text-slate-600">Medium (Soft / Chewable)</td>
                <td className="py-2.5 px-3 text-slate-600">Highest liquid displacement</td>
                <td className="py-2.5 px-3 text-slate-600">Quick service (Sonic-style), smoothies, patient hydration</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Flake Ice</td>
                <td className="py-2.5 px-3 text-slate-600">Fast (73% Ice Hardness)</td>
                <td className="py-2.5 px-3 text-slate-600">Moldable / Bedding</td>
                <td className="py-2.5 px-3 text-slate-600">Seafood displays, salad bars, physical therapy cold therapy</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
