'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell, CalendarDays, Check, ChevronDown, ExternalLink, LayoutDashboard, LockKeyhole, LogOut, Menu, MoreHorizontal, Package, RefreshCw, Search, Settings, ShieldCheck, ShoppingBag, SlidersHorizontal, Users, X } from 'lucide-react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AdminOverview, Product } from '@/lib/types';

const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || 'https://halfcourt-shoe-store-phi.vercel.app';
const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Products', icon: Package },
  { label: 'Orders', icon: ShoppingBag },
  { label: 'Customers', icon: Users },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
] as const;
type Section = (typeof navigation)[number]['label'];

const money = (value: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(value);
const imageNames: Record<string, string> = {
  'aj1-high-red': 'air jordan high red.png',
  'aj1-low-panda': 'air jordan low panda.png',
  'aj3-black-cement': 'Nike Air Jordan 3 Retro OG Black Cement.png',
  'aj4-bred': 'air jordan 4 bred.png',
  'aj4-white-oreo': 'air jordan 4 white oreo.png',
  'aj5-fire-red': 'air jordan 5 fire red.png',
  'aj6-infrared': 'air jordan 6 ifrared.png',
  'aj9-chile-red': 'air jordan 9 chile red.png',
  'aj11-concord': 'air jordan 11 concord.png',
  'aj12-flugame': 'air jordan 12 flugame.png',
};

function imageUrl(product: Product) {
  if (product.imageUrl) return product.imageUrl;
  const name = imageNames[product.id];
  return name ? `${storeUrl}/images/${encodeURIComponent(name)}` : '';
}

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key) : null;
}

export default function AdminHome() {
  const [section, setSection] = useState<Section>('Dashboard');
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [model, setModel] = useState('All models');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const refreshing = useRef(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const filtered = useMemo(() => (overview?.products ?? []).filter(product => {
    const query = `${product.name} ${product.colorway} ${product.model}`.toLowerCase();
    return query.includes(search.toLowerCase()) && (model === 'All models' || `AJ${product.model}` === model);
  }), [overview?.products, search, model]);

  const loadData = useCallback(async (token: string, quiet = false) => {
    if (!quiet) setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/overview', { headers: token ? { Authorization: `Bearer ${token}` } : undefined, cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not load store data.');
      setOverview(result as AdminOverview);
      setSelected((current) => current ? result.products.find((item: Product) => item.id === current.id) || result.products[0] || null : result.products[0] || null);
      setLastUpdated(new Date());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load store data.');
    } finally {
      if (!quiet) setBusy(false);
    }
  }, []);

  useEffect(() => {
    const auth = getSupabaseClient();
    setClient(auth);
    if (!auth) {
      setBusy(false);
      setError('Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable admin sign-in.');
      return;
    }
    void (async () => {
      try {
        const { data, error: sessionError } = await auth.auth.getSession();
        if (sessionError) throw sessionError;
        if (!data.session) return;
        setAdminEmail(data.session.user.email || '');
        await loadData(data.session.access_token);
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : 'Could not restore the admin session.');
      } finally {
        setBusy(false);
      }
    })();
  }, [loadData]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return setError('Supabase Auth is not configured.');
    setSigningIn(true);
    setError('');
    try {
      const { data, error: authError } = await client.auth.signInWithPassword({ email: email.trim(), password });
      if (authError || !data.session) throw new Error(authError?.message || 'Admin sign-in failed.');
      setAdminEmail(data.user.email || '');
      await loadData(data.session.access_token);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Admin sign-in failed.');
    } finally {
      setSigningIn(false);
    }
  }

  async function signOut() {
    let signOutError = '';
    try {
      if (client) {
        const { error } = await client.auth.signOut();
        signOutError = error?.message || '';
      }
    } catch (reason) {
      signOutError = reason instanceof Error ? reason.message : 'Could not sign out.';
    }
    setAdminEmail('');
    setOverview(null);
    setSelected(null);
    setLastUpdated(null);
    setError(signOutError);
    setBusy(false);
  }

  const refreshData = useCallback(async (quiet = false) => {
    if (!client || refreshing.current) return;
    refreshing.current = true;
    try {
      const { data, error: sessionError } = await client.auth.getSession();
      if (sessionError) throw sessionError;
      if (!data.session) {
        setAdminEmail('');
        setOverview(null);
        setSelected(null);
        setLastUpdated(null);
        setError('Your admin session has expired. Sign in again to continue.');
        return;
      }
      await loadData(data.session.access_token, quiet);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not refresh store data.');
    } finally {
      refreshing.current = false;
    }
  }, [client, loadData]);

  useEffect(() => {
    if (!adminEmail || !client) return;
    const intervalId = window.setInterval(() => {
      void refreshData(true);
    }, 10_000);
    return () => window.clearInterval(intervalId);
  }, [adminEmail, client, refreshData]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  if (busy && !overview) {
    return <main className="login-screen"><div className="login-card"><Brand /><p className="eyebrow">PRIVATE STORE MONITOR</p><h1>Loading live store data</h1><p className="login-copy">Checking your admin session and connecting to the store database.</p></div></main>;
  }

  if (!adminEmail) {
    return <main className="login-screen"><form className="login-card" onSubmit={signIn}>
      <Brand /><p className="eyebrow">PRIVATE STORE MONITOR</p><h1>Log in as Admin</h1>
      <p className="login-copy">Sign in with an approved admin account to view live store data.</p>
      <label htmlFor="admin-email">Admin email</label><input id="admin-email" type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required />
      <label htmlFor="admin-password">Password</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required />
      {error && <p className="form-error">{error}</p>}
      <button className="button button-primary login-button" disabled={signingIn}>{signingIn ? 'Signing in…' : 'Log in as Admin'} <ArrowRight size={16} /></button>
      <p className="secure-note"><LockKeyhole size={14} /> Supabase Auth plus a server-side admin allowlist</p>
    </form></main>;
  }

  if (!overview) {
    return <main className="login-screen"><section className="login-card"><Brand /><p className="eyebrow">LIVE DATA UNAVAILABLE</p><h1>Could not load store data</h1><p className="login-copy">{error || 'Check the database connection and required environment variables.'}</p><button className="button button-primary login-button" onClick={() => void refreshData()} disabled={busy}>Retry connection <ArrowRight size={16} /></button><button className="button button-secondary login-button" onClick={() => void signOut()}>Sign out</button></section></main>;
  }

  const signIns = overview.signIns30d === null ? 'Not tracked' : overview.signIns30d.toLocaleString();
  const signInCaption = overview.signIns30d === null ? 'Sign-in event tracking is not configured' : 'Customer sign-in events · 30 days';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

  return <main className="admin-shell">
    <header className="topbar">
      <a className="brand-link" href="#home" aria-label="HalfCourt Shoe Store Admin"><Brand /><span>HALFCOURT <b>SHOE STORE ADMIN</b></span></a>
      <button className="menu-toggle" onClick={() => setMenuOpen(open => !open)} aria-label="Toggle navigation">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      <nav className={`top-navigation ${menuOpen ? 'menu-open' : ''}`} aria-label="Admin sections">
        {navigation.map(item => { const Icon = item.icon; return <button key={item.label} className={section === item.label ? 'nav-link nav-current' : 'nav-link'} onClick={() => { setSection(item.label); setMenuOpen(false); }}><Icon size={16} />{item.label}</button>; })}
      </nav>
      <div className="top-actions"><span className="mode-chip mode-live"><i />LIVE</span><button className="icon-button" aria-label="Notifications" onClick={() => notify('No new alerts')}><Bell size={18} /><i className="notification-dot" /></button><button className="profile-button" onClick={() => void signOut()}><span><b>Admin session</b><small>{adminEmail}</small></span><LogOut size={15} /></button></div>
    </header>

    <div className="main-layout" id="home">
      <section className="content-column">
        <div className="welcome-row"><div><p className="eyebrow">{today} <i className="pulse-dot" /></p><h1>{section === 'Dashboard' ? 'Store overview' : section}</h1><p className="welcome-copy">A clear view of your catalog, orders, and customer activity.</p></div><div className="welcome-actions"><a className="button button-secondary" href={storeUrl} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Open store</a><button className="button button-secondary" onClick={() => void refreshData()} disabled={busy}><RefreshCw size={15} className={busy ? 'spin' : ''} /> Refresh</button></div></div>
        {error && <div className="error-note"><ShieldCheck size={17} /><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss"><X size={15} /></button></div>}

        <section className="metrics" aria-label="Store metrics">
          <article className="metric metric-orders"><div className="metric-title"><span className="metric-icon icon-red"><ShoppingBag size={18} /></span><span className="period"><CalendarDays size={13} /> Last 30 days</span></div><p>Total orders</p><div className="metric-number"><strong>{overview.totalOrders.toLocaleString()}</strong>{overview.ordersDelta !== null && <span className={overview.ordersDelta >= 0 ? 'change positive' : 'change negative'}>{overview.ordersDelta >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{Math.abs(overview.ordersDelta)}%</span>}</div><div className="metric-foot"><small>{overview.totalOrders === 0 ? 'No orders recorded' : overview.ordersDelta === null ? 'No previous-period baseline' : 'vs. previous 30 days'}</small><button onClick={() => setSection('Orders')}>View orders <ArrowRight size={14} /></button></div></article>
          <article className="metric metric-signins"><div className="metric-title"><span className="metric-icon icon-lime"><Users size={18} /></span><span className="period"><CalendarDays size={13} /> Last 30 days</span></div><p>Total sign-ins</p><div className="metric-number"><strong className={overview.signIns30d === null ? 'unavailable' : ''}>{signIns}</strong><span className="metric-label-tag">CUSTOMER ACTIVITY</span></div><div className="metric-foot"><small>{signInCaption}</small><button onClick={() => setSection('Customers')}>View customers <ArrowRight size={14} /></button></div></article>
        </section>

        {(section === 'Dashboard' || section === 'Products') && <>
          <section className="inventory-section" id="products-section">
            <div className="section-head"><div><p className="eyebrow">CATALOG</p><h2>{section === 'Products' ? 'Products' : 'Inventory overview'} <span>{overview.products.length}</span></h2></div><span className="mode-chip">Read only</span></div>
            <div className="toolbar"><label className="search-box"><Search size={16} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name, model, colorway" aria-label="Search products" /><kbd>⌘ K</kbd></label><label className="filter-box"><SlidersHorizontal size={15} /><select value={model} onChange={event => setModel(event.target.value)} aria-label="Filter by model"><option>All models</option>{Array.from(new Set(overview.products.map(product => `AJ${product.model}`))).map(value => <option key={value}>{value}</option>)}</select><ChevronDown size={14} /></label><small className="result-count">{filtered.length} products · Auto-sync 10s{lastUpdated ? ` · Synced ${lastUpdated.toLocaleTimeString()}` : ''}</small></div>
            <div className="table-scroll"><table className="product-table"><thead><tr><th>PRODUCT</th><th>PRICE</th><th>STOCK LEFT</th><th>SOLD · 30 DAYS</th></tr></thead><tbody>{filtered.map(product => <tr key={product.id} className={selected?.id === product.id ? 'row-selected' : ''} onClick={() => setSelected(product)} tabIndex={0} onKeyDown={event => { if (event.key === 'Enter') setSelected(product); }}><td><div className="product-cell"><ProductImage product={product} compact /><span className="product-name"><b>{product.name}</b><small>{product.colorway} <i /> AJ{product.model}</small></span>{product.badge && <span className="badge">{product.badge}</span>}</div></td><td className="price-cell">{money(product.price)}</td><td><b>{product.stock}</b><small className="muted"> pairs left</small></td><td>{product.sold}</td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-results">No products match your search.</div>}</div>
            <div className="table-foot"><span>Showing {filtered.length} of {overview.products.length} products</span><div><button disabled aria-label="Previous page">←</button><button className="page-active">1</button><button onClick={() => notify('All available products are shown')} aria-label="Next page">→</button></div></div>
          </section>
          <section className="bottom-panels"><OrdersPanel orders={overview.recentOrders} onView={() => setSection('Orders')} /><SalesPanel amount={overview.revenue30d} /></section>
        </>}

        {section === 'Orders' && <OrdersView orders={overview.recentOrders} />}
        {section === 'Customers' && <CustomersView overview={overview} />}
        {section === 'Analytics' && <AnalyticsView overview={overview} />}
        {section === 'Settings' && <SettingsView overview={overview} />}
        <footer className="page-footer"><span>HALFCOURT SHOE STORE ADMIN</span><span>SECURE LIVE CONNECTION</span></footer>
      </section>

      {(section === 'Dashboard' || section === 'Products') && <aside className="inspector"><div className="inspector-head"><div><p className="eyebrow">QUICK VIEW</p><h2>Product details</h2></div></div>{selected ? <><ProductImage product={selected} /><div className="detail-title"><p className="eyebrow">AJ{selected.model} / {selected.id.toUpperCase()}</p><h3>{selected.name}</h3><span>{selected.colorway}</span></div><div className="detail-price"><span>Retail price</span><b>{money(selected.price)}</b></div><div className="detail-stats"><div><small>Available</small><b>{selected.stock} <i>pairs</i></b></div><div><small>Units sold · 30 days</small><b>{selected.sold}</b></div></div></> : <div className="empty-inspector">Select a product to inspect details.</div>}<div className="inspector-foot"><ShieldCheck size={14} /> Read-only live data</div></aside>}
    </div>

    {toast && <div className="toast" role="status"><Check size={15} />{toast}</div>}
    {busy && <div className="loading-strip" aria-label="Loading store data" />}
  </main>;
}

function Brand() { return <span className="brand-mark" aria-hidden="true">HC</span>; }

function ProductImage({ product, compact = false }: { product: Product; compact?: boolean }) {
  return <span className={`shoe-image ${compact ? 'shoe-compact' : 'shoe-feature'} model-${product.model}`}><span className="shoe-watermark">AJ{product.model}</span><img src={imageUrl(product)} alt={compact ? '' : `${product.name} ${product.colorway}`} onError={event => { event.currentTarget.style.display = 'none'; }} /><span className="shoe-shadow" />{!compact && <span className="shoe-caption">{product.colorway.toUpperCase()}</span>}</span>;
}

function OrdersPanel({ orders, onView }: { orders: AdminOverview['recentOrders']; onView: () => void }) {
  return <section className="surface-panel orders-panel"><div className="panel-heading"><div><p className="eyebrow">LATEST ACTIVITY</p><h2>Recent orders</h2></div><button className="text-action" onClick={onView}>View all <ArrowRight size={14} /></button></div>{orders.length === 0 ? <div className="empty-results">No orders yet.</div> : <div className="orders-list">{orders.slice(0, 4).map(order => <div className="order-row" key={order.orderNo}><span className="order-icon"><ShoppingBag size={15} /></span><span><b>{order.orderNo}</b><small>{order.customer} <i /> {order.placedAt}</small></span><strong>{money(order.total)}</strong><span className={`status status-${order.status.toLowerCase().replaceAll(' ', '-')}`}><i />{order.status}</span></div>)}</div>}</section>;
}

function SalesPanel({ amount }: { amount: number }) {
  return <section className="surface-panel sales-panel"><div className="panel-heading"><div><p className="eyebrow">PERFORMANCE · LAST 30 DAYS</p><h2>Store revenue</h2></div></div><div className="sales-number"><b>{money(amount)}</b></div><p className="data-footnote">Total of non-cancelled orders in the last 30 days. No trend chart is shown because daily sales history is not available.</p></section>;
}

function OrdersView({ orders }: { orders: AdminOverview['recentOrders'] }) {
  return <section className="surface-panel full-view"><div className="section-head"><div><p className="eyebrow">FULFILLMENT</p><h2>Latest orders</h2><p>Showing up to 6 most recent orders.</p></div></div>{orders.length === 0 ? <div className="empty-results">No orders yet.</div> : <div className="drawer-table"><div className="drawer-table-head"><span>ORDER</span><span>CUSTOMER</span><span>PLACED</span><span>TOTAL</span><span>STATUS</span></div>{orders.map(order => <div className="drawer-table-row" key={order.orderNo}><b>{order.orderNo}</b><span>{order.customer}</span><span>{order.placedAt}</span><span>{money(order.total)}</span><span className={`status status-${order.status.toLowerCase().replaceAll(' ', '-')}`}><i />{order.status}</span></div>)}</div>}</section>;
}

function CustomersView({ overview }: { overview: AdminOverview }) {
  return <section className="surface-panel full-view"><div className="section-head"><div><p className="eyebrow">CUSTOMER RELATIONSHIPS</p><h2>Customers <span>{overview.customers}</span></h2></div><span className="period">Top 5 by lifetime spend</span></div>{overview.topCustomers.length === 0 ? <div className="empty-results">No customer accounts yet.</div> : <div className="customer-list">{overview.topCustomers.map((customer, index) => <article className="customer-row" key={customer.email}><span className={`customer-avatar avatar-${index}`}>{customer.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><span className="customer-name"><b>{customer.name}</b><small>{customer.email}</small></span><span><b>{customer.orders}</b><small>lifetime orders</small></span><span><b>{money(customer.spent)}</b><small>lifetime spend</small></span></article>)}</div>}<p className="data-footnote">Customer information appears only when customer records exist in the store.</p></section>;
}

function AnalyticsView({ overview }: { overview: AdminOverview }) {
  return <section className="surface-panel full-view"><div className="section-head"><div><p className="eyebrow">STORE PERFORMANCE</p><h2>Analytics</h2></div><span className="period"><CalendarDays size={13} /> Last 30 days</span></div><div className="analytics-kpis"><div><small>Revenue</small><b>{money(overview.revenue30d)}</b><span>Non-cancelled order totals</span></div><div><small>Order volume</small><b>{overview.totalOrders}</b><span>Rolling 30 days</span></div><div><small>Customer sign-ins</small><b>{overview.signIns30d === null ? 'Not tracked' : overview.signIns30d}</b><span>{overview.signIns30d === null ? 'Sign-in event tracking is not configured' : 'Rolling 30 days'}</span></div></div><div className="analytics-graph"><div className="empty-results">Daily sales history is not available from the current database query.</div></div></section>;
}

function SettingsView({ overview }: { overview: AdminOverview }) {
  return <section className="surface-panel full-view settings-view"><div className="section-head"><div><p className="eyebrow">CONFIGURATION</p><h2>Settings</h2></div></div><article><span className="setting-icon"><Activity size={17} /></span><span><b>Data source</b><small>Protected PostgreSQL connection</small></span><span className="mode-chip mode-live"><i />LIVE</span></article><article><span className="setting-icon"><ShieldCheck size={17} /></span><span><b>Admin access</b><small>Access is limited to configured admin emails.</small></span><strong>Restricted</strong></article><article><span className="setting-icon"><Users size={17} /></span><span><b>Sign-in monitoring</b><small>{overview.signIns30d === null ? 'Customer sign-in tracking is not configured.' : 'Customer sign-in events are recorded.'}</small></span><strong>{overview.signIns30d === null ? 'Not tracked' : 'Enabled'}</strong></article><article><span className="setting-icon"><ExternalLink size={17} /></span><span><b>Storefront</b><small>{storeUrl}</small></span><a href={storeUrl} target="_blank" rel="noreferrer">Open <ArrowRight size={14} /></a></article></section>;
}
