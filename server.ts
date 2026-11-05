import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initNeonDatabase,
  fetchAllMachinesFromNeon,
  batchUpsertMachinesInNeon,
  deleteMachineFromNeon,
  clearAllMachinesFromNeon,
  getNeonPool,
} from './src/server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Support large payloads for 650+ machine spec imports
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health / Status endpoint
app.get('/api/health', async (req, res) => {
  try {
    const pool = getNeonPool();
    const result = await pool.query(
      'SELECT COUNT(*) as count, NOW() as server_time FROM ice_machines'
    );
    res.json({
      status: 'connected',
      database: 'Neon PostgreSQL',
      machineCount: parseInt(result.rows[0].count, 10),
      serverTime: result.rows[0].server_time,
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      database: 'Neon PostgreSQL',
      message: error.message,
    });
  }
});

// Fetch all machines from Neon
app.get('/api/machines', async (req, res) => {
  try {
    const machines = await fetchAllMachinesFromNeon();
    res.json({ machines, count: machines.length });
  } catch (error: any) {
    console.error('Failed to query machines from Neon:', error);
    res.status(500).json({ error: error.message || 'Database query failed' });
  }
});

// Batch Upsert / Sync machines to Neon
app.post('/api/machines/sync', async (req, res) => {
  try {
    const { machines, mode } = req.body;
    if (!Array.isArray(machines)) {
      return res.status(400).json({ error: 'Expected machines array in payload' });
    }
    const count = await batchUpsertMachinesInNeon(machines, mode || 'append');
    res.json({
      success: true,
      count,
      message: `Successfully synchronized ${machines.length} machines to Neon PostgreSQL.`,
    });
  } catch (error: any) {
    console.error('Sync to Neon failed:', error);
    res.status(500).json({ error: error.message || 'Failed to sync to Neon' });
  }
});

// Batch Import endpoint
app.post('/api/machines/batch', async (req, res) => {
  try {
    const { machines, mode } = req.body;
    if (!Array.isArray(machines)) {
      return res.status(400).json({ error: 'Expected machines array in payload' });
    }
    const count = await batchUpsertMachinesInNeon(machines, mode || 'replace');
    res.json({ success: true, count });
  } catch (error: any) {
    console.error('Batch import failed:', error);
    res.status(500).json({ error: error.message || 'Batch import failed' });
  }
});

// Delete single machine
app.delete('/api/machines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteMachineFromNeon(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete machine failed:', error);
    res.status(500).json({ error: error.message || 'Delete failed' });
  }
});

// Clear all machines
app.delete('/api/machines', async (req, res) => {
  try {
    await clearAllMachinesFromNeon();
    res.json({ success: true });
  } catch (error: any) {
    console.error('Clear machines failed:', error);
    res.status(500).json({ error: error.message || 'Clear failed' });
  }
});

async function startServer() {
  // Ensure Neon schema is ready
  try {
    await initNeonDatabase();
    console.log('Neon PostgreSQL table schema verified.');
  } catch (err) {
    console.error('Neon schema initialization warning:', err);
  }

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Mount Vite dev server middlewares
    const { createServer: createViteServer } = await import('vite');
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        // Disable HMR WebSocket in AI Studio to prevent WebSocket connection errors in sandbox
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (Neon PostgreSQL connected)`);
  });
}

startServer();
