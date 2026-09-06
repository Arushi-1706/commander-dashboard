import React from 'react';
import { createRoot } from 'react-dom/client';
import { Shield, LayoutDashboard, Users, TrendingUp, FileText, Bell, UserCircle, LogOut, RefreshCw, ChevronDown, CheckCircle2, AlertTriangle, Siren, UsersRound, Lightbulb } from 'lucide-react';
import './styles.css';

const API = 'http://localhost:5000';

function Donut({ total, normal, watch, highRisk }) {
  const circumference = 2 * Math.PI * 86;
  const segments = [
    { value: normal, label: 'Normal', cls: 'green' },
    { value: watch, label: 'Watch', cls: 'amber' },
    { value: highRisk, label: 'High Risk', cls: 'red' }
  ];
  let offset = 0;
  return <div className="donut-wrap">
    <svg className="donut" viewBox="0 0 220 220">
      <circle cx="110" cy="110" r="86" className="donut-bg" />
      {segments.map((s, i) => {
        const len = (s.value / total) * circumference;
        const el = <circle key={s.label} cx="110" cy="110" r="86" className={`donut-seg ${s.cls}`}
          strokeDasharray={`${len} ${circumference - len}`} strokeDashoffset={-offset} />;
        offset += len;
        return el;
      })}
    </svg>
    <div className="donut-center"><strong>{total}</strong><span>Total</span></div>
    <div className="legend">
      {segments.map(s => <div key={s.label}><span className={`dot ${s.cls}`}></span>{s.label} ({Math.round(s.value / total * 100)}%)</div>)}
    </div>
  </div>;
}

function TrendChart({ points }) {
  const width = 470, height = 225, pad = { l: 44, r: 18, t: 18, b: 42 };
  const maxY = 210;
  const x = i => pad.l + (i * (width - pad.l - pad.r)) / (points.length - 1);
  const y = v => height - pad.b - (v / maxY) * (height - pad.t - pad.b);
  const pathFor = key => points.map((p,i) => `${i ? 'L' : 'M'} ${x(i)} ${y(p[key])}`).join(' ');
  const ticks = [0, 50, 100, 150, 200];
  return <div className="trend-chart">
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {ticks.map(t => <g key={t}><line x1={pad.l} x2={width-pad.r} y1={y(t)} y2={y(t)} className="grid" /><text x={pad.l-10} y={y(t)+4} textAnchor="end" className="tick">{t}</text></g>)}
      <path d={pathFor('normal')} className="line green-line" />
      <path d={pathFor('watch')} className="line amber-line" />
      <path d={pathFor('highRisk')} className="line red-line" />
      {points.map((p,i) => <text key={p.day} x={x(i)} y={height-13} textAnchor="middle" className="xlab">{p.day}</text>)}
    </svg>
    <div className="chart-legend"><span><i className="line-dot green"></i>Normal</span><span><i className="line-dot amber"></i>Watch</span><span><i className="line-dot red"></i>High Risk</span></div>
  </div>;
}

function App() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState(null);
  const [error, setError] = React.useState('');

  const load = async () => {
    try {
      setError('');
      const res = await fetch(`${API}/api/commander/dashboard`);
      if (!res.ok) throw new Error('Backend request failed');
      setData(await res.json());
    } catch (e) {
      setError('Backend is not reachable. Start the server with npm run dev in /server.');
    } finally { setLoading(false); }
  };

  React.useEffect(() => { load(); }, []);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await fetch(`${API}/api/commander/refresh`, { method: 'POST' });
      await load();
    } finally { setRefreshing(false); }
  };

  if (loading) return <div className="center"><div className="loader"></div><p>Loading Commander Dashboard…</p></div>;
  if (!data) return <div className="center error-box"><h2>Unable to load dashboard</h2><p>{error}</p><button onClick={load}>Retry</button></div>;

  const { summary, percentages, trend, units, insights, unit } = data;

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><Shield size={24}/></div><div><div className="brand-title">Personnel Wellness</div><div className="brand-sub">Stronger Minds, Safer Missions</div></div></div>
      <nav>
        {[['Dashboard',LayoutDashboard],['Unit Overview',Users],['Trends',TrendingUp],['Reports',FileText],['Notifications',Bell],['Profile',UserCircle]].map(([label,Icon],i) => <button key={label} className={`nav-item ${i===0?'active':''}`}><Icon size={18}/><span>{label}</span></button>)}
      </nav>
      <button className="logout"><LogOut size={18}/><span>Log Out</span></button>
    </aside>

    <main className="main">
      <header className="topbar">
        <div><h1>Welcome, Commander</h1><p>Unit: {unit.name} <span className="sep">|</span> Last updated: {unit.updatedAt}</p></div>
        <div className="top-actions"><button className={`icon-btn ${refreshing?'spin':''}`} onClick={refresh} title="Refresh"><RefreshCw size={19}/></button><div className="profile-pill"><div className="avatar">C</div><div><strong>Commander</strong><span>{unit.name}</span></div><ChevronDown size={16}/></div></div>
      </header>

      <section className="content">
        {error && <div className="toast">{error}</div>}
        <div className="kpi-grid">
          <div className="card kpi"><div className="kpi-icon blue"><UsersRound size={25}/></div><div><span>Total Personnel</span><strong>{summary.total}</strong></div></div>
          <div className="card kpi"><div className="kpi-icon green"><CheckCircle2 size={25}/></div><div><span>Normal</span><strong>{summary.normal}</strong><small>({percentages.normal}%)</small></div></div>
          <div className="card kpi"><div className="kpi-icon amber"><AlertTriangle size={25}/></div><div><span>Watch</span><strong>{summary.watch}</strong><small>({percentages.watch}%)</small></div></div>
          <div className="card kpi"><div className="kpi-icon red"><Siren size={25}/></div><div><span>High Risk</span><strong>{summary.highRisk}</strong><small>({percentages.highRisk}%)</small></div></div>
        </div>

        <div className="two-col">
          <section className="card panel"><div className="panel-title"><h2>Risk Distribution</h2></div><Donut {...summary} /></section>
          <section className="card panel"><div className="panel-title"><h2>Trend (Last 14 Days)</h2></div><TrendChart points={trend}/></section>
        </div>

        <div className="bottom-grid">
          <section className="card panel table-panel"><div className="panel-title"><h2>Unit-wise Status</h2></div><div className="table-wrap"><table><thead><tr><th>Unit / Company</th><th>Total</th><th>Normal</th><th>Watch</th><th>High Risk</th><th>Status</th></tr></thead><tbody>{units.map(u => <tr key={u.name} onClick={()=>setSelectedUnit(u)}><td className="unit-name">{u.name}</td><td>{u.total}</td><td className="green-text">{u.normal} <span>({Math.round(u.normal/u.total*100)}%)</span></td><td className="amber-text">{u.watch} <span>({Math.round(u.watch/u.total*100)}%)</span></td><td className="red-text">{u.highRisk} <span>({Math.round(u.highRisk/u.total*100)}%)</span></td><td><span className={`status ${u.status.toLowerCase()}`}>{u.status}</span></td></tr>)}</tbody></table></div><p className="table-hint">Tap any unit for its summary.</p></section>
          <section className="card panel insight-panel"><div className="panel-title"><h2>Key Insights</h2><Lightbulb size={20}/></div><ul>{insights.map(x=><li key={x}>{x}</li>)}</ul><div className="privacy-note">Commander view shows unit-level aggregates only.</div></section>
        </div>
      </section>
    </main>

    {selectedUnit && <div className="modal-backdrop" onClick={()=>setSelectedUnit(null)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelectedUnit(null)}>×</button><h2>{selectedUnit.name} — Unit Summary</h2><p className="muted">Aggregated information only. No individual personnel identities are exposed.</p><div className="modal-stats"><div><strong>{selectedUnit.total}</strong><span>Total</span></div><div><strong>{selectedUnit.normal}</strong><span>Normal</span></div><div><strong>{selectedUnit.watch}</strong><span>Watch</span></div><div><strong>{selectedUnit.highRisk}</strong><span>High Risk</span></div></div><div className={`modal-banner ${selectedUnit.status.toLowerCase()}`}>{selectedUnit.status === 'Attention' ? 'Recommend closer monitoring and welfare coordination.' : 'Continue regular monitoring and support activities.'}</div></div></div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
