import Papa from 'papaparse';
import { IceMachine, IceType, EquipmentType, CondenserType, CsvColumnMapping } from '../types/iceMachine';

export interface ParseCsvFileResult {
  headers: string[];
  sampleRows: Record<string, string>[];
  allRawRows: Record<string, string>[];
  detectedMapping: CsvColumnMapping;
}

// Normalized fuzzy match helper
function findMatchingHeader(headers: string[], candidates: string[]): string {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const candidateCleans = candidates.map(clean);

  // 1. Exact cleaned match
  for (const h of headers) {
    const ch = clean(h);
    if (candidateCleans.includes(ch)) {
      return h;
    }
  }

  // 2. Contains match
  for (const h of headers) {
    const ch = clean(h);
    for (const c of candidateCleans) {
      if (ch.includes(c) || c.includes(ch)) {
        return h;
      }
    }
  }

  return '';
}

/**
 * Detect column mappings from headers based on official ENERGY STAR database specs
 */
export function detectColumnMapping(headers: string[]): CsvColumnMapping {
  return {
    brand: findMatchingHeader(headers, [
      'brandname',
      'brand',
      'energystarpartner',
      'partner',
      'manufacturer',
      'make',
    ]),
    modelNumber: findMatchingHeader(headers, [
      'modelnumber',
      'modelno',
      'modelnum',
      'model',
      'unitmodel',
    ]),
    modelName: findMatchingHeader(headers, [
      'modelname',
      'productname',
      'series',
      'additionalmodelinformation',
      'family',
    ]),
    equipmentType: findMatchingHeader(headers, [
      'equipmenttype',
      'machinetype',
      'unittype',
      'configuration',
    ]),
    iceType: findMatchingHeader(headers, [
      'icetype',
      'typeofice',
      'iceform',
      'iceshape',
    ]),
    harvestRateLbs: findMatchingHeader(headers, [
      'harvestratelbsiceday',
      'harvestratelbsday',
      'harvestrate',
      'dailyiceproductionlbs',
      'dailyiceproduction',
      'productionlbs',
      'capacitylbs',
      'harvestratelbs',
    ]),
    energyUseRateKwh: findMatchingHeader(headers, [
      'energyuseratekwh100lbsice',
      'energyuseratekwh100lbs',
      'energyuserate',
      'energykwh100lbs',
      'kwh100lbsice',
      'kwh100lbs',
      'energyconsumption',
    ]),
    potableWaterUseGal: findMatchingHeader(headers, [
      'potablewateruserategal100lbsice',
      'potablewateruserate',
      'wateruserategal100lbs',
      'wateruserate',
      'watergal100lbs',
      'potablewateruse',
      'waterconsumption',
    ]),
    condenserCooling: findMatchingHeader(headers, [
      'condensercoolingtype',
      'coolingtype',
      'condensertype',
      'cooling',
      'condenser',
    ]),
    refrigerant: findMatchingHeader(headers, [
      'refrigeranttype',
      'refrigerant',
      'refrigerantgas',
    ]),
    energyStarCertified: findMatchingHeader(headers, [
      'energystarcertified',
      'certified',
      'energystar',
    ]),
    certifiedDate: findMatchingHeader(headers, [
      'energystarcertifieddate',
      'datecertified',
      'certificationdate',
      'dateavailableonmarket',
    ]),
    voltage: findMatchingHeader(headers, [
      'voltageelectrical',
      'voltage',
      'electrical',
      'powersupply',
    ]),
  };
}

/**
 * Parse an uploaded CSV File or string
 */
export function parseCsvContent(fileOrString: File | string): Promise<ParseCsvFileResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(fileOrString as any, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        const headers = results.meta.fields || [];
        const allRawRows = results.data.filter((row) => {
          // Check that row has at least one non-empty value
          return Object.values(row).some((val) => val && String(val).trim().length > 0);
        });

        const detectedMapping = detectColumnMapping(headers);

        resolve({
          headers,
          sampleRows: allRawRows.slice(0, 5),
          allRawRows,
          detectedMapping,
        });
      },
      error: (err) => reject(err),
    });
  });
}

function normalizeIceType(raw: string): IceType {
  const val = raw.toLowerCase().trim();
  if (val.includes('cube') || val.includes('dice')) return 'Cube';
  if (val.includes('nugget') || val.includes('chew') || val.includes('pellet') || val.includes('pearl')) return 'Nugget';
  if (val.includes('flake') || val.includes('snow')) return 'Flake';
  if (val.includes('crescent')) return 'Crescent';
  if (val.includes('gourmet') || val.includes('bell')) return 'Gourmet';
  if (val.includes('continuous')) return 'Continuous';
  return 'Cube';
}

function normalizeEquipmentType(raw: string): EquipmentType {
  const val = raw.toUpperCase().trim();
  if (val.includes('IMH') || val.includes('HEAD') || val.includes('MODULAR')) return 'IMH';
  if (val.includes('SCU') || val.includes('SELF') || val.includes('UNDERCOUNTER')) return 'SCU';
  if (val.includes('RCU') || val.includes('REMOTE')) return 'RCU';
  return 'IMH';
}

function normalizeCondenser(raw: string): CondenserType {
  const val = raw.toLowerCase().trim();
  if (val.includes('water')) return 'Water-Cooled';
  if (val.includes('remote')) return 'Remote Air-Cooled';
  return 'Air-Cooled';
}

function parseNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Transform raw CSV rows into typed IceMachine objects using chosen mapping
 */
export function convertRowsToIceMachines(
  rawRows: Record<string, string>[],
  mapping: CsvColumnMapping
): { machines: IceMachine[]; skippedCount: number } {
  const machines: IceMachine[] = [];
  let skippedCount = 0;
  const now = Date.now();

  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];

    const brand = (row[mapping.brand] || 'Unknown Brand').trim();
    const modelNumber = (row[mapping.modelNumber] || `MODEL-${i + 1}`).trim();

    // Must have at least a brand or model to be meaningful
    if (!brand && !modelNumber) {
      skippedCount++;
      continue;
    }

    const harvestRateLbs = parseNumber(row[mapping.harvestRateLbs]);
    const energyUseRateKwh = parseNumber(row[mapping.energyUseRateKwh]);
    const potableWaterUseGal = mapping.potableWaterUseGal && row[mapping.potableWaterUseGal]
      ? parseNumber(row[mapping.potableWaterUseGal])
      : undefined;

    const rawIceType = row[mapping.iceType] || 'Cube';
    const rawEquipType = row[mapping.equipmentType] || 'IMH';
    const rawCondenser = row[mapping.condenserCooling] || 'Air-Cooled';
    const rawEnergyStar = row[mapping.energyStarCertified] || 'Yes';

    const energyStarCertified = !['no', 'false', '0', 'n'].includes(
      rawEnergyStar.toLowerCase().trim()
    );

    const safeId = `ice-${brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${modelNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i}`;

    machines.push({
      id: safeId,
      brand,
      modelNumber,
      modelName: row[mapping.modelName]?.trim() || undefined,
      equipmentType: normalizeEquipmentType(rawEquipType),
      iceType: normalizeIceType(rawIceType),
      iceShapeDetail: rawIceType,
      harvestRateLbs: harvestRateLbs || 0,
      energyUseRateKwh: energyUseRateKwh || 0,
      potableWaterUseGal,
      condenserCooling: normalizeCondenser(rawCondenser),
      refrigerant: row[mapping.refrigerant]?.trim() || undefined,
      energyStarCertified,
      certifiedDate: row[mapping.certifiedDate]?.trim() || undefined,
      voltage: row[mapping.voltage]?.trim() || undefined,
      notes: undefined,
      importedAt: now,
    });
  }

  return { machines, skippedCount };
}
