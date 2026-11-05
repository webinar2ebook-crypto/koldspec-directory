import { Pool } from 'pg';
import dotenv from 'dotenv';
import { IceMachine } from '../types/iceMachine.ts';

dotenv.config();

const connectionString =
  process.env.NEON_DATABASE_URL ||
  'postgresql://neondb_owner:npg_t43TsLgmiSpJ@ep-wispy-waterfall-bdy5vce3.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require';

let pool: Pool | null = null;

export function getNeonPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle Neon PostgreSQL client:', err);
    });
  }
  return pool;
}

/**
 * Ensure table schema exists in Neon
 */
export async function initNeonDatabase(): Promise<void> {
  const p = getNeonPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS ice_machines (
      id VARCHAR(255) PRIMARY KEY,
      brand VARCHAR(255) NOT NULL,
      model_number VARCHAR(255) NOT NULL,
      model_name VARCHAR(255),
      equipment_type VARCHAR(50) NOT NULL,
      ice_type VARCHAR(50) NOT NULL,
      ice_shape_detail VARCHAR(255),
      harvest_rate_lbs NUMERIC NOT NULL,
      energy_use_rate_kwh NUMERIC NOT NULL,
      potable_water_use_gal NUMERIC,
      condenser_cooling VARCHAR(50) NOT NULL,
      refrigerant VARCHAR(100),
      energy_star_certified BOOLEAN DEFAULT true,
      certified_date VARCHAR(100),
      voltage VARCHAR(100),
      notes TEXT,
      imported_at BIGINT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_ice_machines_brand ON ice_machines(brand);
    CREATE INDEX IF NOT EXISTS idx_ice_machines_ice_type ON ice_machines(ice_type);
    CREATE INDEX IF NOT EXISTS idx_ice_machines_harvest ON ice_machines(harvest_rate_lbs);
    CREATE INDEX IF NOT EXISTS idx_ice_machines_energy ON ice_machines(energy_use_rate_kwh);
  `);
}

function mapRowToMachine(row: any): IceMachine {
  return {
    id: row.id,
    brand: row.brand,
    modelNumber: row.model_number,
    modelName: row.model_name || undefined,
    equipmentType: row.equipment_type,
    iceType: row.ice_type,
    iceShapeDetail: row.ice_shape_detail || undefined,
    harvestRateLbs: Number(row.harvest_rate_lbs),
    energyUseRateKwh: Number(row.energy_use_rate_kwh),
    potableWaterUseGal: row.potable_water_use_gal !== null ? Number(row.potable_water_use_gal) : undefined,
    condenserCooling: row.condenser_cooling,
    refrigerant: row.refrigerant || undefined,
    energyStarCertified: Boolean(row.energy_star_certified),
    certifiedDate: row.certified_date || undefined,
    voltage: row.voltage || undefined,
    notes: row.notes || undefined,
    importedAt: Number(row.imported_at) || Date.now(),
  };
}

export async function fetchAllMachinesFromNeon(): Promise<IceMachine[]> {
  const p = getNeonPool();
  const res = await p.query(
    'SELECT * FROM ice_machines ORDER BY harvest_rate_lbs DESC'
  );
  return res.rows.map(mapRowToMachine);
}

export async function batchUpsertMachinesInNeon(
  machines: IceMachine[],
  mode: 'replace' | 'append' = 'append'
): Promise<number> {
  const p = getNeonPool();
  const client = await p.connect();

  try {
    await client.query('BEGIN');

    if (mode === 'replace') {
      await client.query('DELETE FROM ice_machines');
    }

    // Insert in batches of 100 to avoid exceeding parameter limits
    const chunkSize = 100;
    for (let i = 0; i < machines.length; i += chunkSize) {
      const chunk = machines.slice(i, i + chunkSize);
      
      const valueRows: string[] = [];
      const values: any[] = [];
      let paramIdx = 1;

      for (const m of chunk) {
        valueRows.push(
          `($${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, CURRENT_TIMESTAMP)`
        );
        values.push(
          m.id,
          m.brand,
          m.modelNumber,
          m.modelName || null,
          m.equipmentType,
          m.iceType,
          m.iceShapeDetail || null,
          m.harvestRateLbs,
          m.energyUseRateKwh,
          m.potableWaterUseGal !== undefined ? m.potableWaterUseGal : null,
          m.condenserCooling,
          m.refrigerant || null,
          m.energyStarCertified,
          m.certifiedDate || null,
          m.voltage || null,
          m.notes || null,
          m.importedAt || Date.now()
        );
      }

      const queryText = `
        INSERT INTO ice_machines (
          id, brand, model_number, model_name, equipment_type, ice_type,
          ice_shape_detail, harvest_rate_lbs, energy_use_rate_kwh, potable_water_use_gal,
          condenser_cooling, refrigerant, energy_star_certified, certified_date,
          voltage, notes, imported_at, updated_at
        ) VALUES ${valueRows.join(', ')}
        ON CONFLICT (id) DO UPDATE SET
          brand = EXCLUDED.brand,
          model_number = EXCLUDED.model_number,
          model_name = EXCLUDED.model_name,
          equipment_type = EXCLUDED.equipment_type,
          ice_type = EXCLUDED.ice_type,
          ice_shape_detail = EXCLUDED.ice_shape_detail,
          harvest_rate_lbs = EXCLUDED.harvest_rate_lbs,
          energy_use_rate_kwh = EXCLUDED.energy_use_rate_kwh,
          potable_water_use_gal = EXCLUDED.potable_water_use_gal,
          condenser_cooling = EXCLUDED.condenser_cooling,
          refrigerant = EXCLUDED.refrigerant,
          energy_star_certified = EXCLUDED.energy_star_certified,
          certified_date = EXCLUDED.certified_date,
          voltage = EXCLUDED.voltage,
          notes = EXCLUDED.notes,
          imported_at = EXCLUDED.imported_at,
          updated_at = CURRENT_TIMESTAMP
      `;

      await client.query(queryText, values);
    }

    await client.query('COMMIT');

    const countRes = await client.query('SELECT COUNT(*) as count FROM ice_machines');
    return parseInt(countRes.rows[0].count, 10);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteMachineFromNeon(id: string): Promise<void> {
  const p = getNeonPool();
  await p.query('DELETE FROM ice_machines WHERE id = $1', [id]);
}

export async function clearAllMachinesFromNeon(): Promise<void> {
  const p = getNeonPool();
  await p.query('DELETE FROM ice_machines');
}
