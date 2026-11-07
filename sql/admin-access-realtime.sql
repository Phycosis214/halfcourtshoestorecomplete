-- Run after supabase-schema.sql in the Supabase SQL Editor.
-- Admin access is granted only to the two Supabase Auth user IDs explicitly
-- inserted into store_admins. Customer accounts are not admin accounts.

CREATE TABLE IF NOT EXISTS public.store_admins (
  slot SMALLINT PRIMARY KEY CHECK (slot IN (1, 2)),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.store_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.store_admins FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_store_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.store_admins AS admin
    WHERE admin.user_id = (SELECT auth.uid())
  )
$function$;

REVOKE ALL ON FUNCTION public.is_store_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_store_admin() TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.products, public.product_sizes, public.shipping_methods,
  public.orders, public.order_addresses, public.order_items, public.customers
FROM anon, authenticated;

GRANT SELECT ON public.products, public.product_sizes, public.shipping_methods,
  public.orders, public.order_addresses, public.order_items TO authenticated;
GRANT SELECT (id, full_name, email, created_at)
  ON public.customers TO authenticated;

CREATE OR REPLACE VIEW public.store_admin_customers
WITH (security_invoker = true)
AS
SELECT id, full_name, email, created_at
FROM public.customers;

GRANT SELECT ON public.store_admin_customers TO authenticated;

DROP POLICY IF EXISTS store_admin_read_products ON public.products;
CREATE POLICY store_admin_read_products ON public.products
  FOR SELECT TO authenticated
  USING ((SELECT public.is_store_admin()));

DROP POLICY IF EXISTS store_admin_read_product_sizes ON public.product_sizes;
CREATE POLICY store_admin_read_product_sizes ON public.product_sizes
  FOR SELECT TO authenticated
  USING ((SELECT public.is_store_admin()));

DROP POLICY IF EXISTS store_admin_read_shipping_methods ON public.shipping_methods;
CREATE POLICY store_admin_read_shipping_methods ON public.shipping_methods
  FOR SELECT TO authenticated
  USING ((SELECT public.is_store_admin()));

DROP POLICY IF EXISTS store_admin_read_orders ON public.orders;
CREATE POLICY store_admin_read_orders ON public.orders
  FOR SELECT TO authenticated
  USING ((SELECT public.is_store_admin()));

DROP POLICY IF EXISTS store_admin_read_order_addresses ON public.order_addresses;
CREATE POLICY store_admin_read_order_addresses ON public.order_addresses
  FOR SELECT TO authenticated
  USING ((SELECT public.is_store_admin()));

DROP POLICY IF EXISTS store_admin_read_order_items ON public.order_items;
CREATE POLICY store_admin_read_order_items ON public.order_items
  FOR SELECT TO authenticated
  USING ((SELECT public.is_store_admin()));

DROP POLICY IF EXISTS store_admin_read_customers ON public.customers;
CREATE POLICY store_admin_read_customers ON public.customers
  FOR SELECT TO authenticated
  USING ((SELECT public.is_store_admin()));

ALTER TABLE public.products REPLICA IDENTITY DEFAULT;

DO $publication$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (
       SELECT 1
       FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime'
         AND schemaname = 'public'
         AND tablename = 'products'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
END
$publication$;

-- After creating the two admin users in Supabase Authentication, add their
-- UUIDs from Authentication > Users. The slot constraint allows at most two.
-- Replace both placeholders before running:
-- INSERT INTO public.store_admins (slot, user_id)
-- VALUES (1, '<first-admin-auth-user-uuid>'),
--        (2, '<second-admin-auth-user-uuid>');
