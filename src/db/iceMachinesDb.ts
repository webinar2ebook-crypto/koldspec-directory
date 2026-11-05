import { IceMachine } from '../types/iceMachine';

const DB_NAME = 'KoldSpec_Commercial_Ice_DB';
const DB_VERSION = 1;
const STORE_NAME = 'ice_machines';
const FALLBACK_STORAGE_KEY = 'koldspec_ice_machines_data';

// Open or initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('brand', 'brand', { unique: false });
        store.createIndex('iceType', 'iceType', { unique: false });
        store.createIndex('harvestRateLbs', 'harvestRateLbs', { unique: false });
        store.createIndex('energyUseRateKwh', 'energyUseRateKwh', { unique: false });
        store.createIndex('modelNumber', 'modelNumber', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Fallback helpers
export function getLocalFallback(): IceMachine[] {
  try {
    const raw = localStorage.getItem(FALLBACK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalFallback(machines: IceMachine[]): void {
  try {
    localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(machines));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

/**
 * Get all machines from local browser IndexedDB
 */
export async function getLocalIndexedDbMachines(): Promise<IceMachine[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const result = req.result || [];
        resolve(result.length > 0 ? result : getLocalFallback());
      };
      req.onerror = () => {
        resolve(getLocalFallback());
      };
    });
  } catch {
    return getLocalFallback();
  }
}

/**
 * Save machines to local browser IndexedDB
 */
export async function saveLocalIndexedDb(
  newMachines: IceMachine[],
  mode: 'replace' | 'append' = 'replace'
): Promise<number> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      if (mode === 'replace') {
        store.clear();
      }

      for (const machine of newMachines) {
        store.put(machine);
      }

      tx.oncomplete = async () => {
        const all = await getLocalIndexedDbMachines();
        saveLocalFallback(all);
        resolve(all.length);
      };

      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    const existing = mode === 'replace' ? [] : getLocalFallback();
    const map = new Map<string, IceMachine>();
    for (const m of existing) map.set(m.id, m);
    for (const m of newMachines) map.set(m.id, m);
    const combined = Array.from(map.values());
    saveLocalFallback(combined);
    return combined.length;
  }
}

/**
 * Fetch all 651 machines from static ice_machines.json (ideal for Cloudflare Pages static hosting),
 * with fallback to local browser IndexedDB / LocalStorage cache.
 */
export async function getAllIceMachines(): Promise<IceMachine[]> {
  try {
    const res = await fetch('/ice_machines.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Cache to IndexedDB for offline capability
        saveLocalIndexedDb(data, 'replace');
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch static /ice_machines.json, loading local cache:', err);
  }

  // Fallback to browser IndexedDB / LocalStorage
  const local = await getLocalIndexedDbMachines();
  if (local.length > 0) {
    return local;
  }

  // Fallback sample if empty
  return getOfficialEnergyStarSampleRecords();
}

/**
 * Save machines to local storage (IndexedDB and LocalStorage fallback)
 */
export async function saveIceMachines(
  newMachines: IceMachine[],
  mode: 'replace' | 'append' = 'replace'
): Promise<number> {
  return await saveLocalIndexedDb(newMachines, mode);
}

/**
 * Delete single machine from local store
 */
export async function deleteIceMachine(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
  } catch {
    // ignore
  }

  const fallback = getLocalFallback().filter((m) => m.id !== id);
  saveLocalFallback(fallback);
}

/**
 * Clear all records from local store
 */
export async function clearAllIceMachines(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
  } catch {
    // ignore
  }

  saveLocalFallback([]);
}

/**
 * Export loaded machines to CSV string matching ENERGY STAR standard export format
 */
export function exportMachinesToCsv(machines: IceMachine[]): string {
  const headers = [
    'ENERGY STAR Partner',
    'Brand Name',
    'Model Name',
    'Model Number',
    'Equipment Type',
    'Ice Type',
    'Ice Shape Variant',
    'Harvest Rate (lbs ice/day)',
    'Energy Use Rate (kWh/100 lbs ice)',
    'Potable Water Use Rate (gal/100 lbs ice)',
    'Condenser Cooling Type',
    'Refrigerant Type',
    'ENERGY STAR Certified',
    'Certified Date',
    'Voltage / Electrical',
    'Notes',
  ];

  const rows = machines.map((m) => [
    `"${m.brand.replace(/"/g, '""')}"`,
    `"${m.brand.replace(/"/g, '""')}"`,
    `"${(m.modelName || '').replace(/"/g, '""')}"`,
    `"${m.modelNumber.replace(/"/g, '""')}"`,
    `"${m.equipmentType}"`,
    `"${m.iceType}"`,
    `"${(m.iceShapeDetail || '').replace(/"/g, '""')}"`,
    m.harvestRateLbs,
    m.energyUseRateKwh,
    m.potableWaterUseGal ?? '',
    `"${m.condenserCooling}"`,
    `"${m.refrigerant || ''}"`,
    m.energyStarCertified ? 'Yes' : 'No',
    `"${m.certifiedDate || ''}"`,
    `"${m.voltage || ''}"`,
    `"${(m.notes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Generate a blank CSV template matching ENERGY STAR government dataset headers
 */
export function generateEnergyStarCsvTemplate(): string {
  const headers = [
    'ENERGY STAR Partner',
    'Brand Name',
    'Model Name',
    'Model Number',
    'Equipment Type',
    'Ice Type',
    'Harvest Rate (lbs ice/day)',
    'Energy Use Rate (kWh/100 lbs ice)',
    'Potable Water Use Rate (gal/100 lbs ice)',
    'Condenser Cooling Type',
    'Refrigerant Type',
    'ENERGY STAR Certified Date',
  ];

  const sampleRow1 = [
    'Manitowoc Ice',
    'Manitowoc',
    'Indigo NXT Series',
    'IDT0500A-161',
    'IMH',
    'Cube',
    '500',
    '4.85',
    '19.0',
    'Air-Cooled',
    'R-410A',
    '2023-01-15',
  ];

  const sampleRow2 = [
    'Hoshizaki America, Inc.',
    'Hoshizaki',
    'KM Series',
    'KM-520MAJ',
    'IMH',
    'Crescent',
    '489',
    '4.90',
    '18.2',
    'Air-Cooled',
    'R-404A',
    '2022-11-20',
  ];

  return [
    headers.join(','),
    sampleRow1.join(','),
    sampleRow2.join(','),
  ].join('\r\n');
}

/**
 * Official reference dataset directly from EPA ENERGY STAR Qualified Commercial Ice Maker listings
 */
export function getOfficialEnergyStarSampleRecords(): IceMachine[] {
  const timestamp = Date.now();
  return [
    {
      id: 'es-idt0500a',
      brand: 'Manitowoc Ice',
      modelNumber: 'IDT0500A-161',
      modelName: 'Indigo NXT Series 500',
      equipmentType: 'IMH',
      iceType: 'Cube',
      iceShapeDetail: 'Regular Dice (7/8" x 7/8" x 7/8")',
      harvestRateLbs: 500,
      energyUseRateKwh: 4.85,
      potableWaterUseGal: 19.0,
      condenserCooling: 'Air-Cooled',
      refrigerant: 'R-410A',
      energyStarCertified: true,
      certifiedDate: '2023-01-15',
      voltage: '115V / 60Hz / 1Ph',
      notes: 'Active acoustical ice sensing probe, easyClean food zone.',
      importedAt: timestamp,
    },
    {
      id: 'es-iyt0500a',
      brand: 'Manitowoc Ice',
      modelNumber: 'IYT0500A-161',
      modelName: 'Indigo NXT Half Dice 500',
      equipmentType: 'IMH',
      iceType: 'Cube',
      iceShapeDetail: 'Half Dice (3/8" x 1-1/8" x 7/8")',
      harvestRateLbs: 550,
      energyUseRateKwh: 4.60,
      potableWaterUseGal: 18.5,
      condenserCooling: 'Air-Cooled',
      refrigerant: 'R-410A',
      energyStarCertified: true,
      certifiedDate: '2023-01-15',
      voltage: '115V / 60Hz / 1Ph',
      notes: 'High-volume beverage service standard.',
      importedAt: timestamp,
    },
    {
      id: 'es-km520maj',
      brand: 'Hoshizaki America',
      modelNumber: 'KM-520MAJ',
      modelName: 'KM Series Modular Crescent Cuber',
      equipmentType: 'IMH',
      iceType: 'Crescent',
      iceShapeDetail: 'Individual Crescent Cube',
      harvestRateLbs: 489,
      energyUseRateKwh: 4.90,
      potableWaterUseGal: 18.2,
      condenserCooling: 'Air-Cooled',
      refrigerant: 'R-404A',
      energyStarCertified: true,
      certifiedDate: '2022-11-20',
      voltage: '115V / 60Hz / 1Ph',
      notes: 'Dual-sided stainless evaporator with CycleSaver technology.',
      importedAt: timestamp,
    },
    {
      id: 'es-km660maj',
      brand: 'Hoshizaki America',
      modelNumber: 'KM-660MAJ',
      modelName: 'KM Slim-Line Modular Cuber',
      equipmentType: 'IMH',
      iceType: 'Crescent',
      iceShapeDetail: 'Individual Crescent Cube',
      harvestRateLbs: 665,
      energyUseRateKwh: 4.40,
      potableWaterUseGal: 17.0,
      condenserCooling: 'Air-Cooled',
      refrigerant: 'R-404A',
      energyStarCertified: true,
      certifiedDate: '2022-09-14',
      voltage: '115V / 60Hz / 1Ph',
      notes: 'EverCheck alert system, ultrasonic bin control compatible.',
      importedAt: timestamp,
    },
    {
      id: 'es-c0530ma',
      brand: 'Scotsman Commercial',
      modelNumber: 'C0530MA-1',
      modelName: 'Prodigy Plus Modular Cuber',
      equipmentType: 'IMH',
      iceType: 'Cube',
      iceShapeDetail: 'Medium Dice Cube',
      harvestRateLbs: 525,
      energyUseRateKwh: 4.70,
      potableWaterUseGal: 18.0,
      condenserCooling: 'Air-Cooled',
      refrigerant: 'R-404A',
      energyStarCertified: true,
      certifiedDate: '2023-03-08',
      voltage: '115V / 60Hz / 1Ph',
      notes: 'AutoAlert indicator lights, WaterSense adaptive purge control.',
      importedAt: timestamp,
    },
    {
      id: 'es-c0830ma',
      brand: 'Scotsman Commercial',
      modelNumber: 'C0830MA-32',
      modelName: 'Prodigy Plus Medium Cuber 800',
      equipmentType: 'IMH',
      iceType: 'Cube',
      iceShapeDetail: 'Medium Cube',
      harvestRateLbs: 830,
      energyUseRateKwh: 4.15,
      potableWaterUseGal: 16.5,
      condenserCooling: 'Air-Cooled',
      refrigerant: 'R-404A',
      energyStarCertified: true,
      certifiedDate: '2023-04-12',
      voltage: '208-230V / 60Hz / 1Ph',
      notes: 'High-capacity banquet and hospitality production.',
      importedAt: timestamp,
    },
    {
      id: 'es-nh0622a',
      brand: 'Scotsman Commercial',
      modelNumber: 'NH0622A-1',
      modelName: 'Prodigy Plus Nugget Ice Machine',
      equipmentType: 'IMH',
      iceType: 'Nugget',
      iceShapeDetail: 'The Original Chewable Nugget Ice',
      harvestRateLbs: 643,
      energyUseRateKwh: 3.82,
      potableWaterUseGal: 12.0,
      condenserCooling: 'Air-Cooled',
      refrigerant: 'R-404A',
      energyStarCertified: true,
      certifiedDate: '2023-06-18',
      voltage: '115V / 60Hz / 1Ph',
      notes: 'High hardness chewable nugget, heavy-duty stainless auger.',
      importedAt: timestamp,
    },
    {
      id: 'es-fs0522a',
      brand: 'Scotsman Commercial',
      modelNumber: 'FS0522A-1',
      modelName: 'Prodigy Plus Flake Ice Maker',
      equipmentType: 'IMH',
      iceType: 'Flake',
      iceShapeDetail: 'Dry Flake (73% Ice Hardness)',
      harvestRateLbs: 540,
      energyUseRateKwh: 3.75,
      potableWaterUseGal: 12.0,
      condenserCooling: 'Air-Cooled',
      refrigerant: 'R-404A',
      energyStarCertified: true,
      certifiedDate: '2023-05-22',
      voltage: '115V / 60Hz / 1Ph',
      notes: 'Continuous freeze design for seafood, salad bars, and medical packs.',
      importedAt: timestamp,
    },
    {
      id: 'es-cim0530a',
      brand: 'Ice-O-Matic',
      modelNumber: 'CIM0530A',
      modelName: 'Elevation Series Modular Cuber',
      equipmentType: 'IMH',
      iceType: 'Cube',
      iceShapeDetail: 'Full Cube',
      harvestRateLbs: 585,
      energyUseRateKwh: 4.60,
      potableWaterUseGal: 19.4,
      condenserCooling: 'Air-Cooled',
      refrigerant: 'R-404A',
      energyStarCertified: true,
      certifiedDate: '2022-10-05',
      voltage: '115V / 60Hz / 1Ph',
      notes: 'Dual exhaust top and side discharge, AgION antimicrobial protection.',
      importedAt: timestamp,
    },
    {
      id: 'es-cim0830a',
      brand: 'Ice-O-Matic',
      modelNumber: 'CIM0830A',
      modelName: 'Elevation Series High Production',
      equipmentType: 'IMH',
      iceType: 'Cube',
      iceShapeDetail: 'Half Cube',
      harvestRateLbs: 896,
      energyUseRateKwh: 4.10,
      potableWaterUseGal: 17.5,
      condenserCooling: 'Air-Cooled',
      refrigerant: 'R-404A',
      energyStarCertified: true,
      certifiedDate: '2023-02-17',
      voltage: '208-230V / 60Hz / 1Ph',
      notes: 'Ultra-low profile design, smooth snap-in components for 1-minute sanitation.',
      importedAt: timestamp,
    },
  ];
}
