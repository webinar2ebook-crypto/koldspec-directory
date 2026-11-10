import React, { useState, useEffect, useMemo } from 'react';
import { IceMachine, FilterState, IceType } from './types/iceMachine';
import {
  getAllIceMachines,
  saveIceMachines,
  deleteIceMachine,
  clearAllIceMachines,
  exportMachinesToCsv,
  getOfficialEnergyStarSampleRecords,
} from './db/iceMachinesDb';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterSidebar } from './components/FilterSidebar';
import { MachineCard } from './components/MachineCard';
import { MachineTableView } from './components/MachineTableView';
import { MachineDetailModal } from './components/MachineDetailModal';
import { CompareModal } from './components/CompareModal';
import { CsvImportModal } from './components/CsvImportModal';
import { EmptyDatabaseView } from './components/EmptyDatabaseView';
import { StandardsInfoView } from './components/StandardsInfoView';
import { BlogIndexView } from './components/BlogIndexView';
import { ArticlePageView } from './components/ArticlePageView';
import { QuotePageView } from './components/QuotePageView';
import { BLOG_ARTICLES } from './data/blogArticles';
import { BarChart3, Database, Trash2, CheckCircle2, Download, Globe, FileCode } from 'lucide-react';
import {
  buildMachineSlugMap,
  findMachineBySlug,
  generateSitemapXml,
  DOMAIN,
} from './utils/sitemapGenerator';

export default function App() {
  const [machines, setMachines] = useState<IceMachine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentView, setCurrentView] = useState<'directory' | 'table' | 'standards' | 'blog' | 'quote'>('directory');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);
  const [quotePrefill, setQuotePrefill] = useState<string>('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<IceMachine | null>(null);
  const [comparedMachineIds, setComparedMachineIds] = useState<string[]>([]);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const selectedArticle = useMemo(
    () => BLOG_ARTICLES.find((a) => a.slug === selectedArticleSlug) || null,
    [selectedArticleSlug]
  );

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
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

  // Show auto-dismissing notifications
  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  // Load 651 machines from static ice_machines.json on startup & check for deep link
  useEffect(() => {
    async function initDatabase() {
      try {
        setIsLoading(true);
        const list = await getAllIceMachines();
        const safeList = Array.isArray(list) ? list : [];
        setMachines(safeList);

        const path = window.location.pathname;
        const hash = window.location.hash;

        // Check for quote page route
        if (path === '/quote' || path === '/quote/' || hash === '#/quote') {
          setCurrentView('quote');
          return;
        }

        // Check for blog URL slug or root blog route
        const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)/i) || hash.match(/^#\/blog\/([a-z0-9-]+)/i);
        if (blogMatch && blogMatch[1]) {
          setCurrentView('blog');
          setSelectedArticleSlug(blogMatch[1]);
          return;
        }

        if (path === '/blog' || path === '/blog/' || hash === '#/blog') {
          setCurrentView('blog');
          setSelectedArticleSlug(null);
          return;
        }

        // Check for machine URL slug (e.g. /machine/hoshizaki-km-1900saj3 or #/machine/...)
        const match = path.match(/^\/machine\/([a-z0-9-]+)/i) || hash.match(/^#\/machine\/([a-z0-9-]+)/i);
        if (match && match[1]) {
          const targetSlug = match[1];
          const found = findMachineBySlug(safeList, targetSlug);
          if (found) {
            setSelectedMachine(found);
          }
        }
      } catch (err) {
        console.error('Failed to load database:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initDatabase();
  }, []);

  // Sync browser URL and document title / canonical tags when view or selection changes
  useEffect(() => {
    if (selectedMachine) {
      const slugMap = buildMachineSlugMap(machines);
      const slug = slugMap.get(selectedMachine.id) || selectedMachine.id;
      const targetUrl = `/machine/${slug}`;

      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ machineId: selectedMachine.id }, '', targetUrl);
      }

      document.title = `${selectedMachine.brand} ${selectedMachine.modelNumber} Commercial Ice Maker Specs | KoldSpec`;

      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', `${DOMAIN}/machine/${slug}`);
      }
    } else if (currentView === 'quote') {
      const targetUrl = '/quote';
      if (window.location.pathname !== targetUrl) {
        window.history.pushState(null, '', targetUrl);
      }
      document.title = 'Get a Commercial Ice Machine Quote | KoldSpec';
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', `${DOMAIN}/quote`);
      }
    } else if (currentView === 'blog') {
      if (selectedArticleSlug && selectedArticle) {
        const targetUrl = `/blog/${selectedArticleSlug}`;
        if (window.location.pathname !== targetUrl) {
          window.history.pushState({ articleSlug: selectedArticleSlug }, '', targetUrl);
        }
        document.title = `${selectedArticle.title} | KoldSpec Guides`;
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
          canonical.setAttribute('href', `${DOMAIN}/blog/${selectedArticleSlug}`);
        }
      } else {
        const targetUrl = '/blog';
        if (window.location.pathname !== targetUrl) {
          window.history.pushState(null, '', targetUrl);
        }
        document.title = 'Commercial Ice Equipment Buying Guides & Engineering Insights | KoldSpec';
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
          canonical.setAttribute('href', `${DOMAIN}/blog`);
        }
      }
    } else {
      if (
        window.location.pathname.startsWith('/machine/') ||
        window.location.pathname.startsWith('/blog') ||
        window.location.pathname.startsWith('/quote')
      ) {
        window.history.pushState(null, '', '/');
      }

      document.title = 'KoldSpec Commercial Ice Machine Directory';

      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', `${DOMAIN}/`);
      }
    }
  }, [selectedMachine, machines, currentView, selectedArticleSlug, selectedArticle]);

  // Handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;

      if (path === '/quote' || path === '/quote/') {
        setCurrentView('quote');
        setSelectedArticleSlug(null);
        setSelectedMachine(null);
        return;
      }

      const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)/i);
      if (blogMatch && blogMatch[1]) {
        setCurrentView('blog');
        setSelectedArticleSlug(blogMatch[1]);
        setSelectedMachine(null);
        return;
      }

      if (path === '/blog' || path === '/blog/') {
        setCurrentView('blog');
        setSelectedArticleSlug(null);
        setSelectedMachine(null);
        return;
      }

      const match = path.match(/^\/machine\/([a-z0-9-]+)/i);
      if (match && match[1]) {
        const found = findMachineBySlug(machines, match[1]);
        setSelectedMachine(found || null);
      } else {
        setSelectedMachine(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [machines]);

  // Compute maximum harvest rate in loaded dataset for slider bound
  const maxHarvestRate = useMemo(() => {
    if (machines.length === 0) return 2500;
    return Math.max(...machines.map((m) => m.harvestRateLbs), 1500);
  }, [machines]);

  // Available brands with counts
  const availableBrands = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of machines) {
      map.set(m.brand, (map.get(m.brand) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [machines]);

  // Ice type breakdown counts
  const iceTypeCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of machines) {
      map.set(m.iceType, (map.get(m.iceType) || 0) + 1);
    }
    return map;
  }, [machines]);

  // Equipment type breakdown counts
  const equipmentTypeCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of machines) {
      map.set(m.equipmentType, (map.get(m.equipmentType) || 0) + 1);
    }
    return map;
  }, [machines]);

  // Condenser cooling breakdown counts
  const coolingTypeCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of machines) {
      map.set(m.condenserCooling, (map.get(m.condenserCooling) || 0) + 1);
    }
    return map;
  }, [machines]);

  // Filtered and Sorted Machines: simultaneously checks ALL active filters
  const filteredMachines = useMemo(() => {
    return machines.filter((m) => {
      // 1. Text Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchBrand = m.brand.toLowerCase().includes(query);
        const matchModel = m.modelNumber.toLowerCase().includes(query);
        const matchName = m.modelName?.toLowerCase().includes(query) ?? false;
        const matchRefrig = m.refrigerant?.toLowerCase().includes(query) ?? false;
        const matchIce = m.iceType.toLowerCase().includes(query);
        const matchShape = m.iceShapeDetail?.toLowerCase().includes(query) ?? false;
        if (!matchBrand && !matchModel && !matchName && !matchRefrig && !matchIce && !matchShape) {
          return false;
        }
      }

      // 2. Brand Filter: machine must match one of the selected brands
      if (filters.brands.length > 0) {
        const matchBrand = filters.brands.some(
          (b) => b.trim().toLowerCase() === m.brand.trim().toLowerCase()
        );
        if (!matchBrand) return false;
      }

      // 3. Ice Type Filter: machine must match one of the selected ice types (e.g. Flake, Cube, Nugget)
      if (filters.iceTypes.length > 0) {
        const matchIce = filters.iceTypes.some(
          (t) => t.trim().toLowerCase() === m.iceType.trim().toLowerCase()
        );
        if (!matchIce) return false;
      }

      // 4. Daily Production Range (Harvest Rate in lbs/24h)
      if (m.harvestRateLbs < filters.productionMin) return false;
      if (filters.productionMax < 2500 && m.harvestRateLbs > filters.productionMax) {
        return false;
      }

      // 5. Energy Efficiency Limit (kWh / 100 lbs ice)
      if (filters.energyMaxKwh < 12.0 && m.energyUseRateKwh > filters.energyMaxKwh) {
        return false;
      }

      // 6. Equipment Configuration (IMH, SCU, RCU)
      if (filters.equipmentTypes.length > 0) {
        const matchEquip = filters.equipmentTypes.some(
          (e) => e.trim().toUpperCase() === m.equipmentType.trim().toUpperCase()
        );
        if (!matchEquip) return false;
      }

      // 7. Condenser Cooling Type (Air-Cooled, Water-Cooled, Remote Air-Cooled)
      if (filters.coolingTypes.length > 0) {
        const matchCooling = filters.coolingTypes.some(
          (c) => c.trim().toLowerCase() === m.condenserCooling.trim().toLowerCase()
        );
        if (!matchCooling) return false;
      }

      // 8. ENERGY STAR Certified Only
      if (filters.energyStarOnly && !m.energyStarCertified) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'production-desc':
          return b.harvestRateLbs - a.harvestRateLbs;
        case 'production-asc':
          return a.harvestRateLbs - b.harvestRateLbs;
        case 'energy-asc':
          return a.energyUseRateKwh - b.energyUseRateKwh;
        case 'water-asc':
          return (a.potableWaterUseGal || 999) - (b.potableWaterUseGal || 999);
        case 'brand-asc':
          return a.brand.localeCompare(b.brand);
        default:
          return b.harvestRateLbs - a.harvestRateLbs;
      }
    });
  }, [machines, filters]);

  // Compare helpers
  const comparedMachines = useMemo(() => {
    return machines.filter((m) => comparedMachineIds.includes(m.id));
  }, [machines, comparedMachineIds]);

  const toggleCompare = (machine: IceMachine) => {
    if (comparedMachineIds.includes(machine.id)) {
      setComparedMachineIds((prev) => prev.filter((id) => id !== machine.id));
    } else {
      if (comparedMachineIds.length >= 4) {
        notify('Maximum 4 models can be compared at once.');
        return;
      }
      setComparedMachineIds((prev) => [...prev, machine.id]);
    }
  };

  const removeCompared = (id: string) => {
    setComparedMachineIds((prev) => prev.filter((item) => item !== id));
  };

  // Toggle Ice Type from Hero
  const toggleIceType = (type: IceType) => {
    setFilters((prev) => {
      const exists = prev.iceTypes.includes(type);
      return {
        ...prev,
        iceTypes: exists
          ? prev.iceTypes.filter((t) => t !== type)
          : [...prev.iceTypes, type],
      };
    });
  };

  // Database handlers
  const handleImportComplete = async (newMachines: IceMachine[], mode: 'replace' | 'append') => {
    try {
      await saveIceMachines(newMachines, mode);
      const list = await getAllIceMachines();
      setMachines(list);
      setDroppedFile(null);
      notify(`Imported ${newMachines.length} ice machines successfully!`);
    } catch (err: any) {
      console.error('Import save error:', err);
      notify('Failed to store records.');
    }
  };

  const handleDeleteMachine = async (id: string) => {
    await deleteIceMachine(id);
    setMachines((prev) => prev.filter((m) => m.id !== id));
    setComparedMachineIds((prev) => prev.filter((mId) => mId !== id));
    notify('Machine specification removed.');
  };

  const handleClearDatabase = async () => {
    if (window.confirm('Are you sure you want to clear all loaded machine specifications?')) {
      await clearAllIceMachines();
      setMachines([]);
      setComparedMachineIds([]);
      notify('Database cleared.');
    }
  };

  const handleExportCsv = () => {
    const csvContent = exportMachinesToCsv(filteredMachines);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `KoldSpec_Commercial_Ice_Machines_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadSample = async () => {
    const sample = getOfficialEnergyStarSampleRecords();
    await handleImportComplete(sample, 'replace');
  };

  const handleDownloadSitemap = () => {
    const xml = generateSitemapXml(machines, DOMAIN);
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sitemap.xml');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`Downloaded dynamic sitemap.xml with ${machines.length + 2 + BLOG_ARTICLES.length} URLs!`);
  };

  const handleOpenQuote = (targetMachine?: IceMachine) => {
    const machine = targetMachine || selectedMachine || null;
    if (machine) {
      setQuotePrefill(`${machine.brand} ${machine.modelNumber} (${machine.harvestRateLbs.toLocaleString()} lbs/day · ${machine.iceType} Ice)`);
    } else {
      setQuotePrefill('');
    }
    setSelectedMachine(null);
    setSelectedArticleSlug(null);
    setCurrentView('quote');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Bar Contract (3 zones) */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setSelectedMachine(null);
          if (view !== 'quote') {
            setQuotePrefill('');
          }
          if (view !== 'blog') {
            setSelectedArticleSlug(null);
          }
          if (view === 'table') setViewMode('table');
          if (view === 'directory') setViewMode('grid');
        }}
        onOpenImporter={() => {
          setDroppedFile(null);
          setIsImportModalOpen(true);
        }}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        compareCount={comparedMachineIds.length}
        totalMachines={machines.length}
      />

      {/* Hero Section */}
      {currentView !== 'standards' && currentView !== 'blog' && currentView !== 'quote' && (
        <HeroSection
          searchQuery={filters.searchQuery}
          onSearchChange={(q) => setFilters({ ...filters, searchQuery: q })}
          selectedIceTypes={filters.iceTypes}
          onToggleIceType={toggleIceType}
          totalCount={machines.length}
          filteredCount={filteredMachines.length}
          viewMode={viewMode}
          onViewModeChange={(m) => {
            setViewMode(m);
            if (currentView === 'table' && m === 'grid') setCurrentView('directory');
            if (currentView === 'directory' && m === 'table') setCurrentView('table');
          }}
          onOpenImporter={() => {
            setDroppedFile(null);
            setIsImportModalOpen(true);
          }}
          onExportCsv={handleExportCsv}
          onOpenQuote={() => handleOpenQuote()}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'standards' ? (
          <StandardsInfoView
            onBackToDirectory={() => setCurrentView('directory')}
            onOpenImporter={() => setIsImportModalOpen(true)}
          />
        ) : currentView === 'blog' ? (
          selectedArticle ? (
            <ArticlePageView
              article={selectedArticle}
              onBackToBlog={() => setSelectedArticleSlug(null)}
              onSelectArticle={(slug) => setSelectedArticleSlug(slug)}
              onNavigateToDirectory={() => {
                setCurrentView('directory');
                setSelectedArticleSlug(null);
              }}
              onOpenQuote={(prefilled) => {
                if (prefilled) {
                  setQuotePrefill(`Quote inquiry regarding: ${prefilled}`);
                }
                setSelectedArticleSlug(null);
                setCurrentView('quote');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <BlogIndexView
              onSelectArticle={(slug) => setSelectedArticleSlug(slug)}
              onNavigateToDirectory={() => {
                setCurrentView('directory');
                setSelectedArticleSlug(null);
              }}
            />
          )
        ) : currentView === 'quote' ? (
          <QuotePageView
            onBackToDirectory={() => {
              setCurrentView('directory');
              setQuotePrefill('');
            }}
            prefilledMachine={quotePrefill}
          />
        ) : machines.length === 0 ? (
          // Empty State view when no CSV imported yet
          <EmptyDatabaseView
            onOpenFileSelect={(file) => {
              setDroppedFile(file);
              setIsImportModalOpen(true);
            }}
            onOpenImporterModal={() => {
              setDroppedFile(null);
              setIsImportModalOpen(true);
            }}
            onLoadSampleData={handleLoadSample}
          />
        ) : (
          // Populated View: Sidebar + Main Grid / Table
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                availableBrands={availableBrands}
                maxHarvestRate={maxHarvestRate}
                totalLoaded={machines.length}
                iceTypeCounts={iceTypeCounts}
                equipmentTypeCounts={equipmentTypeCounts}
                coolingTypeCounts={coolingTypeCounts}
              />

              {/* Database Management Tools */}
              <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-2.5">
                <div className="flex items-center justify-between text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <span>Database Operations</span>
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-[11px] text-slate-700 leading-snug">
                  <div>Dataset: <strong>ENERGY STAR® Directory</strong></div>
                  <div className="text-slate-500 text-[10px]">651 Models Pre-loaded</div>
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Active records: <strong className="font-mono text-slate-900">{machines.length}</strong> models
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setDroppedFile(null);
                      setIsImportModalOpen(true);
                    }}
                    className="flex-1 py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-center transition-colors"
                  >
                    Import CSV
                  </button>

                  <button
                    onClick={handleClearDatabase}
                    className="py-1.5 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded transition-colors"
                    title="Clear Database"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 space-y-1.5">
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold rounded text-center transition-colors flex items-center justify-center gap-1.5 block text-[11px]"
                    title="View live sitemap.xml with 651 machine URLs and technical guides"
                  >
                    <Globe className="w-3 h-3 text-emerald-600" />
                    <span>View sitemap.xml ({machines.length + 2 + BLOG_ARTICLES.length} URLs)</span>
                  </a>

                  <button
                    onClick={handleDownloadSitemap}
                    className="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold rounded text-center transition-colors flex items-center justify-center gap-1.5 text-[11px]"
                    title="Download dynamically generated sitemap.xml for current database"
                  >
                    <FileCode className="w-3 h-3 text-blue-600" />
                    <span>Download Dynamic sitemap.xml</span>
                  </button>

                  <a
                    href="/insert_data.sql"
                    download="insert_data.sql"
                    className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded text-center transition-colors flex items-center justify-center gap-1.5 block shadow-2xs text-[11px]"
                    title="Download Neon SQL Editor script for all 651 machines"
                  >
                    <Download className="w-3 h-3 text-blue-400" />
                    <span>Download insert_data.sql (651)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-3 space-y-4">
              {/* Active Filter Toolbar */}
              <div className="bg-white p-3.5 px-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Showing:</span>
                  <strong className="text-slate-900 font-mono tabular-nums">
                    {filteredMachines.length}
                  </strong>
                  <span className="text-slate-500">machines</span>
                  {filteredMachines.length !== machines.length && (
                    <span className="text-slate-400 font-mono">
                      (filtered from {machines.length})
                    </span>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Sort by:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value as any })
                    }
                    className="text-xs py-1 px-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 text-slate-800 font-medium cursor-pointer"
                  >
                    <option value="production-desc">Daily Production (Highest First)</option>
                    <option value="production-asc">Daily Production (Lowest First)</option>
                    <option value="energy-asc">Energy Efficiency (Lowest kWh First)</option>
                    <option value="water-asc">Water Efficiency (Lowest Gal First)</option>
                    <option value="brand-asc">Brand (A–Z)</option>
                  </select>
                </div>
              </div>

              {/* View Rendering */}
              {viewMode === 'grid' && currentView !== 'table' ? (
                filteredMachines.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
                    <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold font-mono">
                      0
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">
                      No matching ice machines found
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try expanding your production range, clearing brand selections, or adjusting the energy efficiency threshold.
                    </p>
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          searchQuery: '',
                          brands: [],
                          iceTypes: [],
                          productionMin: 0,
                          productionMax: maxHarvestRate,
                          energyMaxKwh: 12.0,
                          equipmentTypes: [],
                          coolingTypes: [],
                          energyStarOnly: false,
                        })
                      }
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredMachines.map((m) => (
                      <MachineCard
                        key={m.id}
                        machine={m}
                        onSelect={setSelectedMachine}
                        isCompared={comparedMachineIds.includes(m.id)}
                        onToggleCompare={toggleCompare}
                        onOpenQuote={handleOpenQuote}
                      />
                    ))}
                  </div>
                )
              ) : (
                <MachineTableView
                  machines={filteredMachines}
                  onSelectMachine={setSelectedMachine}
                  comparedIds={comparedMachineIds}
                  onToggleCompare={toggleCompare}
                  onDeleteMachine={handleDeleteMachine}
                  onOpenImporter={() => setIsImportModalOpen(true)}
                  onOpenQuote={handleOpenQuote}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Side-by-Side Comparison Bar */}
      {comparedMachineIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span>
              Comparing <strong className="font-mono text-blue-300">{comparedMachineIds.length}</strong> of 4 models
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Open Comparison Matrix
            </button>
            <button
              onClick={() => setComparedMachineIds([])}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Clear all compared"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Machine Detail Spec Sheet Modal */}
      <MachineDetailModal
        machine={selectedMachine}
        onClose={() => setSelectedMachine(null)}
        isCompared={selectedMachine ? comparedMachineIds.includes(selectedMachine.id) : false}
        onToggleCompare={toggleCompare}
        onOpenQuote={handleOpenQuote}
      />

      {/* Compare Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        comparedMachines={comparedMachines}
        onRemoveMachine={removeCompared}
        onSelectMachine={setSelectedMachine}
      />

      {/* CSV Importer Modal */}
      <CsvImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
        initialFile={droppedFile}
      />

      {/* Clean B2B Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 text-xs text-slate-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-slate-900">KoldSpec Directory</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                setCurrentView('directory');
                setSelectedArticleSlug(null);
                setSelectedMachine(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors"
            >
              Directory
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                setCurrentView('table');
                setSelectedArticleSlug(null);
                setSelectedMachine(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors"
            >
              Specs Table
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                setCurrentView('standards');
                setSelectedArticleSlug(null);
                setSelectedMachine(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors"
            >
              AHRI 810 Standards
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                setCurrentView('blog');
                setSelectedArticleSlug(null);
                setSelectedMachine(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors font-medium text-slate-700"
            >
              Guides & Articles
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => handleOpenQuote()}
              style={{ cursor: 'pointer' }}
              className="hover:text-blue-700 transition-colors font-semibold text-blue-600 cursor-pointer"
            >
              Contact Us
            </button>
          </div>
          <div className="text-slate-400 text-[11px] font-mono">
            651 models · AHRI 810/820 verified
          </div>
        </div>
      </footer>
    </div>
  );
}
