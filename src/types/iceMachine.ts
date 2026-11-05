export type IceType = 'Cube' | 'Flake' | 'Nugget' | 'Crescent' | 'Gourmet' | 'Continuous';

export type EquipmentType = 'IMH' | 'SCU' | 'RCU' | 'Other';

export type CondenserType = 'Air-Cooled' | 'Water-Cooled' | 'Remote Air-Cooled';

export interface IceMachine {
  id: string;
  brand: string;
  modelNumber: string;
  modelName?: string;
  equipmentType: EquipmentType;
  iceType: IceType;
  iceShapeDetail?: string; // e.g. "Full Dice", "Half Dice", "Pearl", "Chewblet"
  harvestRateLbs: number; // lbs per 24 hours (AHRI 90°F / 70°F)
  energyUseRateKwh: number; // kWh per 100 lbs ice
  potableWaterUseGal?: number; // Gal per 100 lbs ice
  condenserCooling: CondenserType;
  refrigerant?: string;
  energyStarCertified: boolean;
  certifiedDate?: string;
  voltage?: string;
  notes?: string;
  importedAt: number;
}

export interface FilterState {
  searchQuery: string;
  brands: string[];
  iceTypes: IceType[];
  productionMin: number;
  productionMax: number;
  energyMaxKwh: number;
  equipmentTypes: EquipmentType[];
  coolingTypes: CondenserType[];
  energyStarOnly: boolean;
  sortBy: 'production-desc' | 'production-asc' | 'energy-asc' | 'water-asc' | 'brand-asc';
}

export interface CsvColumnMapping {
  brand: string;
  modelNumber: string;
  modelName: string;
  equipmentType: string;
  iceType: string;
  harvestRateLbs: string;
  energyUseRateKwh: string;
  potableWaterUseGal: string;
  condenserCooling: string;
  refrigerant: string;
  energyStarCertified: string;
  certifiedDate: string;
  voltage: string;
}

export interface CsvParseResult {
  headers: string[];
  rows: Record<string, string>[];
  detectedMapping: Partial<CsvColumnMapping>;
  validRowsCount: number;
  invalidRowsCount: number;
}
