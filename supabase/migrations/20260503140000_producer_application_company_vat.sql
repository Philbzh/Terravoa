-- Legal entity / invoicing fields for producer applications (EU VAT & registration).

alter table public.producer_applications
  add column if not exists company_registration_country text,
  add column if not exists vat_id text;

comment on column public.producer_applications.company_registration_country is
  'Country where the applicant''s legal entity is registered (trade/commercial register jurisdiction).';

comment on column public.producer_applications.vat_id is
  'VAT / EU VAT ID / national tax identification number used for B2B invoicing (format varies).';
