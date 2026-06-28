# Branda Finance Database Integration Audit

Date: 2026-06-28
Scope: DEMO workspace only. No Supabase CLI, no SQL execution, no migrations, no package changes.

## Current Safe Integration State

Branda Finance can safely read these real owner-scoped sources today:

- `getOwnerMenu()` from `lib/data/menu.ts`
  - Reads `menu_categories` and `menu_products`.
  - Safe UI fields: product name, category, description, price, availability, image, product id, derived SKU/barcode display.
- `getOwnerBranches()` from `lib/data/branches.ts`
  - Reads `branches`.
  - Safe UI fields: branch id, name, city, address, phone.
- `getCafeCustomers()` from `lib/data/customers.ts`
  - Reads `customer_profiles`.
  - Safe UI fields: customer id, name, email, phone.
- `getOwnerFeatureCodes()` from `lib/data/feature-entitlements.ts`
  - Reads the active subscription and plan features.
  - Safe use: dashboard/package gates for Branda Finance and loyalty.
- `getPublicCafeFeatureCodesBySlug()` and `filterPublicCafePayloadByFeatures()`
  - Safe use: public feature gating, especially loyalty payload removal.
- `getLoyaltyCardViewByCode()` and `getCurrentCustomerLoyaltyCardView()`
  - Safe use: real loyalty card display only after feature access and actual card lookup.
- `fetchCustomerAccountSnapshotAction()`
  - Safe use: customer-scoped orders, reservations, loyalty, and experience rewards after session validation and feature checks.

## Existing Tables And Helpers Found

Observed from migrations and helper usage:

- `menu_products`
- `menu_categories`
- `branches`
- `customer_profiles`
- `loyalty_cards`
- `loyalty_card_programs`
- `loyalty_card_events`
- legacy loyalty areas such as `loyalty_accounts`, `loyalty_transactions`, `loyalty_rules`, and `loyalty_rewards`
- `subscriptions`
- `platform_plans`
- `platform_discount_coupons`
- `subscription_payment_events`

The migration named like `034_*finance_tables_platform_coupons_plan_limits_exports.sql` is platform subscription finance support. It adds subscription invoice metadata and admin coupon/payment support. It is not an operational Branda Finance sales invoice ledger.

## Fields Connected Safely Now

- Create invoice page:
  - Products/categories: real `menu_products` and `menu_categories` through `getOwnerMenu()`.
  - Branches: real `branches` through `getOwnerBranches()`.
  - Customers: real `customer_profiles` through `getCafeCustomers()`.
  - Payment method selection: local UI only, no settlement or ledger write.
  - Save/approve: disabled because invoice persistence is missing.
- Sales/cashier page:
  - Product grid: real menu products only.
  - Branch/customer selectors: real helpers only.
  - Warehouse display: empty/missing state because no operational warehouse helper exists.
  - Loyalty scan: rendered only when owner feature access includes `loyalty`.
  - Create invoice: disabled because invoice persistence is missing.

## Fields Still Preview Or Local State

- Invoice number `INV-000101`.
- Draft status and local status messages.
- Invoice item edits, discounts, dates, attachments, custom fields, and preview modal.
- Local add-customer/add-branch/add-custom-field modal entries.
- Payment method and amount paid.
- Cashier cart, quantity, notes, and invoice summary.
- Branda Finance reports, statements, accountant pages, hall orders, purchases, cost centers, and finance loyalty-points module.

These areas must not be treated as persisted records until operational finance tables and server actions exist.

## Missing Operational Tables

- Real sales invoices:
  - `finance_sales_invoices`
  - Suggested columns: `id`, `cafe_id`, `branch_id`, `customer_id`, `invoice_number`, `status`, `issue_date`, `due_date`, `currency`, subtotal/tax/discount/total/paid/remaining snapshots, payment status, created/updated metadata.
- Real invoice items:
  - `finance_sales_invoice_items`
  - Suggested columns: `id`, `invoice_id`, `cafe_id`, `product_id`, item snapshot name/SKU/barcode, quantity, unit price, discount, tax rate, subtotal, tax, total.
- Customers/suppliers:
  - Existing customer profiles can be read, but finance-specific customer tax/address terms need either safe extension fields or a separate finance customer profile table.
  - `finance_suppliers` is missing.
- Warehouses:
  - `finance_warehouses` is missing.
  - `finance_inventory_movements` is missing.
- Purchases:
  - `finance_purchase_invoices` is missing.
  - `finance_purchase_invoice_items` is missing.
- Accounting:
  - `finance_accounts` is missing.
  - `finance_journal_entries` is missing.
  - `finance_journal_entry_lines` is missing.
  - `finance_payments` is missing.
  - `finance_cash_sessions` is missing.
  - `finance_invoice_sequences` is missing.
  - `finance_audit_events` is missing.

## Required RLS Considerations

- Every operational finance table should include `cafe_id`.
- Owners and permitted staff should only read/write rows for their own `cafe_id`.
- Inserts and updates must verify that referenced branch, customer, product, warehouse, supplier, and account rows belong to the same `cafe_id`.
- Customer-facing reads should not expose finance invoices unless a separate customer invoice portal is explicitly designed.
- Service-role helpers should be small, audited, and server-only.
- Invoice totals, tax totals, and payment balances must be validated server-side.
- Journal posting should happen transactionally with invoice/payment writes.
- Audit events should be append-only.

## Required Indexes

Recommended future indexes, not created in this phase:

- Sales invoices: `cafe_id`, `branch_id`, `customer_id`, `status`, `issue_date`, `invoice_number`, and a unique brand/branch/year invoice sequence key.
- Sales invoice items: `invoice_id`, `cafe_id`, `product_id`.
- Suppliers: `cafe_id`, `vat_number`, `name`.
- Warehouses: `cafe_id`, `branch_id`.
- Inventory movements: `cafe_id`, `product_id`, `warehouse_id`, `created_at`.
- Accounts: `cafe_id`, `code`, `parent_id`.
- Journal entries: `cafe_id`, `entry_date`, `source_type`, `source_id`.
- Journal entry lines: `entry_id`, `account_id`, `cafe_id`.
- Payments: `cafe_id`, `invoice_id`, `payment_method`, `created_at`.
- Cash sessions: `cafe_id`, `branch_id`, `cashier_id`, `opened_at`, `closed_at`.

## Required Foreign Keys

Recommended future references, not created in this phase:

- `finance_sales_invoices.cafe_id` to cafes/brands table used by existing helpers.
- `finance_sales_invoices.branch_id` to `branches.id`.
- `finance_sales_invoices.customer_id` to `customer_profiles.id` or a future finance customer profile table.
- `finance_sales_invoice_items.invoice_id` to `finance_sales_invoices.id`.
- `finance_sales_invoice_items.product_id` to `menu_products.id`.
- `finance_purchase_invoices.supplier_id` to `finance_suppliers.id`.
- `finance_inventory_movements.product_id` to `menu_products.id`.
- `finance_inventory_movements.warehouse_id` to `finance_warehouses.id`.
- `finance_journal_entry_lines.entry_id` to `finance_journal_entries.id`.
- `finance_journal_entry_lines.account_id` to `finance_accounts.id`.
- `finance_payments.invoice_id` to `finance_sales_invoices.id`.

## Recommended Additive Migration Plan

Future phase only. Do not create migration files yet.

1. Add read/write tables for sales invoices and items with strict RLS.
2. Add server actions/helpers for invoice draft creation, approval, and read lists.
3. Add finance customer tax/address profile support without mutating customer auth/session semantics.
4. Add suppliers, purchase invoices, warehouses, and inventory movements.
5. Add chart of accounts and journal entries after invoice persistence is stable.
6. Add payments, cash sessions, and settlement flows.
7. Add ZATCA/tax QR support after persisted invoice snapshots exist.

## Risks If Connected Too Early

- Browser-local totals could become trusted financial records.
- Invoice numbers could collide without server-side sequences.
- Cross-brand data exposure could occur without `cafe_id` checks and RLS.
- Product/customer/branch rows could be mixed across brands.
- Loyalty points could be awarded from non-persisted sales.
- Reports could show demo figures next to real operational figures.
- Accounting ledgers could become unbalanced if journal entries are not transactional.
- Tax reports could be misleading before persisted tax snapshots and invoice approvals exist.

## UI Changes In This Phase

- Branda Finance home uses real available counts instead of fake sales/purchase/cash/bank figures.
- Create invoice reads real products, branches, and customers.
- Cashier sales reads real products, branches, and customers.
- Invoice save/approve/create actions are disabled with a clear message until database tables exist.
- Loyalty points in cashier are visible only when the loyalty feature is enabled for the package.
- Public/customer loyalty pages no longer use demo card codes or demo point balances where a customer could mistake them for real data.
- Public rewards navigation now depends on `loyalty`, not `experience_reviews`.

## Remaining Mock/Demo Islands

Some Branda Finance modules still use local demo data as non-persistent previews because no matching database tables exist yet:

- reports
- statements
- accountant modules
- hall orders
- purchases
- cost centers
- loyalty-points finance module

These should remain clearly treated as preview-only until the operational finance schema exists. They should not be wired to real persistence without the tables listed above.

## Exact Next Safe Phase

Create a reviewed additive migration plan for only sales invoices and sales invoice items, plus RLS, indexes, foreign keys, and server actions. After review, implement read/write helpers behind the existing Branda Finance package gate, then enable create/approve buttons only when those helpers pass tests against the new schema.
