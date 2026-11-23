import { useCallback, useMemo, useState } from 'react';
import {
  Activity, ArrowUpRight, CheckCircle2, ChevronDown, CircleHelp,
  Clock3, Gauge, Layers3, Plus, Search, ShieldCheck, SlidersHorizontal,
  Zap, LoaderCircle
} from 'lucide-react';
import { sanitizeText } from './sanitize.js';

const initialItems = [
  { id: 1, title: 'Reduce API response latency', category: 'Backend', impact: 'High', status: 'In progress', detail: 'Review cache strategy and remove duplicate database reads.', metric: '−28% latency' },
  { id: 2, title: 'Optimize image delivery', category: 'Frontend', impact: 'Medium', status: 'Planned', detail: 'Serve responsive WebP assets and defer below-the-fold images.', metric: '−420 KB' },
  { id: 3, title: 'Add database query indexes', category: 'Database', impact: 'High', status: 'Completed', detail: 'Index the most frequently filtered reporting columns.', metric: '+36% throughput' },
  { id: 4, title: 'Split analytics bundle', category: 'Frontend', impact: 'Medium', status: 'Planned', detail: 'Load reporting charts only when the analytics view is opened.', metric: '−18% bundle' }
];

const statusClass = (status) => status.toLowerCase().replaceAll(' ', '-');

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [form, setForm] = useState({ title: '', metric: '', baseline: '', target: '', priority: 'Medium' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');

  const filteredItems = useMemo(() => items.filter((item) => {
    const matchesQuery = `${item.title} ${item.detail} ${item.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === 'All' || item.category === category);
  }), [items, query, category]);

  const completedCount = useMemo(() => items.filter((item) => item.status === 'Completed').length, [items]);
  const inProgressCount = useMemo(() => items.filter((item) => item.status === 'In progress').length, [items]);

  const updateField = useCallback((event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === 'priority' ? value : sanitizeText(value) }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }, []);

  const trackAction = useCallback((action) => {
    console.info(`[Analytics] User interacted with Performance Optimization: ${action}`);
  }, []);

  const submitForm = useCallback(async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Enter an optimization title.';
    if (!form.metric.trim()) nextErrors.metric = 'Enter the metric to improve.';
    if (form.baseline === '' || !Number.isFinite(Number(form.baseline)) || Number(form.baseline) < 0) nextErrors.baseline = 'Enter a valid baseline (0 or more).';
    if (form.target === '' || !Number.isFinite(Number(form.target)) || Number(form.target) < 0) nextErrors.target = 'Enter a valid target (0 or more).';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setNotice('Please correct the highlighted fields.');
      return;
    }

    setLoading(true);
    setNotice('');
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    const newItem = {
      id: Date.now(),
      title: form.title,
      category: 'Custom',
      impact: form.priority,
      status: 'Planned',
      detail: `${form.metric}: ${form.baseline} → ${form.target}`,
      metric: `${form.baseline} → ${form.target}`
    };
    setItems((current) => [newItem, ...current]);
    setForm({ title: '', metric: '', baseline: '', target: '', priority: 'Medium' });
    setLoading(false);
    setNotice('Optimization initiative added successfully.');
    trackAction('initiative created');
  }, [form, trackAction]);

  const runOptimization = useCallback(async (id) => {
    setLoading(true);
    setNotice('');
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: 'In progress' } : item));
    setLoading(false);
    setNotice('Optimization run started.');
    trackAction('run optimization');
  }, [trackAction]);

  const handleSearch = useCallback((event) => setQuery(sanitizeText(event.target.value)), []);
  const handleCategory = useCallback((event) => setCategory(event.target.value), []);
  const handleTab = useCallback((tab) => {
    setActiveTab(tab);
    trackAction(`opened ${tab}`);
  }, [trackAction]);

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand"><div className="brand-mark"><Activity size={19} aria-hidden="true" /></div><span>northstar<span className="brand-light"> / ops</span></span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">
          <button className={`nav-item ${activeTab === 'Overview' ? 'selected' : ''}`} onClick={() => handleTab('Overview')} aria-current={activeTab === 'Overview' ? 'page' : undefined}><Layers3 size={17} aria-hidden="true" /> Overview</button>
          <button className={`nav-item ${activeTab === 'Performance' ? 'selected' : ''}`} onClick={() => handleTab('Performance')} aria-current={activeTab === 'Performance' ? 'page' : undefined}><Gauge size={17} aria-hidden="true" /> Performance</button>
          <button className={`nav-item ${activeTab === 'Reports' ? 'selected' : ''}`} onClick={() => handleTab('Reports')} aria-current={activeTab === 'Reports' ? 'page' : undefined}><Activity size={17} aria-hidden="true" /> Reports</button>
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><CircleHelp size={18} aria-hidden="true" /><div><strong>Need a hand?</strong><span>Visit the help centre</span></div><ArrowUpRight size={15} aria-hidden="true" /></div><div className="profile"><div className="avatar">AM</div><div><strong>Alex Morgan</strong><span>Workspace admin</span></div><ChevronDown size={16} aria-hidden="true" /></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> Performance</div><div className="topbar-right"><span className="system-status"><span className="status-dot" /> All systems operational</span><button className="icon-button" aria-label="Open help and support"><CircleHelp size={18} /></button><div className="avatar small">AM</div></div></header>
        <div className="page-wrap">
          <section className="page-heading"><div><div className="eyebrow">OPERATIONS / OPTIMIZATION</div><h1>Performance optimization</h1><p>Monitor, prioritize, and improve the systems that power your business.</p></div><button className="button button-dark" onClick={() => document.getElementById('initiative-title')?.focus()}><Plus size={16} /> New initiative</button></section>

          <section className="metrics-grid" aria-label="Performance summary">
            <article className="metric-card"><div className="metric-top"><span>Overall performance</span><Gauge size={17} /></div><div className="metric-value">94.8<span className="metric-unit">/100</span></div><div className="metric-foot"><span className="trend">↑ 4.2%</span><span>vs. last month</span><div className="sparkline"><i /><i /><i /><i /><i /><i /><i /></div></div></article>
            <article className="metric-card"><div className="metric-top"><span>Active initiatives</span><Zap size={17} /></div><div className="metric-value">{items.length - completedCount}<span className="metric-unit"> items</span></div><div className="metric-foot"><span>{inProgressCount} in progress</span><span className="metric-muted">Across all teams</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Completed</span><CheckCircle2 size={17} /></div><div className="metric-value">{completedCount}<span className="metric-unit"> items</span></div><div className="metric-foot"><span className="trend">On track</span><span>Delivery status</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Average response</span><Clock3 size={17} /></div><div className="metric-value">128<span className="metric-unit"> ms</span></div><div className="metric-foot"><span className="trend">↓ 12 ms</span><span>vs. last month</span></div></article>
          </section>

          <div className="content-grid">
            <section className="panel initiatives-panel">
              <div className="panel-heading"><div><div className="eyebrow">YOUR WORKSPACE</div><h2>Optimization initiatives</h2><p>Track the work making your platform faster and more reliable.</p></div><button className="button button-light" onClick={() => { setQuery(''); setCategory('All'); trackAction('reset filters'); }}><SlidersHorizontal size={15} /> Reset filters</button></div>
              <div className="filters"><label className="search-box"><Search size={16} aria-hidden="true" /><input aria-label="Search initiatives" placeholder="Search initiatives..." value={query} onChange={handleSearch} /></label><label className="select-wrap"><span className="sr-only">Filter by category</span><select aria-label="Filter by category" value={category} onChange={handleCategory}><option>All</option><option>Backend</option><option>Frontend</option><option>Database</option><option>Custom</option></select><ChevronDown size={15} aria-hidden="true" /></label></div>
              {loading && <div className="loading-strip" role="status" aria-live="polite"><LoaderCircle size={16} className="spin" /> Processing your request…</div>}
              <div className="initiative-list" aria-live="polite">
                {filteredItems.length === 0 ? <div className="empty-state"><div className="empty-icon"><Search size={22} /></div><strong>No data found</strong><p>Try another search term or change the category filter.</p><button className="text-button" onClick={() => { setQuery(''); setCategory('All'); }}>Clear filters</button></div> : filteredItems.map((item) => (
                  <article className="initiative-row" key={item.id}>
                    <div className="initiative-icon"><Activity size={18} aria-hidden="true" /></div><div className="initiative-copy"><div className="initiative-title-line"><h3>{item.title}</h3><span className={`status status-${statusClass(item.status)}`}>{item.status}</span></div><p>{item.detail}</p><div className="initiative-meta"><span>{item.category}</span><span className="meta-dot">·</span><span>Impact: {item.impact}</span></div></div><div className="initiative-result"><strong>{item.metric}</strong><span>Expected impact</span></div><button className="row-action" aria-label={`Run optimization for ${item.title}`} disabled={loading || item.status === 'Completed'} onClick={() => runOptimization(item.id)}>{item.status === 'Completed' ? <CheckCircle2 size={17} /> : <ArrowUpRight size={17} />}</button>
                  </article>
                ))}
              </div>
              <div className="list-footer"><span>Showing {filteredItems.length} of {items.length} initiatives</span><span><span className="live-dot" /> Updated just now</span></div>
            </section>

            <aside className="right-column">
              <section className="panel form-panel"><div className="form-heading"><div className="eyebrow">PLAN AHEAD</div><h2>Create initiative</h2><p>Define a measurable improvement for your team.</p></div>
                <form onSubmit={submitForm} noValidate>
                  <div className="field"><label htmlFor="initiative-title">Initiative name <span>*</span></label><input id="initiative-title" name="title" value={form.title} onChange={updateField} placeholder="e.g. Improve checkout speed" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'title-error' : undefined} />{errors.title && <span className="field-error" id="title-error">{errors.title}</span>}</div>
                  <div className="field"><label htmlFor="metric">Success metric <span>*</span></label><input id="metric" name="metric" value={form.metric} onChange={updateField} placeholder="e.g. Page load time" aria-invalid={Boolean(errors.metric)} aria-describedby={errors.metric ? 'metric-error' : undefined} />{errors.metric && <span className="field-error" id="metric-error">{errors.metric}</span>}</div>
                  <div className="field-pair"><div className="field"><label htmlFor="baseline">Baseline <span>*</span></label><input id="baseline" name="baseline" inputMode="decimal" value={form.baseline} onChange={updateField} placeholder="Current" aria-invalid={Boolean(errors.baseline)} aria-describedby={errors.baseline ? 'baseline-error' : undefined} />{errors.baseline && <span className="field-error" id="baseline-error">{errors.baseline}</span>}</div><div className="field"><label htmlFor="target">Target <span>*</span></label><input id="target" name="target" inputMode="decimal" value={form.target} onChange={updateField} placeholder="Goal" aria-invalid={Boolean(errors.target)} aria-describedby={errors.target ? 'target-error' : undefined} />{errors.target && <span className="field-error" id="target-error">{errors.target}</span>}</div></div>
                  <div className="field"><label htmlFor="priority">Priority</label><div className="select-wrap full"><select id="priority" name="priority" value={form.priority} onChange={updateField}><option>Low</option><option>Medium</option><option>High</option></select><ChevronDown size={15} aria-hidden="true" /></div></div>
                  <button className="button button-dark submit-button" type="submit" disabled={loading}>{loading ? <><LoaderCircle size={16} className="spin" /> Saving…</> : <><Plus size={16} /> Add initiative</>}</button>
                  {notice && <p className={`form-notice ${Object.keys(errors).length ? 'notice-error' : ''}`} role="status">{notice}</p>}
                </form>
              </section>
              <section className="insight-card"><div className="insight-icon"><ShieldCheck size={18} /></div><div><strong>Keep performance on track</strong><p>Small, measurable improvements compound into a faster and more reliable experience.</p><button className="text-button" onClick={() => { handleTab('Reports'); setNotice('Reports view selected.'); }}>View performance reports <ArrowUpRight size={13} /></button></div></section>
            </aside>
          </div>
          <footer className="page-footer"><span>Northstar Operations Platform <span className="footer-separator">·</span> Performance workspace</span><span>Secure workspace <ShieldCheck size={13} /></span></footer>
        </div>
      </main>
    </div>
  );
}
