-- Branda Finance core schema draft.
-- Additive only. Review in staging before applying to any shared database.
-- This draft assumes public.has_cafe_permission(cafe_id, 'branda_finance') is valid for finance staff.

CREATE TABLE IF NOT EXISTS public.finance_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  customer_profile_id uuid REFERENCES public.customer_profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  country text NOT NULL DEFAULT 'SA',
  vat_number text,
  email text,
  phone text,
  city text,
  address text,
  payment_terms text,
  currency text NOT NULL DEFAULT 'SAR',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.finance_suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  name text NOT NULL,
  country text NOT NULL DEFAULT 'SA',
  vat_number text,
  email text,
  phone text,
  city text,
  address text,
  payment_terms text,
  currency text NOT NULL DEFAULT 'SAR',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.finance_warehouses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES public.branches(id) ON DELETE SET NULL,
  name text NOT NULL,
  code text,
  city text,
  address text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.finance_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  parent_account_id uuid REFERENCES public.finance_accounts(id) ON DELETE SET NULL,
  code text NOT NULL,
  name text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  normal_balance text NOT NULL CHECK (normal_balance IN ('debit', 'credit')),
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.finance_invoice_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES public.branches(id) ON DELETE SET NULL,
  fiscal_year integer NOT NULL,
  prefix text NOT NULL DEFAULT 'INV',
  next_number integer NOT NULL DEFAULT 1 CHECK (next_number > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.finance_sales_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES public.branches(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES public.finance_customers(id) ON DELETE SET NULL,
  customer_profile_id uuid REFERENCES public.customer_profiles(id) ON DELETE SET NULL,
  invoice_number text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'void', 'paid', 'partially_paid', 'unpaid')),
  issue_date date NOT NULL DEFAULT current_date,
  due_date date,
  currency text NOT NULL DEFAULT 'SAR',
  subtotal numeric(14, 2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  discount_total numeric(14, 2) NOT NULL DEFAULT 0 CHECK (discount_total >= 0),
  tax_total numeric(14, 2) NOT NULL DEFAULT 0 CHECK (tax_total >= 0),
  total numeric(14, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  amount_paid numeric(14, 2) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
  amount_due numeric(14, 2) NOT NULL DEFAULT 0 CHECK (amount_due >= 0),
  notes text,
  source text NOT NULL DEFAULT 'branda_finance' CHECK (source IN ('branda_finance', 'cashier', 'import')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.finance_sales_invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  invoice_id uuid NOT NULL REFERENCES public.finance_sales_invoices(id) ON DELETE CASCADE,
  menu_product_id uuid REFERENCES public.menu_products(id) ON DELETE SET NULL,
  warehouse_id uuid REFERENCES public.finance_warehouses(id) ON DELETE SET NULL,
  account_id uuid REFERENCES public.finance_accounts(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  description text,
  quantity numeric(14, 3) NOT NULL CHECK (quantity > 0),
  unit_price numeric(14, 2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  discount_total numeric(14, 2) NOT NULL DEFAULT 0 CHECK (discount_total >= 0),
  tax_rate numeric(6, 3) NOT NULL DEFAULT 15 CHECK (tax_rate >= 0),
  tax_total numeric(14, 2) NOT NULL DEFAULT 0 CHECK (tax_total >= 0),
  line_total numeric(14, 2) NOT NULL DEFAULT 0 CHECK (line_total >= 0),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.finance_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES public.branches(id) ON DELETE SET NULL,
  invoice_id uuid REFERENCES public.finance_sales_invoices(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES public.finance_customers(id) ON DELETE SET NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'card', 'transfer', 'credit', 'other')),
  amount numeric(14, 2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'SAR',
  status text NOT NULL DEFAULT 'recorded' CHECK (status IN ('recorded', 'void', 'refunded')),
  paid_at timestamptz NOT NULL DEFAULT now(),
  reference text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.finance_cash_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES public.branches(id) ON DELETE SET NULL,
  cashier_id uuid REFERENCES public.cafe_cashiers(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'reconciled')),
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  opening_cash numeric(14, 2) NOT NULL DEFAULT 0 CHECK (opening_cash >= 0),
  closing_cash numeric(14, 2) CHECK (closing_cash IS NULL OR closing_cash >= 0),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.finance_journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES public.branches(id) ON DELETE SET NULL,
  source_type text NOT NULL DEFAULT 'manual' CHECK (source_type IN ('manual', 'sales_invoice', 'payment', 'cash_session')),
  source_id uuid,
  entry_date date NOT NULL DEFAULT current_date,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'posted', 'void')),
  memo text,
  total_debit numeric(14, 2) NOT NULL DEFAULT 0 CHECK (total_debit >= 0),
  total_credit numeric(14, 2) NOT NULL DEFAULT 0 CHECK (total_credit >= 0),
  posted_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.finance_journal_entry_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  journal_entry_id uuid NOT NULL REFERENCES public.finance_journal_entries(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES public.finance_accounts(id) ON DELETE RESTRICT,
  description text,
  debit numeric(14, 2) NOT NULL DEFAULT 0 CHECK (debit >= 0),
  credit numeric(14, 2) NOT NULL DEFAULT 0 CHECK (credit >= 0),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CHECK ((debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0))
);

CREATE TABLE IF NOT EXISTS public.finance_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_table text NOT NULL,
  entity_id uuid,
  action text NOT NULL CHECK (action IN ('create', 'update', 'approve', 'void', 'post', 'reconcile')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS finance_accounts_cafe_code_idx
  ON public.finance_accounts(cafe_id, code);
CREATE UNIQUE INDEX IF NOT EXISTS finance_invoice_sequences_scope_idx
  ON public.finance_invoice_sequences(cafe_id, COALESCE(branch_id, '00000000-0000-0000-0000-000000000000'::uuid), fiscal_year);
CREATE UNIQUE INDEX IF NOT EXISTS finance_sales_invoices_cafe_number_idx
  ON public.finance_sales_invoices(cafe_id, invoice_number)
  WHERE invoice_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS finance_customers_cafe_idx ON public.finance_customers(cafe_id);
CREATE INDEX IF NOT EXISTS finance_customers_profile_idx ON public.finance_customers(customer_profile_id);
CREATE INDEX IF NOT EXISTS finance_customers_created_at_idx ON public.finance_customers(created_at);
CREATE INDEX IF NOT EXISTS finance_suppliers_cafe_idx ON public.finance_suppliers(cafe_id);
CREATE INDEX IF NOT EXISTS finance_suppliers_created_at_idx ON public.finance_suppliers(created_at);
CREATE INDEX IF NOT EXISTS finance_warehouses_cafe_idx ON public.finance_warehouses(cafe_id);
CREATE INDEX IF NOT EXISTS finance_warehouses_branch_idx ON public.finance_warehouses(branch_id);
CREATE INDEX IF NOT EXISTS finance_warehouses_created_at_idx ON public.finance_warehouses(created_at);
CREATE INDEX IF NOT EXISTS finance_sales_invoices_cafe_idx ON public.finance_sales_invoices(cafe_id);
CREATE INDEX IF NOT EXISTS finance_sales_invoices_branch_idx ON public.finance_sales_invoices(branch_id);
CREATE INDEX IF NOT EXISTS finance_sales_invoices_customer_idx ON public.finance_sales_invoices(customer_id);
CREATE INDEX IF NOT EXISTS finance_sales_invoices_customer_profile_idx ON public.finance_sales_invoices(customer_profile_id);
CREATE INDEX IF NOT EXISTS finance_sales_invoices_created_at_idx ON public.finance_sales_invoices(created_at);
CREATE INDEX IF NOT EXISTS finance_sales_invoice_items_cafe_idx ON public.finance_sales_invoice_items(cafe_id);
CREATE INDEX IF NOT EXISTS finance_sales_invoice_items_invoice_idx ON public.finance_sales_invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS finance_sales_invoice_items_product_idx ON public.finance_sales_invoice_items(menu_product_id);
CREATE INDEX IF NOT EXISTS finance_sales_invoice_items_created_at_idx ON public.finance_sales_invoice_items(created_at);
CREATE INDEX IF NOT EXISTS finance_payments_cafe_idx ON public.finance_payments(cafe_id);
CREATE INDEX IF NOT EXISTS finance_payments_branch_idx ON public.finance_payments(branch_id);
CREATE INDEX IF NOT EXISTS finance_payments_invoice_idx ON public.finance_payments(invoice_id);
CREATE INDEX IF NOT EXISTS finance_payments_customer_idx ON public.finance_payments(customer_id);
CREATE INDEX IF NOT EXISTS finance_payments_created_at_idx ON public.finance_payments(created_at);
CREATE INDEX IF NOT EXISTS finance_cash_sessions_cafe_idx ON public.finance_cash_sessions(cafe_id);
CREATE INDEX IF NOT EXISTS finance_cash_sessions_branch_idx ON public.finance_cash_sessions(branch_id);
CREATE INDEX IF NOT EXISTS finance_cash_sessions_created_at_idx ON public.finance_cash_sessions(created_at);
CREATE INDEX IF NOT EXISTS finance_invoice_sequences_cafe_idx ON public.finance_invoice_sequences(cafe_id);
CREATE INDEX IF NOT EXISTS finance_invoice_sequences_branch_idx ON public.finance_invoice_sequences(branch_id);
CREATE INDEX IF NOT EXISTS finance_accounts_cafe_idx ON public.finance_accounts(cafe_id);
CREATE INDEX IF NOT EXISTS finance_accounts_parent_idx ON public.finance_accounts(parent_account_id);
CREATE INDEX IF NOT EXISTS finance_accounts_created_at_idx ON public.finance_accounts(created_at);
CREATE INDEX IF NOT EXISTS finance_journal_entries_cafe_idx ON public.finance_journal_entries(cafe_id);
CREATE INDEX IF NOT EXISTS finance_journal_entries_branch_idx ON public.finance_journal_entries(branch_id);
CREATE INDEX IF NOT EXISTS finance_journal_entries_created_at_idx ON public.finance_journal_entries(created_at);
CREATE INDEX IF NOT EXISTS finance_journal_entry_lines_cafe_idx ON public.finance_journal_entry_lines(cafe_id);
CREATE INDEX IF NOT EXISTS finance_journal_entry_lines_entry_idx ON public.finance_journal_entry_lines(journal_entry_id);
CREATE INDEX IF NOT EXISTS finance_journal_entry_lines_account_idx ON public.finance_journal_entry_lines(account_id);
CREATE INDEX IF NOT EXISTS finance_journal_entry_lines_created_at_idx ON public.finance_journal_entry_lines(created_at);
CREATE INDEX IF NOT EXISTS finance_audit_events_cafe_idx ON public.finance_audit_events(cafe_id);
CREATE INDEX IF NOT EXISTS finance_audit_events_entity_idx ON public.finance_audit_events(entity_table, entity_id);
CREATE INDEX IF NOT EXISTS finance_audit_events_created_at_idx ON public.finance_audit_events(created_at);

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'finance_customers',
    'finance_suppliers',
    'finance_warehouses',
    'finance_sales_invoices',
    'finance_sales_invoice_items',
    'finance_payments',
    'finance_cash_sessions',
    'finance_invoice_sequences'
  ]
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', table_name);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO service_role', table_name);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_service_role_all', table_name);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true)', table_name || '_service_role_all', table_name);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_platform_admin_all', table_name);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin())', table_name || '_platform_admin_all', table_name);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_staff_read', table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.is_cafe_owner(cafe_id) OR public.has_cafe_permission(cafe_id, %L) OR public.has_cafe_permission(cafe_id, %L) OR public.has_cafe_permission(cafe_id, %L))',
      table_name || '_staff_read',
      table_name,
      'branda_finance',
      'reports',
      'cashier'
    );

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_staff_write', table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_cafe_owner(cafe_id) OR public.has_cafe_permission(cafe_id, %L) OR public.has_cafe_permission(cafe_id, %L)) WITH CHECK (public.is_cafe_owner(cafe_id) OR public.has_cafe_permission(cafe_id, %L) OR public.has_cafe_permission(cafe_id, %L))',
      table_name || '_staff_write',
      table_name,
      'branda_finance',
      'cashier',
      'branda_finance',
      'cashier'
    );

    EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.%I', 'set_' || table_name || '_updated_at', table_name);
    EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', 'set_' || table_name || '_updated_at', table_name);
  END LOOP;

  FOREACH table_name IN ARRAY ARRAY[
    'finance_accounts',
    'finance_journal_entries',
    'finance_journal_entry_lines',
    'finance_audit_events'
  ]
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', table_name);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO service_role', table_name);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_service_role_all', table_name);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true)', table_name || '_service_role_all', table_name);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_platform_admin_all', table_name);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin())', table_name || '_platform_admin_all', table_name);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_staff_read', table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.is_cafe_owner(cafe_id) OR public.has_cafe_permission(cafe_id, %L) OR public.has_cafe_permission(cafe_id, %L))',
      table_name || '_staff_read',
      table_name,
      'branda_finance',
      'reports'
    );

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_staff_write', table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_cafe_owner(cafe_id) OR public.has_cafe_permission(cafe_id, %L)) WITH CHECK (public.is_cafe_owner(cafe_id) OR public.has_cafe_permission(cafe_id, %L))',
      table_name || '_staff_write',
      table_name,
      'branda_finance',
      'branda_finance'
    );

    EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.%I', 'set_' || table_name || '_updated_at', table_name);
    EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', 'set_' || table_name || '_updated_at', table_name);
  END LOOP;
END $$;
