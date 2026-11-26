import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { IceMachine } from '../types/iceMachine';
import { findMachineBySlug } from '../utils/sitemapGenerator';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calculator,
  CheckCircle2,
  Droplets,
  Gauge,
  Layers,
  ShieldCheck,
  Utensils,
  Wine,
  Zap,
} from 'lucide-react';

interface CapacityGuideHubViewProps {
  machines: IceMachine[];
  slugMap: Map<string, string>;
  onBackToDirectory: () => void;
  onBackToGuides: () => void;
  onOpenQuote: (prefilledInterest?: string) => void;
}

const FEATURED_500_SLUGS = [
  'manitowoc-iyp0600a-161',
  'hoshizaki-dkm-500baj',
  'hoshizaki-km-520mrjz',
  'follett-d714a',
];

const FEATURED_1000_SLUGS = [
  'scotsman-mc1448sax-32a',
  'hoshizaki-kms-1122mlj',
  'ice-o-matic-gem1306a90',
  'scotsman-ns1322ax-32a',
];

export const CapacityGuideHubView: React.FC<CapacityGuideHubViewProps> = ({
  machines,
  slugMap,
  onBackToDirectory,
  onBackToGuides,
  onOpenQuote,
}) => {
  const [kwhRate, setKwhRate] = useState<number>(0.14);
  const [utilizationPct, setUtilizationPct] = useState<number>(80);

  const models500 = useMemo(() => {
    return FEATURED_500_SLUGS.map((slug) => findMachineBySlug(machines, slug)).filter(
      (m): m is IceMachine => Boolean(m)
    );
  }, [machines]);

  const models1000 = useMemo(() => {
    return FEATURED_1000_SLUGS.map((slug) => findMachineBySlug(machines, slug)).filter(
      (m): m is IceMachine => Boolean(m)
    );
  }, [machines]);

  // Compute real AHRI-based 5-year utility averages directly from the featured database models
  const tcoMetrics = useMemo(() => {
    const avg = (items: IceMachine[], fn: (m: IceMachine) => number, fallback: number) =>
      items.length > 0 ? items.reduce((sum, m) => sum + fn(m), 0) / items.length : fallback;

    const avg500Harvest = avg(models500, (m) => m.harvestRateLbs, 527);
    const avg500KwhPer100 = avg(models500, (m) => m.energyUseRateKwh, 4.87);
    const avg500GalPer100 = avg(models500, (m) => m.potableWaterUseGal ?? 14.0, 14.0);

    const avg1000Harvest = avg(models1000, (m) => m.harvestRateLbs, 1056);
    const avg1000KwhPer100 = avg(models1000, (m) => m.energyUseRateKwh, 4.33);
    const avg1000GalPer100 = avg(models1000, (m) => m.potableWaterUseGal ?? 14.3, 14.25);

    const days5Yr = 365 * 5;
    const util = utilizationPct / 100;
    const waterRatePer1000Gal = 10.0; // Typical commercial potable + sewer rate

    const calc5Yr = (
      harvest: number,
      kwhPer100: number,
      galPer100: number,
      capexLow: number,
      capexHigh: number,
      serviceAnnual: number
    ) => {
      const lbs5Yr = harvest * util * days5Yr;
      const kwh5Yr = (lbs5Yr / 100) * kwhPer100;
      const electric5Yr = Math.round(kwh5Yr * kwhRate);
      const gal5Yr = (lbs5Yr / 100) * galPer100;
      const water5Yr = Math.round((gal5Yr / 1000) * waterRatePer1000Gal);
      const service5Yr = serviceAnnual * 5;
      const capexMid = Math.round((capexLow + capexHigh) / 2);
      const total5Yr = capexMid + electric5Yr + water5Yr + service5Yr;

      return {
        harvest: Math.round(harvest),
        kwhPer100: kwhPer100.toFixed(2),
        galPer100: galPer100.toFixed(1),
        capexRange: `$${capexLow.toLocaleString()} – $${capexHigh.toLocaleString()}`,
        capexMid,
        electric5Yr,
        water5Yr,
        service5Yr,
        total5Yr,
      };
    };

    return {
      tier500: calc5Yr(avg500Harvest, avg500KwhPer100, avg500GalPer100, 5200, 7400, 450),
      tier1000: calc5Yr(avg1000Harvest, avg1000KwhPer100, avg1000GalPer100, 8200, 12400, 550),
    };
  }, [models500, models1000, kwhRate, utilizationPct]);

  const renderMachineCard = (machine: IceMachine) => {
    const slug = slugMap.get(machine.id) || machine.id;
    return (
      <div
        key={machine.id}
        className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between gap-3 shadow-2xs"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-800">{machine.brand}</span>
            <span className="font-mono text-slate-500">
              {machine.equipmentType} · {machine.condenserCooling}
            </span>
          </div>

          <Link
            to={`/machine/${slug}`}
            className="block text-base font-extrabold text-slate-900 hover:text-blue-700 transition-colors font-mono"
          >
            {machine.modelNumber}
          </Link>

          <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Output</div>
              <div className="font-mono font-bold text-slate-900">
                {machine.harvestRateLbs.toLocaleString()} lb
              </div>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Energy</div>
              <div className="font-mono font-bold text-slate-900">
                {machine.energyUseRateKwh.toFixed(2)} kWh
              </div>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Water</div>
              <div className="font-mono font-bold text-slate-900">
                {machine.potableWaterUseGal !== undefined
                  ? `${machine.potableWaterUseGal.toFixed(1)} gal`
                  : '—'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>
              Ice: <strong className="text-slate-700">{machine.iceType}</strong>
            </span>
            <span>
              Refrigerant: <strong className="font-mono text-slate-700">{machine.refrigerant || 'Standard'}</strong>
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/machine/${slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>View Full Specs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() =>
              onOpenQuote(
                `${machine.brand} ${machine.modelNumber} (${machine.harvestRateLbs.toLocaleString()} lbs/day)`
              )
            }
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Request Quote
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-14">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={onBackToDirectory}
            className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Directory</span>
          </button>
          <span className="text-slate-300">/</span>
          <button
            type="button"
            onClick={onBackToGuides}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Guides
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900">500 lb vs. 1000 lb Ice Machines</span>
        </div>

        <button
          type="button"
          onClick={() => onOpenQuote('500 lb vs 1000 lb Commercial Ice Machine Sizing')}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          Get a Sizing Quote
        </button>
      </div>

      {/* Hero Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
          <span>Capacity Sizing Hub</span>
          <span aria-hidden="true">·</span>
          <span>AHRI 810 Verified Specifications</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          500 lb vs. 1000 lb Commercial Ice Machine: Buyer&apos;s Guide &amp; TCO Comparison
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          Choosing between a <strong>500 lb commercial ice machine</strong> and a{' '}
          <strong>1000 lb commercial ice machine</strong> determines whether your bar, hotel, or
          restaurant glides through peak Saturday dinner service or buys emergency bagged ice.
          Compare real industry sizing formulas, head-to-bin pairing rules, verified ENERGY STAR®
          models from our catalog, and 5-year Total Cost of Ownership below.
        </p>

        {/* Quick Jump Links */}
        <nav className="p-4 bg-white rounded-xl border border-slate-200 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-700">
          <a href="#use-cases" className="hover:text-blue-700 transition-colors">
            1. Bars, Hotels &amp; Restaurants
          </a>
          <a href="#head-bin-pairing" className="hover:text-blue-700 transition-colors">
            2. Head vs. Bin Pairing Logic
          </a>
          <a href="#verified-models" className="hover:text-blue-700 transition-colors">
            3. Verified 500 lb &amp; 1000 lb Models
          </a>
          <a href="#five-year-tco" className="hover:text-blue-700 transition-colors">
            4. 5-Year TCO Comparison
          </a>
        </nav>
      </header>

      {/* Section 1: Use Cases (Bars, Hotels, Restaurants) */}
      <section id="use-cases" className="space-y-6 scroll-mt-24">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Use-Case Breakdown: 500 lb vs. 1000 lb Commercial Ice Machine by Venue
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            All AHRI 810 capacities are laboratory-tested at 90°F ambient air and 70°F incoming
            water. Hot dishrooms (95°F+) or warm summer supply lines reduce real-world output by 10%
            to 15%, so always size against peak weekend volume rather than weekday averages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bars */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-blue-600">
                <Wine className="w-4 h-4" />
              </div>
              <h3>Bars &amp; Cocktail Lounges</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bars consume roughly <strong>3 lbs per seat</strong> (or 1.5–2 lbs per cocktail when
              factoring shaker tins, ice wells, and chilling glassware).
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 pt-1 border-t border-slate-100">
              <li>
                <strong>500 lb Class:</strong> Best for neighborhood pubs, tasting rooms, and
                60–120 seat cocktail bars running 1–2 bartender wells.
              </li>
              <li>
                <strong>1000 lb Class:</strong> Built for high-volume sports bars, music venues, and
                patio clubs filling multiple speed rails simultaneously.
              </li>
            </ul>
          </div>

          {/* Restaurants */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-blue-600">
                <Utensils className="w-4 h-4" />
              </div>
              <h3>Restaurants &amp; QSRs</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full-service dining requires <strong>1.5–2.0 lbs per meal served</strong>; drive-thru
              QSR fountain lines use 0.25–0.45 lbs per fountain cup plus kitchen prep.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 pt-1 border-t border-slate-100">
              <li>
                <strong>500 lb Class:</strong> Fits 75–140 seat cafes, bistros, and fast-casual
                kitchens serving 200–300 covers per day.
              </li>
              <li>
                <strong>1000 lb Class:</strong> Essential for 180+ seat restaurants, busy drive-thru
                QSRs, and kitchens icing salad/seafood prep stations.
              </li>
            </ul>
          </div>

          {/* Hotels */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-blue-600">
                <Building2 className="w-4 h-4" />
              </div>
              <h3>Hotels, Resorts &amp; Banquets</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hospitality properties budget <strong>3–5 lbs per occupied room</strong> plus 1–1.5
              lbs per banquet or conference attendee.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 pt-1 border-t border-slate-100">
              <li>
                <strong>500 lb Class:</strong> Ideal for individual corridor floor dispensers (every
                2–3 floors) or boutique inns under 90 rooms.
              </li>
              <li>
                <strong>1000 lb Class:</strong> Back-of-house central production for banquet
                plating, room-service carts, and pool bars.
              </li>
            </ul>
          </div>
        </div>

        {/* Venue Matrix Table */}
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 text-slate-700 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Operation Profile</th>
                <th className="px-4 py-3">Daily Ice Demand Formula</th>
                <th className="px-4 py-3">500 lb Commercial Ice Machine</th>
                <th className="px-4 py-3">1000 lb Commercial Ice Machine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">Bars &amp; Taprooms</td>
                <td className="px-4 py-3">~3 lbs / seat / day</td>
                <td className="px-4 py-3">Up to ~130 seats · 1–2 ice wells</td>
                <td className="px-4 py-3">180–300+ seats · High-turn patio/nightlife</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">Full-Service Restaurants</td>
                <td className="px-4 py-3">~1.5–2 lbs / meal served</td>
                <td className="px-4 py-3">200–300 covers/day · Single server station</td>
                <td className="px-4 py-3">400–650+ covers/day · Multiple stations</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">Quick-Service / Drive-Thru</td>
                <td className="px-4 py-3">~0.35 lb / fountain beverage</td>
                <td className="px-4 py-3">Low-to-medium lobby fountain demand</td>
                <td className="px-4 py-3">1,500–2,500+ drinks/day · Twin dispensers</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">Hotels &amp; Resorts</td>
                <td className="px-4 py-3">~3–5 lbs / room + 1 lb / event guest</td>
                <td className="px-4 py-3">Corridor guest dispenser or &lt;90 rooms</td>
                <td className="px-4 py-3">Central banquet room · 150–250 rooms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Head vs. Bin Pairing Logic */}
      <section id="head-bin-pairing" className="space-y-6 scroll-mt-24">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Modular Head vs. Storage Bin Pairing Logic
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Both 500 lb and 1,000 lb commercial machines are almost always sold as modular Ice Making
            Heads (<strong>IMH</strong>) or Remote Condensing Units (<strong>RCU</strong>) without
            a storage bin. Pairing the wrong bin creates either mid-shift outages or stale, fused ice
            bridges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                500 lb Class Pairing
              </span>
              <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                30&quot; Width Standard
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              500 lb Head + 400–550 lb Storage Bin
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Footprint Match:</strong> Most 500 lb heads (such as 30&quot;-wide
                  Manitowoc or Hoshizaki modular units) drop directly onto a 30&quot; bin holding
                  400 to 530 lbs without needing an adapter plate.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Heat &amp; Ventilation:</strong> An air-cooled 500 lb head rejects
                  ~7,500–9,500 BTU/h—manageable in most ventilated kitchens with 6&quot;–12&quot;
                  side/top air clearance.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Electrical:</strong> Many 500 lb units run on standard 115V single-phase
                  circuits, keeping retrofits inexpensive.
                </span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                1000 lb Class Pairing
              </span>
              <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                30&quot; or 48&quot; Width
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              1,000 lb Head + 750–1,400 lb Storage Bin
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>1.0x–1.5x Buffer Rule:</strong> Size your bin to store at least 100% of
                  daily harvest (750–1,400 lb 48&quot; double-door bin). Mounting a 30&quot; head on
                  a 48&quot; bin requires an OEM stainless top-kit adapter.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Remote vs. Air-Cooled:</strong> A 1,000 lb air-cooled head rejects
                  14,000–18,000+ BTU/h. In tight closets or hot lines, specify an{' '}
                  <strong>RCU (Remote Condensing Unit)</strong> to push heat and noise to the roof.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Electrical:</strong> Virtually all 1,000 lb heads require dedicated
                  208–230V hardwired power.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Verified Models from KoldSpec Database */}
      <section id="verified-models" className="space-y-6 scroll-mt-24">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Verified 500 lb &amp; 1000 lb Commercial Ice Machine Models in Our Database
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every model below pulls live AHRI 810/820 ratings directly from the KoldSpec database.
            Click any model number to inspect its full specification sheet and operating cost
            calculator.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-blue-600" />
                <span>500 lb Commercial Ice Machine Class (~495–554 lbs/day)</span>
              </h3>
              <button
                type="button"
                onClick={onBackToDirectory}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Filter all in catalog →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {models500.map(renderMachineCard)}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>1000 lb Commercial Ice Machine Class (~1,001–1,119 lbs/day)</span>
              </h3>
              <button
                type="button"
                onClick={onBackToDirectory}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Filter all in catalog →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {models1000.map(renderMachineCard)}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: 5-Year TCO Overview */}
      <section id="five-year-tco" className="space-y-6 scroll-mt-24">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            5-Year Total Cost of Ownership (TCO): 500 lb vs. 1000 lb Systems
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Upfront hardware represents roughly 35%–45% of five-year ownership cost. Using the
            average AHRI energy (<Zap className="w-3.5 h-3.5 inline text-amber-500" /> kWh/100 lbs)
            and water (<Droplets className="w-3.5 h-3.5 inline text-cyan-600" /> gal/100 lbs)
            efficiency of the verified models above, adjust your local electric rate and daily load
            to compare 5-year TCO.
          </p>
        </div>

        {/* Interactive Utility Assumptions */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Calculator className="w-4 h-4 text-blue-600" />
            <span>5-Year TCO Utility Assumptions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Commercial Electricity Rate:{' '}
                <strong className="font-mono text-slate-900">${kwhRate.toFixed(2)} / kWh</strong>
              </label>
              <input
                type="range"
                min={0.08}
                max={0.32}
                step={0.01}
                value={kwhRate}
                onChange={(e) => setKwhRate(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Average Daily Capacity Utilization:{' '}
                <strong className="font-mono text-slate-900">{utilizationPct}%</strong>
              </label>
              <input
                type="range"
                min={50}
                max={100}
                step={5}
                value={utilizationPct}
                onChange={(e) => setUtilizationPct(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded"
              />
            </div>
          </div>
        </div>

        {/* 5-Year TCO Comparison Table */}
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 text-slate-700 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">5-Year Cost Component</th>
                <th className="px-4 py-3">
                  500 lb Commercial Ice Machine (Avg {tcoMetrics.tier500.harvest} lb/d)
                </th>
                <th className="px-4 py-3">
                  1000 lb Commercial Ice Machine (Avg {tcoMetrics.tier1000.harvest} lb/d)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  Year 1 Equipment + Bin + Filter + Install (Est. CapEx)
                </td>
                <td className="px-4 py-3 font-mono">
                  {tcoMetrics.tier500.capexRange} (mid ${tcoMetrics.tier500.capexMid.toLocaleString()})
                </td>
                <td className="px-4 py-3 font-mono">
                  {tcoMetrics.tier1000.capexRange} (mid ${tcoMetrics.tier1000.capexMid.toLocaleString()})
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  AHRI Avg Energy &amp; Water Rating (Database Models)
                </td>
                <td className="px-4 py-3 font-mono">
                  {tcoMetrics.tier500.kwhPer100} kWh · {tcoMetrics.tier500.galPer100} gal / 100 lbs
                </td>
                <td className="px-4 py-3 font-mono">
                  {tcoMetrics.tier1000.kwhPer100} kWh · {tcoMetrics.tier1000.galPer100} gal / 100 lbs
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  5-Year Electricity Cost (@ ${kwhRate.toFixed(2)}/kWh, {utilizationPct}% load)
                </td>
                <td className="px-4 py-3 font-mono">
                  ${tcoMetrics.tier500.electric5Yr.toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono">
                  ${tcoMetrics.tier1000.electric5Yr.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  5-Year Potable Water &amp; Sewer (@ $10/1,000 gal)
                </td>
                <td className="px-4 py-3 font-mono">
                  ${tcoMetrics.tier500.water5Yr.toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono">
                  ${tcoMetrics.tier1000.water5Yr.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  5-Year Filters &amp; Semi-Annual Descaling Service
                </td>
                <td className="px-4 py-3 font-mono">
                  ${tcoMetrics.tier500.service5Yr.toLocaleString()} ($450/yr)
                </td>
                <td className="px-4 py-3 font-mono">
                  ${tcoMetrics.tier1000.service5Yr.toLocaleString()} ($550/yr)
                </td>
              </tr>
              <tr className="bg-slate-50 font-bold text-slate-900">
                <td className="px-4 py-3.5">Estimated 5-Year Total Cost of Ownership</td>
                <td className="px-4 py-3.5 font-mono text-blue-700 text-sm">
                  ~${tcoMetrics.tier500.total5Yr.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 font-mono text-blue-700 text-sm">
                  ~${tcoMetrics.tier1000.total5Yr.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Note: Even though a 1,000 lb unit produces twice the ice, higher-capacity machines run more
          efficiently per 100 lbs ({tcoMetrics.tier1000.kwhPer100} kWh vs.{' '}
          {tcoMetrics.tier500.kwhPer100} kWh average across featured ENERGY STAR models) and avoid
          the $250–$600/month hidden cost of emergency bagged ice deliveries during heatwaves.
        </p>
      </section>

      {/* CTA Footer Banner */}
      <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Need Help Choosing Between 500 lb and 1000 lb?</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Get a Free Head + Bin Sizing Audit &amp; Wholesale Quote
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Share your seat count, drink volume, and room dimensions through our Contact Us form to
            receive an itemized head, storage bin, and water filtration quote.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenQuote('500 lb vs. 1000 lb Commercial Ice Machine Quote')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Contact Us for a Quote
          </button>
          <button
            type="button"
            onClick={onBackToDirectory}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            Browse All {machines.length} Models
          </button>
        </div>
      </div>
    </div>
  );
};
