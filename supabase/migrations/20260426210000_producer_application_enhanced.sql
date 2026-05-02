-- ═══════════════════════════════════════════════════════════════
-- Enhanced producer application questionnaire
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════
--
-- Adds columns required by the new 5-step application form:
--   Step 3 — Quality & Craft (certifications, organic, scale)
--   Step 5 — Shipping (no_alcohol_confirmed)
-- ═══════════════════════════════════════════════════════════════

alter table producer_applications
  -- Quality & certifications
  add column if not exists is_organic            text,          -- 'yes_certified' | 'partially' | 'no_natural' | 'none'
  add column if not exists organic_certifier     text,          -- e.g. Ecocert, CCPB
  add column if not exists certifications        text[] default '{}',   -- DOP, IGP, etc.
  add column if not exists certification_body    text,          -- e.g. INAO, ICQRF
  add column if not exists production_scale      text,          -- artisanal | traditional | small_business
  add column if not exists annual_production     text,          -- free text volume
  add column if not exists shelf_life            text,          -- e.g. "12–24 months"
  add column if not exists packaging_ready       text,          -- 'yes' | 'no' | 'partially'
  add column if not exists pricing_range         text,          -- e.g. "€5–€15 per jar"
  -- Explicit no-alcohol declaration
  add column if not exists no_alcohol_confirmed  boolean;

comment on column producer_applications.is_organic          is 'Organic status: yes_certified | partially | no_natural | none';
comment on column producer_applications.certifications      is 'Official quality labels: DOP, IGP, STG, Label Rouge, etc.';
comment on column producer_applications.production_scale    is 'Scale: fully_artisanal | traditional | small_business | undisclosed';
comment on column producer_applications.packaging_ready     is 'Packaging readiness: yes | no | partially';
comment on column producer_applications.no_alcohol_confirmed is 'Applicant confirmed no alcohol-based products in this application';
