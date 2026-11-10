import React from 'react';
import { BlogArticle } from '../types/blog';
import { BarChart3, Zap, ShieldCheck, Scale, ThermometerSnowflake, CheckCircle2, ArrowDownRight, Droplets } from 'lucide-react';

interface BlogDataGraphicProps {
  article: BlogArticle;
  variant?: 'full' | 'compact';
}

export const BlogDataGraphic: React.FC<BlogDataGraphicProps> = ({ article, variant = 'full' }) => {
  const isEnergyArticle =
    article.slug === 'most-energy-efficient-ice-machines' ||
    article.category === 'Energy Efficiency' ||
    article.title.toLowerCase().includes('energy') ||
    article.tags.includes('Energy Efficiency');

  const isBuyingGuide =
    article.slug === 'how-to-choose-the-right-commercial-ice-machine-for-your-restaurant' ||
    article.category === 'Buying Guides' ||
    article.title.toLowerCase().includes('choose');

  const isStandardsArticle =
    article.slug === 'understanding-ahri-standard-810-ice-machine-ratings' ||
    article.category === 'Equipment Standards' ||
    article.title.toLowerCase().includes('ahri');

  // Compact Variant (Used for Cards in BlogIndexView)
  if (variant === 'compact') {
    if (isEnergyArticle) {
      return (
        <div className="w-full h-full p-4 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col justify-between select-none">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-blue-300 uppercase">
            <span className="flex items-center gap-1 font-semibold">
              <Zap className="w-3 h-3 text-emerald-400" />
              AHRI 810 Efficiency
            </span>
            <span className="text-slate-400">kWh/100 lbs</span>
          </div>

          {/* Mini Comparative Bars */}
          <div className="space-y-1.5 my-1">
            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-200">
                <span>Follett HCF2110R</span>
                <span className="font-mono text-emerald-400 font-bold">3.21</span>
              </div>
              <div className="w-full h-2 bg-slate-700/60 rounded-xs overflow-hidden mt-0.5">
                <div className="h-full bg-emerald-500 rounded-xs" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-300">
                <span>ICETRO IM-1700-RC</span>
                <span className="font-mono text-blue-400 font-bold">3.51</span>
              </div>
              <div className="w-full h-2 bg-slate-700/60 rounded-xs overflow-hidden mt-0.5">
                <div className="h-full bg-blue-500 rounded-xs" style={{ width: '46%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-300">
                <span>Hoshizaki KM-2600</span>
                <span className="font-mono text-blue-400 font-bold">3.61</span>
              </div>
              <div className="w-full h-2 bg-slate-700/60 rounded-xs overflow-hidden mt-0.5">
                <div className="h-full bg-blue-500 rounded-xs" style={{ width: '48%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Market Baseline</span>
                <span className="font-mono text-slate-400">7.50</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700/60 rounded-xs overflow-hidden mt-0.5">
                <div className="h-full bg-slate-500 rounded-xs" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
            <span className="text-emerald-400 font-bold">57% Less Energy</span>
            <span>651 Models Audited</span>
          </div>
        </div>
      );
    }

    if (isBuyingGuide) {
      return (
        <div className="w-full h-full p-4 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col justify-between select-none">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-blue-300 uppercase">
            <span className="flex items-center gap-1 font-semibold">
              <Scale className="w-3 h-3 text-blue-400" />
              Sizing Benchmark
            </span>
            <span className="text-slate-400">Peak Demand</span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-1">
            <div className="p-2 bg-slate-800/80 rounded border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase">Casual Dining</div>
              <div className="font-mono text-base font-bold text-white leading-tight">1.5 <span className="text-xs text-blue-300 font-normal">lbs</span></div>
              <div className="text-[9px] text-slate-400">per meal cover</div>
            </div>
            <div className="p-2 bg-slate-800/80 rounded border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase">Cocktail Bar</div>
              <div className="font-mono text-base font-bold text-white leading-tight">3.0 <span className="text-xs text-blue-300 font-normal">lbs</span></div>
              <div className="text-[9px] text-slate-400">per seat / patron</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
            <span className="text-blue-300 font-semibold">+20% Summer Buffer</span>
            <span>AHRI 90°/70° Sizing</span>
          </div>
        </div>
      );
    }

    // Default Compact Graphic
    return (
      <div className="w-full h-full p-4 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col justify-between select-none">
        <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-blue-300 uppercase">
          <span className="flex items-center gap-1 font-semibold">
            <ThermometerSnowflake className="w-3 h-3 text-cyan-400" />
            Commercial Refrigeration
          </span>
          <span className="text-slate-400">AHRI 810</span>
        </div>

        <div className="p-2.5 bg-slate-800/80 rounded border border-slate-700/60 space-y-1">
          <div className="text-[11px] font-semibold text-slate-200">90°F Ambient Air · 70°F Water</div>
          <div className="text-[10px] text-slate-400 leading-snug">
            Standard laboratory rating conditions for certified commercial ice machines.
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
          <span className="text-cyan-300 font-medium">Standard 810/820</span>
          <span>Verified Specs</span>
        </div>
      </div>
    );
  }

  // Full Variant (Hero Graphic at the top of ArticlePageView and featured card)
  if (isEnergyArticle) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Header Ribbon */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-bold tracking-tight">AHRI Standard 810 Certified Performance Benchmark</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
            <span>Test: 90°F Air / 70°F Water</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-emerald-400 font-semibold">Top 5 Models Analyzed</span>
          </div>
        </div>

        {/* Data Chart Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-slate-50/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Electrical Energy Consumption Comparison (kWh / 100 lbs of Ice)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Lower score indicates superior electrical efficiency. Audited from 651 EPA ENERGY STAR models.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <ArrowDownRight className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Up to 57% lower utility demand</span>
            </div>
          </div>

          {/* SVG & CSS Bar Chart */}
          <div className="space-y-4">
            {/* Rank 1 */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">1</span>
                  <span>Follett HCF2110R</span>
                  <span className="text-[11px] text-slate-500 font-normal">(1,632 lbs/day · Nugget · Remote)</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs font-extrabold text-emerald-700">3.21 kWh/100 lbs</span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">Best in Class</span>
                </div>
              </div>
              <div className="w-full h-6 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-emerald-600 rounded-lg flex items-center justify-end pr-2.5 text-[10px] font-mono font-bold text-white transition-all duration-500"
                  style={{ width: '42.8%' }}
                >
                  3.21
                </div>
              </div>
            </div>

            {/* Rank 2 */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-5 h-5 rounded bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">2</span>
                  <span>ICETRO IM-1700-RC</span>
                  <span className="text-[11px] text-slate-500 font-normal">(1,575 lbs/day · Cube · Remote)</span>
                </div>
                <div className="font-mono text-xs font-bold text-blue-700">
                  3.51 kWh/100 lbs
                </div>
              </div>
              <div className="w-full h-6 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-blue-600 rounded-lg flex items-center justify-end pr-2.5 text-[10px] font-mono font-bold text-white transition-all duration-500"
                  style={{ width: '46.8%' }}
                >
                  3.51
                </div>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-5 h-5 rounded bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">3</span>
                  <span>Hoshizaki KM-2600SRJZ3</span>
                  <span className="text-[11px] text-slate-500 font-normal">(2,580 lbs/day · Crescent · Remote)</span>
                </div>
                <div className="font-mono text-xs font-bold text-blue-700">
                  3.61 kWh/100 lbs
                </div>
              </div>
              <div className="w-full h-6 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-blue-600 rounded-lg flex items-center justify-end pr-2.5 text-[10px] font-mono font-bold text-white transition-all duration-500"
                  style={{ width: '48.1%' }}
                >
                  3.61
                </div>
              </div>
            </div>

            {/* Rank 4 */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-5 h-5 rounded bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">4</span>
                  <span>Follett HCF1810R</span>
                  <span className="text-[11px] text-slate-500 font-normal">(1,445 lbs/day · Nugget · Remote)</span>
                </div>
                <div className="font-mono text-xs font-bold text-blue-700">
                  3.63 kWh/100 lbs
                </div>
              </div>
              <div className="w-full h-6 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-blue-600 rounded-lg flex items-center justify-end pr-2.5 text-[10px] font-mono font-bold text-white transition-all duration-500"
                  style={{ width: '48.4%' }}
                >
                  3.63
                </div>
              </div>
            </div>

            {/* Rank 5 */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-5 h-5 rounded bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">5</span>
                  <span>ICETRO IM-2000-RC</span>
                  <span className="text-[11px] text-slate-500 font-normal">(1,861 lbs/day · Cube · Remote)</span>
                </div>
                <div className="font-mono text-xs font-bold text-blue-700">
                  3.65 kWh/100 lbs
                </div>
              </div>
              <div className="w-full h-6 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-blue-600 rounded-lg flex items-center justify-end pr-2.5 text-[10px] font-mono font-bold text-white transition-all duration-500"
                  style={{ width: '48.7%' }}
                >
                  3.65
                </div>
              </div>
            </div>

            {/* Industry Baseline */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-5 h-5 rounded bg-slate-300 text-slate-700 font-bold text-[10px] flex items-center justify-center font-mono">—</span>
                  <span>Uncertified Commercial Baseline</span>
                  <span className="text-[11px] text-slate-400">(Standard Industry Average)</span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-600">
                  7.50 kWh/100 lbs
                </div>
              </div>
              <div className="w-full h-5 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-slate-400 rounded-lg flex items-center justify-end pr-2.5 text-[10px] font-mono font-bold text-white"
                  style={{ width: '100%' }}
                >
                  7.50 Baseline
                </div>
              </div>
            </div>
          </div>

          {/* Key Stat Badges Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Leader Efficiency</div>
              <div className="font-mono text-lg font-extrabold text-emerald-700 mt-0.5">3.21 kWh</div>
              <div className="text-[11px] text-slate-500">Follett HCF2110R</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">10-Yr Electric Savings</div>
              <div className="font-mono text-lg font-extrabold text-blue-700 mt-0.5">$37,580</div>
              <div className="text-[11px] text-slate-500">vs 7.5 kWh baseline @ $0.16</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Low Water Demand</div>
              <div className="font-mono text-lg font-extrabold text-slate-900 mt-0.5">12.0 gal</div>
              <div className="text-[11px] text-slate-500">per 100 lbs of harvested ice</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Buying Guide Variant
  if (isBuyingGuide) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="px-6 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-400" />
            <span className="font-bold tracking-tight">Foodservice Commercial Ice Sizing & Engineering Ratios</span>
          </div>
          <div className="text-slate-300 font-mono text-[11px]">
            AHRI 810 Baseline + 20% Summer Headroom Buffer
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 bg-slate-50/60">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Standard Daily Ice Consumption Sizing Formulas
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Industry standard allocation formulas to size equipment for peak August demand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Casual Dining</span>
                <span className="font-mono text-blue-600 font-bold">1.5 lbs</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 font-mono">1.5 lbs / meal</div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Covers table service water, soda fountain, and kitchen plating staging.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Cocktail Lounge</span>
                <span className="font-mono text-blue-600 font-bold">3.0 lbs</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 font-mono">3.0 lbs / seat</div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Covers shaker tins, highball drinks, wine buckets, and bar service.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Fast Casual</span>
                <span className="font-mono text-blue-600 font-bold">5.0 oz</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 font-mono">5 oz / drink</div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Self-service beverage dispensers with chewable nugget or half-dice.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Raw Bar / Display</span>
                <span className="font-mono text-blue-600 font-bold">35 lbs</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 font-mono">35 lbs / cu. ft.</div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Continuous flake ice bed refresh for oyster and seafood staging.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between gap-4">
            <span className="font-semibold">
              Rule of Thumb: Always calculate (Peak Daily Lbs) × 1.20 = Recommended Equipment Capacity.
            </span>
            <span className="font-mono text-[11px] text-blue-700 whitespace-nowrap">+20% Peak Safety Buffer</span>
          </div>
        </div>
      </div>
    );
  }

  // Standards / Default Full Variant
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="px-6 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold tracking-tight">AHRI Standard 810 Technical Specification Guide</span>
        </div>
        <div className="text-slate-300 font-mono text-[11px]">
          U.S. EPA ENERGY STAR Certified Criteria
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 bg-slate-50/60">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Standard Rating Parameters: 90°F Ambient Air vs. 70°F Tap Water
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Engineering certification protocols for commercial batch and continuous ice makers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Standard Ambient</div>
            <div className="font-mono text-xl font-extrabold text-slate-900">90°F / 32.2°C</div>
            <p className="text-[11px] text-slate-500">Kitchen testing temperature requirement.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inlet Water Temp</div>
            <div className="font-mono text-xl font-extrabold text-blue-700">70°F / 21.1°C</div>
            <p className="text-[11px] text-slate-500">Benchmarked incoming municipal water feed.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Standard Test Metric</div>
            <div className="font-mono text-xl font-extrabold text-emerald-700">kWh / 100 lbs</div>
            <p className="text-[11px] text-slate-500">Standardized electrical power consumption index.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
