import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import type { AdminOverview } from '@/lib/types';

export const dynamic = 'force-dynamic';

const globalForPg = globalThis as typeof globalThis & { halfcourtAdminPool?: Pool };
const pool = globalForPg.halfcourtAdminPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 5_000,
});
if (process.env.NODE_ENV !== 'production') globalForPg.halfcourtAdminPool = pool;

export async function GET(request: Request) {
  const databaseUrl = process.env.DATABASE_URL;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const allowedEmails = [...new Set((process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean))];

  if (!databaseUrl || !supabaseUrl || !supabaseAnonKey || allowedEmails.length !== 2) {
    return Response.json({ error: 'Configure DATABASE_URL, Supabase Auth settings, and exactly two different admin emails.' }, { status: 503 });
  }

  const bearer = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!bearer) return Response.json({ error: 'Sign in with an approved admin account.' }, { status: 401 });

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: authData, error: authError } = await supabase.auth.getUser(bearer);
  const email = authData.user?.email?.toLowerCase();
  if (authError || !email || !allowedEmails.includes(email)) {
    return Response.json({ error: 'This account is not authorized for HalfCourt Admin.' }, { status: 403 });
  }

  try {
    const [productRows, orderMetrics, customers, recentOrders, topCustomers, signInMetrics] = await Promise.all([
      pool.query(`
        SELECT p.id, p.model, p.name, p.colorway, p.price::float8 AS price,
               p.stock, p.badge, p.image_url AS "imageUrl",
               COALESCE(s.sold, 0)::int AS sold
        FROM products p
        LEFT JOIN (
          SELECT oi.product_id, SUM(oi.qty)::int AS sold
          FROM order_items oi
          JOIN orders o ON o.id = oi.order_id
          WHERE o.status <> 'Cancelled'
            AND o.placed_at >= NOW() - INTERVAL '30 days'
          GROUP BY oi.product_id
        ) s ON s.product_id = p.id
        WHERE p.is_active = TRUE
        ORDER BY p.created_at DESC, p.id
        LIMIT 100
      `),
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE placed_at >= NOW() - INTERVAL '30 days')::int AS current_orders,
          COUNT(*) FILTER (WHERE placed_at >= NOW() - INTERVAL '60 days' AND placed_at < NOW() - INTERVAL '30 days')::int AS previous_orders,
          COALESCE(SUM(total) FILTER (WHERE placed_at >= NOW() - INTERVAL '30 days' AND status <> 'Cancelled'), 0)::float8 AS revenue_30d
        FROM orders
      `),
      pool.query('SELECT COUNT(*)::int AS count FROM customers'),
      pool.query(`
        SELECT o.order_no AS "orderNo", COALESCE(a.full_name, 'Guest checkout') AS customer,
               o.placed_at AS "placedAt", o.total::float8 AS total, o.status
        FROM orders o
        LEFT JOIN order_addresses a ON a.order_id = o.id
        ORDER BY o.placed_at DESC
        LIMIT 6
      `),
      pool.query(`
        SELECT c.full_name AS name, c.email, COUNT(o.id)::int AS orders,
               COALESCE(SUM(o.total), 0)::float8 AS spent
        FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id AND o.status <> 'Cancelled'
        GROUP BY c.id
        ORDER BY spent DESC, c.created_at DESC
        LIMIT 5
      `),
      pool.query(`
        SELECT COUNT(*)::int AS count, MIN(signed_in_at) AS tracked_since
        FROM customer_sign_in_events
        WHERE signed_in_at >= NOW() - INTERVAL '30 days'
      `).catch((error: unknown) => {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === '42P01') {
          return null;
        }
        throw error;
      }),
    ]);

    const metrics = orderMetrics.rows[0];
    const currentOrders = Number(metrics.current_orders);
    const previousOrders = Number(metrics.previous_orders);
    const delta = previousOrders === 0
      ? null
      : Math.round(((currentOrders - previousOrders) / previousOrders) * 1000) / 10;
    const signIns = signInMetrics?.rows[0];

    const result: AdminOverview = {
      mode: 'live',
      generatedAt: new Date().toISOString(),
      totalOrders: currentOrders,
      ordersDelta: delta,
      signIns30d: signIns ? Number(signIns.count) : null,
      signInsTrackedSince: signIns?.tracked_since ? new Date(signIns.tracked_since).toISOString() : null,
      customers: Number(customers.rows[0].count),
      revenue30d: Number(metrics.revenue_30d),
      products: productRows.rows,
      recentOrders: recentOrders.rows.map(row => ({
        ...row,
        placedAt: new Date(row.placedAt).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' }),
        total: Number(row.total),
      })),
      topCustomers: topCustomers.rows.map(row => ({
        ...row,
        orders: Number(row.orders),
        spent: Number(row.spent),
      })),
    };

    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Admin overview query failed', error);
    return Response.json({ error: 'Could not load live store data.' }, { status: 500 });
  }
}
