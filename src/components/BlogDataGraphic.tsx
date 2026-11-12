import React from 'react';
import { BlogArticle } from '../types/blog';
import { BarChart3, Zap, ShieldCheck, Scale, ThermometerSnowflake, CheckCircle2, ArrowDownRight, Droplets, Coffee } from 'lucide-react';

interface BlogDataGraphicProps {
  article: BlogArticle;
  variant?: 'full' | 'compact';
}

export const BlogDataGraphic: React.FC<BlogDataGraphicProps> = ({ article, variant = 'full' }) => {
  const isCafeArticle =
    article.slug === 'best-commercial-ice-machines-for-coffee-shops-cafes' ||
    article.title.toLowerCase().includes('coffee') ||
    article.title.toLowerCase().includes('cafe');

  const isBrandComparison =
    !isCafeArticle &&
    (article.slug === 'hoshizaki-vs-manitowoc-commercial-ice-machines' ||
      article.title.toLowerCase().includes('hoshizaki') ||
      article.title.toLowerCase().includes('manitowoc'));

  const isEnergyArticle =
    !isCafeArticle &&
    !isBrandComparison &&
    (article.slug === 'most-energy-efficient-ice-machines' ||
      article.category === 'Energy Efficiency' ||
      article.title.toLowerCase().includes('energy') ||
      article.tags.includes('Energy Efficiency'));

  const isBuyingGuide =
    !isCafeArticle &&
    (article.slug === 'how-to-size-a-commercial-ice-machine-for-your-restaurant' ||
      article.slug === 'how-to-choose-the-right-commercial-ice-machine-for-your-restaurant' ||
      article.title.toLowerCase().includes('size') ||
      article.title.toLowerCase().includes('sizing') ||
      article.category === 'Buying Guides' ||
      article.title.toLowerCase().includes('choose'));

  const isStandardsArticle =
    article.slug === 'understanding-ahri-standard-810-ice-machine-ratings' ||
    article.category === 'Equipment Standards' ||
    article.title.toLowerCase().includes('ahri');

  // Compact Variant (Used for Cards in BlogIndexView)
  if (variant === 'compact') {
    if (isCafeArticle) {
      return (
        <div className="w-full h-full p-4 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col justify-between select-none">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-amber-300 uppercase">
            <span className="flex items-center gap-1 font-semibold">
              <Coffee className="w-3 h-3 text-amber-400" />
              Cafe Ice Benchmark
            </span>
            <span className="text-slate-400">kWh/100 lbs</span>
          </div>

          {/* Mini Comparative Bars */}
          <div className="space-y-1.5 my-1">
            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-200">
                <span>True TCIM-530</span>
                <span className="font-mono text-emerald-400 font-bold">3.92</span>
              </div>
              <div className="w-full h-2 bg-slate-700/60 rounded-xs overflow-hidden mt-0.5">
                <div className="h-full bg-emerald-500 rounded-xs" style={{ width: '52.2%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-200">
                <span>Ice-O-Matic HEM0650</span>
                <span className="font-mono text-blue-400 font-bold">4.34</span>
              </div>
              <div className="w-full h-2 bg-slate-700/60 rounded-xs overflow-hidden mt-0.5">
                <div className="h-full bg-blue-500 rounded-xs" style={{ width: '57.8%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-200">
                <span>Scotsman MC0530</span>
                <span className="font-mono text-indigo-400 font-bold">4.75</span>
              </div>
              <div className="w-full h-2 bg-slate-700/60 rounded-xs overflow-hidden mt-0.5">
                <div className="h-full bg-indigo-500 rounded-xs" style={{ width: '63.3%' }}></div>
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
            <span className="text-amber-300 font-semibold">200–500 lbs/day</span>
            <span>AHRI 810 Certified</span>
          </div>
        </div>
      );
    }
    if (isBrandComparison) {
      return (
        <div className="w-full h-full p-4 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col justify-between select-none">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-blue-300 uppercase">
            <span className="flex items-center gap-1 font-semibold">
              <BarChart3 className="w-3 h-3 text-blue-400" />
              Brand Benchmark
            </span>
            <span className="text-slate-400">Avg kWh/100 lbs</span>
          </div>

          {/* Mini Comparative Bars */}
          <div className="space-y-2 my-1">
            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-200">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                  Manitowoc (109 models)
                </span>
                <span className="font-mono text-blue-400 font-bold">5.17</span>
              </div>
              <div className="w-full h-2 bg-slate-700/60 rounded-xs overflow-hidden mt-0.5">
                <div className="h-full bg-blue-500 rounded-xs" style={{ width: '68.9%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-200">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
                  Hoshizaki (42 models)
                </span>
                <span className="font-mono text-indigo-400 font-bold">5.38</span>
              </div>
              <div className="w-full h-2 bg-slate-700/60 rounded-xs overflow-hidden mt-0.5">
                <div className="h-full bg-indigo-500 rounded-xs" style={{ width: '71.7%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Industry Baseline</span>
                <span className="font-mono text-slate-400">7.50</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700/60 rounded-xs overflow-hidden mt-0.5">
                <div className="h-full bg-slate-500 rounded-xs" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
            <span className="text-blue-300 font-semibold">151 Models Compared</span>
            <span>AHRI 810 Certified</span>
          </div>
        </div>
      );
    }
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
  if (isCafeArticle) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Header Ribbon */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
            <span className="font-bold tracking-tight">AHRI Standard 810 Benchmark: Top 3 Commercial Ice Makers for Coffee Shops & Cafes</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
            <span>253 Certified Models Evaluated (200–500 lbs/day)</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-amber-300 font-semibold">90°F Air / 70°F Water Benchmark</span>
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
                Audited AHRI 810 / ENERGY STAR data. Lower kWh indicates superior energy efficiency and lower monthly electricity bills for cafe owners.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <ArrowDownRight className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Up to 48% lower electric draw</span>
            </div>
          </div>

          {/* Comparative Horizontal Bars */}
          <div className="space-y-4">
            {/* Rank 1: True TCIM-530 */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">1</span>
                  <span>True Refrigeration TCIM-530-HA1</span>
                  <span className="text-[11px] text-slate-500 font-normal">(489 lbs/day · Cube · R-290)</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs font-extrabold text-emerald-700">3.92 kWh / 100 lbs</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">Efficiency Winner</span>
                </div>
              </div>
              <div className="w-full h-7 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-emerald-600 rounded-lg flex items-center justify-between px-3 text-[11px] font-mono font-bold text-white transition-all duration-500"
                  style={{ width: '52.2%' }}
                >
                  <span>True TCIM-530</span>
                  <span>3.92 kWh</span>
                </div>
              </div>
            </div>

            {/* Rank 2: Ice-O-Matic HEM0650 */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-5 h-5 rounded bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">2</span>
                  <span>Ice-O-Matic HEM0650A90</span>
                  <span className="text-[11px] text-slate-500 font-normal">(492 lbs/day · Chewable Pearl / Nugget · R-290)</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs font-extrabold text-blue-700">4.34 kWh / 100 lbs</span>
                  <span className="text-[10px] text-blue-700 font-semibold bg-blue-100 px-1.5 py-0.5 rounded">Nugget Ice Leader</span>
                </div>
              </div>
              <div className="w-full h-7 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-blue-600 rounded-lg flex items-center justify-between px-3 text-[11px] font-mono font-bold text-white transition-all duration-500"
                  style={{ width: '57.8%' }}
                >
                  <span>Ice-O-Matic HEM0650</span>
                  <span>4.34 kWh</span>
                </div>
              </div>
            </div>

            {/* Rank 3: Scotsman MC0530 */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-5 h-5 rounded bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">3</span>
                  <span>Scotsman MC0530SAX-1A (Prodigy Plus)</span>
                  <span className="text-[11px] text-slate-500 font-normal">(370 lbs/day · Medium Cube · R-290)</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs font-extrabold text-indigo-700">4.75 kWh / 100 lbs</span>
                  <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-100 px-1.5 py-0.5 rounded">WaterSense Defense</span>
                </div>
              </div>
              <div className="w-full h-7 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-indigo-600 rounded-lg flex items-center justify-between px-3 text-[11px] font-mono font-bold text-white transition-all duration-500"
                  style={{ width: '63.3%' }}
                >
                  <span>Scotsman MC0530</span>
                  <span>4.75 kWh</span>
                </div>
              </div>
            </div>

            {/* Industry Baseline */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-5 h-5 rounded bg-slate-300 text-slate-700 font-bold text-[10px] flex items-center justify-center font-mono">—</span>
                  <span>Uncertified Commercial Baseline</span>
                  <span className="text-[11px] text-slate-400">(Standard Non-ENERGY STAR Models)</span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-600">
                  7.50 kWh / 100 lbs
                </div>
              </div>
              <div className="w-full h-5 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-slate-400 rounded-lg flex items-center justify-between px-3 text-[10px] font-mono font-bold text-white"
                  style={{ width: '100%' }}
                >
                  <span>Market Baseline</span>
                  <span>7.50 kWh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Category Breakdown Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Lowest Power Draw</div>
              <div className="font-mono text-base font-extrabold text-slate-900">
                True TCIM: <span className="text-emerald-600">3.92</span> kWh
              </div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Sub-4.0 kWh benchmark saves ~$4,115 over 5 years.
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Chewable Pearl Ice</div>
              <div className="font-mono text-base font-extrabold text-slate-900">
                Ice-O-Matic: <span className="text-blue-600">4.34</span> kWh
              </div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Customer-favorite texture for cold foam and matcha.
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">WaterSense Scale Purge</div>
              <div className="font-mono text-base font-extrabold text-slate-900">
                Scotsman: <span className="text-indigo-600">370</span> lbs/day
              </div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Adaptive mineral conductivity testing protects plates.
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">100% Eco Refrigerants</div>
              <div className="font-mono text-base font-extrabold text-slate-900">
                <span className="text-amber-600">Natural R-290</span>
              </div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Zero ozone depletion & ultra-low global warming impact.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Variant (Hero Graphic at the top of ArticlePageView and featured card)
  if (isBrandComparison) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Header Ribbon */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            <span className="font-bold tracking-tight">AHRI Standard 810 Head-to-Head Audit: Hoshizaki vs. Manitowoc</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
            <span>151 Certified Models Evaluated</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-blue-300 font-semibold">90°F Air / 70°F Water Benchmark</span>
          </div>
        </div>

        {/* Data Chart Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-slate-50/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Average Electrical Energy Consumption Comparison (kWh / 100 lbs)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official ENERGY STAR and AHRI 810 dataset average across all certified models. Lower score indicates higher energy efficiency.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <BarChart3 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>151 Total Commercial Records</span>
            </div>
          </div>

          {/* Comparative Horizontal Bars */}
          <div className="space-y-4">
            {/* Manitowoc */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-5 h-5 rounded bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">M</span>
                  <span>Manitowoc Portfolio Average</span>
                  <span className="text-[11px] text-slate-500 font-normal">(109 Models · Avg Harvest: 674 lbs/day)</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs font-extrabold text-blue-700">5.17 kWh / 100 lbs</span>
                  <span className="text-[10px] text-blue-700 font-semibold bg-blue-100 px-1.5 py-0.5 rounded">Efficiency Winner</span>
                </div>
              </div>
              <div className="w-full h-7 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-blue-600 rounded-lg flex items-center justify-between px-3 text-[11px] font-mono font-bold text-white transition-all duration-500"
                  style={{ width: '68.9%' }}
                >
                  <span>Manitowoc</span>
                  <span>5.17 kWh</span>
                </div>
              </div>
            </div>

            {/* Hoshizaki */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-5 h-5 rounded bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">H</span>
                  <span>Hoshizaki Portfolio Average</span>
                  <span className="text-[11px] text-slate-500 font-normal">(42 Models · Avg Harvest: 783 lbs/day)</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs font-extrabold text-indigo-700">5.38 kWh / 100 lbs</span>
                  <span className="text-[10px] text-slate-500 font-normal">(+4.0% energy difference)</span>
                </div>
              </div>
              <div className="w-full h-7 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-indigo-600 rounded-lg flex items-center justify-between px-3 text-[11px] font-mono font-bold text-white transition-all duration-500"
                  style={{ width: '71.7%' }}
                >
                  <span>Hoshizaki</span>
                  <span>5.38 kWh</span>
                </div>
              </div>
            </div>

            {/* Industry Baseline */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-5 h-5 rounded bg-slate-300 text-slate-700 font-bold text-[10px] flex items-center justify-center font-mono">—</span>
                  <span>Uncertified Commercial Baseline</span>
                  <span className="text-[11px] text-slate-400">(Standard Non-ENERGY STAR Models)</span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-600">
                  7.50 kWh / 100 lbs
                </div>
              </div>
              <div className="w-full h-5 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-slate-400 rounded-lg flex items-center justify-between px-3 text-[10px] font-mono font-bold text-white"
                  style={{ width: '100%' }}
                >
                  <span>Market Baseline</span>
                  <span>7.50 kWh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Category Breakdown Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Avg Electrical Efficiency</div>
              <div className="font-mono text-base font-extrabold text-slate-900">
                Manitowoc: <span className="text-blue-600">5.17</span> vs 5.38
              </div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Manitowoc holds a slight 3.9% fleet-wide efficiency lead.
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Water Consumption</div>
              <div className="font-mono text-base font-extrabold text-slate-900">
                Hoshizaki: <span className="text-emerald-600">15.8</span> vs 17.6 gal
              </div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Hoshizaki uses ~10% less potable water per 100 lbs.
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Maximum Harvest Capacity</div>
              <div className="font-mono text-base font-extrabold text-slate-900">
                Hoshizaki: <span className="text-indigo-600">2,580</span> lbs/day
              </div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Hoshizaki KM-2600 leads top-end single-unit volume.
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">Eco-Refrigerant (R-290)</div>
              <div className="font-mono text-base font-extrabold text-slate-900">
                Manitowoc: <span className="text-cyan-600">41</span> Models
              </div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Manitowoc leads green propane refrigerant adoption.
              </div>
            </div>
          </div>
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
              Industry standard allocation formulas to size equipment for peak August demand across concepts.
            </p>
          </div>

          {/* Comparative Horizontal Bars for Foodservice Sizing Needs */}
          <div className="space-y-3.5 my-2">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Example Daily Peak Sizing Calculation (Base Need vs. Recommended Unit with +20% Buffer)
            </div>

            {/* Casual Dining */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-5 h-5 rounded bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">1</span>
                  <span>Casual Dining (250 covers/day @ 1.5 lbs)</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-500 font-normal">Base: 375 lbs</span>
                  <span className="font-bold text-blue-700">Recommend: 450 lbs/day</span>
                </div>
              </div>
              <div className="w-full h-6 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-blue-600 rounded-lg flex items-center justify-between px-3 text-[10px] font-mono font-bold text-white transition-all duration-500"
                  style={{ width: '65%' }}
                >
                  <span>375 lbs Base Demand</span>
                  <span>+20% Buffer = 450 lbs</span>
                </div>
              </div>
            </div>

            {/* Cocktail Bar */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-5 h-5 rounded bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">2</span>
                  <span>Cocktail Bar (80 seats @ 3.0 lbs)</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-500 font-normal">Base: 240 lbs</span>
                  <span className="font-bold text-amber-700">Recommend: 288 lbs/day</span>
                </div>
              </div>
              <div className="w-full h-6 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-amber-600 rounded-lg flex items-center justify-between px-3 text-[10px] font-mono font-bold text-white transition-all duration-500"
                  style={{ width: '45%' }}
                >
                  <span>240 lbs Base Demand</span>
                  <span>+20% Buffer = 288 lbs</span>
                </div>
              </div>
            </div>

            {/* Coffee Shop */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">3</span>
                  <span>Specialty Cafe (250 iced drinks @ 1.5 lbs)</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-500 font-normal">Base: 375 lbs</span>
                  <span className="font-bold text-emerald-700">Recommend: 450 lbs/day</span>
                </div>
              </div>
              <div className="w-full h-6 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-emerald-600 rounded-lg flex items-center justify-between px-3 text-[10px] font-mono font-bold text-white transition-all duration-500"
                  style={{ width: '65%' }}
                >
                  <span>375 lbs Base Demand</span>
                  <span>+20% Buffer = 450 lbs</span>
                </div>
              </div>
            </div>

            {/* Fine Dining */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-5 h-5 rounded bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">4</span>
                  <span>Fine Dining (180 guests @ 1.5 lbs incl. wine)</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-500 font-normal">Base: 270 lbs</span>
                  <span className="font-bold text-indigo-700">Recommend: 324 lbs/day</span>
                </div>
              </div>
              <div className="w-full h-6 bg-slate-200/80 rounded-lg overflow-hidden flex items-center">
                <div
                  className="h-full bg-indigo-600 rounded-lg flex items-center justify-between px-3 text-[10px] font-mono font-bold text-white transition-all duration-500"
                  style={{ width: '50%' }}
                >
                  <span>270 lbs Base Demand</span>
                  <span>+20% Buffer = 324 lbs</span>
                </div>
              </div>
            </div>
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
