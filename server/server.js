import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'dashboard.json');

app.use(cors());
app.use(express.json());

const seed = {
  unit: { name: '45 Bn', commander: 'Commander', updatedAt: '04 Sep 2026 10:30 AM' },
  summary: { total: 248, normal: 196, watch: 38, highRisk: 14 },
  trend: [
    { day: '22 Aug', normal: 150, watch: 46, highRisk: 11 },
    { day: '24 Aug', normal: 165, watch: 50, highRisk: 14 },
    { day: '26 Aug', normal: 178, watch: 56, highRisk: 19 },
    { day: '28 Aug', normal: 162, watch: 52, highRisk: 11 },
    { day: '30 Aug', normal: 172, watch: 56, highRisk: 12 },
    { day: '01 Sep', normal: 160, watch: 51, highRisk: 11 },
    { day: '03 Sep', normal: 175, watch: 61, highRisk: 14 }
  ],
  units: [
    { name: 'Alpha', total: 52, normal: 44, watch: 6, highRisk: 2, status: 'Stable' },
    { name: 'Bravo', total: 48, normal: 36, watch: 9, highRisk: 3, status: 'Attention' },
    { name: 'Charlie', total: 50, normal: 41, watch: 6, highRisk: 3, status: 'Attention' },
    { name: 'Delta', total: 46, normal: 38, watch: 7, highRisk: 1, status: 'Stable' },
    { name: 'Echo', total: 52, normal: 37, watch: 10, highRisk: 5, status: 'Attention' }
  ],
  insights: [
    'Overall unit wellness is stable.',
    'Slight increase in watch cases in Bravo and Echo.',
    'No critical alerts at present.',
    'Continue regular monitoring and support activities.'
  ]
};

function ensureDataFile() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2));
}

function readData() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/commander/dashboard', (_req, res) => {
  const data = readData();
  const { total, normal, watch, highRisk } = data.summary;
  res.json({
    ...data,
    percentages: {
      normal: Math.round((normal / total) * 100),
      watch: Math.round((watch / total) * 100),
      highRisk: Math.round((highRisk / total) * 100)
    }
  });
});

app.post('/api/commander/refresh', (_req, res) => {
  const data = readData();
  data.unit.updatedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  writeData(data);
  res.json({ ok: true, updatedAt: data.unit.updatedAt });
});

app.get('/api/commander/units/:name', (req, res) => {
  const data = readData();
  const unit = data.units.find(u => u.name.toLowerCase() === req.params.name.toLowerCase());
  if (!unit) return res.status(404).json({ error: 'Unit not found' });
  res.json(unit);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
