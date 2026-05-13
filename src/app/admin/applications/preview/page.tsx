/**
 * /admin/applications/preview
 *
 * Renders a complete read-only overview of every question in the producer
 * application form — grouped by step. Lets you see exactly what applicants
 * see without having to register as a producer.
 */
import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Eye, AlertTriangle } from 'lucide-react'

export const metadata = { title: 'Application form preview — Admin' }

// ── Data model: one entry per form step ──────────────────────────────────────

type FieldType =
  | 'text' | 'email' | 'tel' | 'url'
  | 'textarea' | 'radio' | 'checkbox-group'
  | 'file-upload' | 'notice'

interface Field {
  name: string
  label: string
  type: FieldType
  required?: boolean
  hint?: string
  placeholder?: string
  options?: string[]
}

interface Step {
  number: number
  title: string
  subtitle?: string
  sections: { heading?: string; fields: Field[] }[]
}

const STEPS: Step[] = [
  {
    number: 1,
    title: 'About You',
    sections: [
      {
        heading: 'Personal / business details',
        fields: [
          { name: 'full_name',      label: 'Full Name',                type: 'text',  required: true,  placeholder: 'Your full name' },
          { name: 'business_name',  label: 'Business Name',            type: 'text',  required: true,  placeholder: 'Legal or trading name for invoicing' },
          { name: 'company_registration_country', label: 'Country of company registration', type: 'text', required: true, placeholder: 'e.g. Germany, France', hint: 'Where your legal entity is registered' },
          { name: 'vat_id',         label: 'VAT / tax identification number', type: 'text', required: true, placeholder: 'e.g. DE123456789' },
          { name: 'email',          label: 'Email Address',            type: 'email', required: true,  placeholder: 'you@example.com' },
          { name: 'phone',          label: 'Phone Number',             type: 'tel',                    placeholder: '+00 000 000 000', hint: 'Optional' },
        ],
      },
      {
        heading: 'Your region',
        fields: [
          { name: 'country',             label: 'Country',                     type: 'text', required: true, placeholder: 'e.g. Italy, France, Spain' },
          { name: 'region',              label: 'Region / City',               type: 'text', required: true, placeholder: 'e.g. Tuscany, Provence, Alentejo' },
          { name: 'production_location', label: 'Where are your products made?', type: 'text',              placeholder: 'A brief description of your production location', hint: 'Optional' },
        ],
      },
    ],
  },
  {
    number: 2,
    title: 'Your Products',
    sections: [
      {
        fields: [
          {
            name: '_alcohol_notice',
            label: 'Important notice',
            type: 'notice',
            hint: 'Terravoa does not accept wine, beer, spirits, or any alcohol-based products. Applicants whose primary products contain alcohol will not be considered.',
          },
          {
            name: 'product_categories',
            label: 'What type of products would you like to offer?',
            type: 'checkbox-group',
            required: true,
            hint: 'Select all that apply',
            options: [
              'Olive Oil & Olives',
              'Honey & Bee Products',
              'Cheese & Dairy',
              'Cured Meats & Charcuterie',
              'Truffles & Wild Mushrooms',
              'Pasta, Grains & Legumes',
              'Preserves, Jams & Condiments',
              'Vinegars & Sauces',
              'Chocolate, Sweets & Confectionery',
              'Spices, Herbs & Salt',
              'Teas & Infusions',
              'Fresh Produce',
              'Ceramics & Pottery',
              'Textiles & Linen',
              'Natural Body Care',
              'Other',
            ],
          },
          { name: 'product_description',    label: 'Short description of your products',   type: 'textarea', required: true, placeholder: 'Describe your products, ingredients, and what sets them apart…', hint: 'What makes them special? Mention key ingredients, origin, or tradition.' },
          { name: 'product_differentiator', label: 'What makes your products unique?',      type: 'textarea',               placeholder: 'Tell us about your unique methods, traditions, or philosophy…', hint: 'Your approach, tradition, or process that no one else has' },
          { name: 'pricing_range',          label: 'Approximate price range per unit',      type: 'text',                   placeholder: 'e.g. €5–€15 per jar, €20–€40 per bottle', hint: 'Optional — helps us understand your positioning' },
        ],
      },
    ],
  },
  {
    number: 3,
    title: 'Quality & Craft',
    subtitle: 'This section helps us understand your production methods and any official certifications. There are no wrong answers — we value authenticity at every scale.',
    sections: [
      {
        heading: 'Organic production',
        fields: [
          {
            name: 'is_organic',
            label: 'Are your products organically produced?',
            type: 'radio',
            options: [
              'Yes — certified organic',
              'Partially — some products are organic',
              'No certification, but natural / low-input methods',
              'No specific organic practices',
            ],
          },
          { name: 'organic_certifier', label: 'Who certified your organic production?', type: 'text', placeholder: 'e.g. Ecocert, CCPB, Bureau Veritas, Soil Association…', hint: 'Optional — only if certified' },
        ],
      },
      {
        heading: 'Official quality designations',
        fields: [
          {
            name: 'certifications',
            label: 'Official certifications & designations',
            type: 'checkbox-group',
            hint: 'Select all that apply',
            options: [
              'DOP / PDO — Protected Designation of Origin',
              'IGP / PGI — Protected Geographical Indication',
              'STG / TSG — Traditional Speciality Guaranteed',
              'Label Rouge (France)',
              'EU Organic (green leaf logo)',
              'AB — Agriculture Biologique (France)',
              'Demeter — Biodynamic',
              'Fair Trade',
              'No official designations',
              'Other (please specify below)',
            ],
          },
          { name: 'certification_body', label: 'Issuing authority or certification body', type: 'text', placeholder: 'e.g. INAO (France), ICQRF (Italy), CCAE (Portugal)…', hint: 'Optional — helps us verify your designations' },
        ],
      },
      {
        heading: 'Production scale & capacity',
        fields: [
          {
            name: 'production_scale',
            label: 'How would you describe your production scale?',
            type: 'radio',
            required: true,
            hint: 'We work with producers of all sizes — quality over quantity',
            options: [
              'Fully artisanal — every step done by hand, tiny batches',
              'Traditional with some equipment — methods are craft-based',
              'Small family business — 2 to 10 people, seasonal or year-round',
              'Prefer not to say',
            ],
          },
          { name: 'annual_production', label: 'Approximate annual production volume', type: 'text', placeholder: 'e.g. 500 kg of honey, 2,000 jars of jam, 300 litres of olive oil', hint: 'Optional' },
          { name: 'shelf_life',        label: 'Typical shelf life of your products',  type: 'text', placeholder: 'e.g. 12–24 months at room temperature', hint: 'Optional' },
          {
            name: 'packaging_ready',
            label: 'Are your products packaged and ready for direct-to-customer shipment?',
            type: 'radio',
            options: [
              'Yes — already packaged for retail / direct sale',
              'Partially — some products are ready',
              'Not yet — we would need to adapt our packaging',
            ],
          },
        ],
      },
    ],
  },
  {
    number: 4,
    title: 'Your Story',
    sections: [
      {
        fields: [
          { name: 'story', label: 'Tell us your story', type: 'textarea', required: true, placeholder: 'We\'d love to hear about the history and heart behind what you do…', hint: 'How did your production begin? Is there a tradition behind your work? What does your craft mean to you?' },
        ],
      },
      {
        heading: 'A glimpse into your work',
        fields: [
          { name: 'product_photos',     label: 'Product photos',          type: 'file-upload', hint: 'Authentic images only — JPG, PNG, WebP up to 10MB each' },
          { name: 'production_photos',  label: 'Production process',      type: 'file-upload', hint: 'Photos of your workshop, farm, or production space' },
          { name: 'environment_photos', label: 'Environment / region',    type: 'file-upload', hint: 'Landscape, terroir, or place that defines your work' },
        ],
      },
      {
        heading: 'Online presence',
        fields: [
          { name: 'website',     label: 'Website',     type: 'url',  placeholder: 'https://yourwebsite.com', hint: 'Your own website, farm page, or online shop' },
          { name: 'instagram',   label: 'Instagram',   type: 'text', placeholder: '@youraccount' },
          { name: 'other_links', label: 'Other links', type: 'text', placeholder: 'URLs, one per line or separated by commas', hint: 'Facebook, Etsy, local marketplace, press coverage…' },
        ],
      },
    ],
  },
  {
    number: 5,
    title: 'Shipping & Logistics',
    sections: [
      {
        heading: 'Logistics',
        fields: [
          { name: 'shipping_countries', label: 'Which countries do you currently ship to?',              type: 'text',  placeholder: 'e.g. France, Germany, Italy, EU-wide…' },
          { name: 'shipping_speed',     label: 'How quickly can you ship orders after receiving them?',  type: 'radio', required: true, options: ['Within 24 hours', 'Within 48 hours', 'More than 48 hours'] },
          { name: 'shipping_experience',label: 'Do you have experience shipping directly to end customers?', type: 'radio', options: ['Yes', 'No'] },
        ],
      },
      {
        heading: 'Declarations (all four required)',
        fields: [
          { name: 'confirm_no_alcohol', label: 'I confirm that my application does not include wine, beer, spirits, or any other alcohol-based products.',                                        type: 'checkbox-group', required: true, options: ['Confirm'] },
          { name: 'confirm_local',      label: 'I confirm that my products are locally produced and that I represent authentic, artisanal craftsmanship.',                                       type: 'checkbox-group', required: true, options: ['Confirm'] },
          { name: 'confirm_quality',    label: 'I agree to Terravoa\'s quality standards and understand that applications are subject to curation.',                                             type: 'checkbox-group', required: true, options: ['Confirm'] },
          { name: 'confirm_company_registered', label: 'I confirm we are a legally registered business in the country stated above, with a valid VAT / tax ID for invoicing.', type: 'checkbox-group', required: true, options: ['Confirm'] },
        ],
      },
    ],
  },
]

// ── Page component ────────────────────────────────────────────────────────────

export default function ApplicationPreviewPage() {
  return (
    <div>
      <Link href="/admin/applications" className="inline-block font-sans text-xs text-on-surface-variant hover:text-primary mb-6 transition-colors">
        ← Back to applications
      </Link>

      <AdminPageHeader
        title="Application form preview"
        description="Exactly what producers see when applying — all 5 steps, all questions, all validations."
      />

      <div className="mb-8 flex items-start gap-3 rounded-xl border border-secondary/20 bg-secondary/5 px-5 py-4">
        <Eye size={16} strokeWidth={1.5} className="text-secondary shrink-0 mt-0.5" />
        <p className="font-sans text-sm text-on-surface/80 leading-relaxed">
          This is a <strong>read-only</strong> overview of the producer application questionnaire. Fields marked <span className="text-secondary font-medium">*</span> are required. The actual form is at{' '}
          <a href="/en/for-producers/apply" target="_blank" rel="noopener noreferrer" className="text-secondary underline underline-offset-2">
            /for-producers/apply
          </a>.
        </p>
      </div>

      <div className="space-y-10">
        {STEPS.map((step) => (
          <div key={step.number} className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
            {/* Step header */}
            <div className="bg-primary/5 border-b border-outline-variant/15 px-6 py-4 flex items-center gap-3">
              <span className="font-serif text-3xl text-primary/25 leading-none shrink-0">{String(step.number).padStart(2, '0')}</span>
              <div>
                <h2 className="font-serif text-xl text-primary">{step.title}</h2>
                {step.subtitle && <p className="font-sans text-xs text-on-surface-variant mt-0.5 max-w-xl">{step.subtitle}</p>}
              </div>
            </div>

            {/* Sections */}
            <div className="divide-y divide-outline-variant/10">
              {step.sections.map((section, si) => (
                <div key={si} className="px-6 py-6">
                  {section.heading && (
                    <h3 className="font-sans text-xs uppercase tracking-widest text-secondary mb-4">{section.heading}</h3>
                  )}
                  <div className="space-y-5">
                    {section.fields.map((field) => (
                      <PreviewField key={field.name} field={field} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── PreviewField ─────────────────────────────────────────────────────────────

function PreviewField({ field }: { field: Field }) {
  if (field.type === 'notice') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-300/40 bg-amber-50/60 px-4 py-3">
        <AlertTriangle size={15} strokeWidth={1.5} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-sans text-sm font-semibold text-amber-800">{field.label}</p>
          <p className="font-sans text-sm text-amber-700 leading-relaxed mt-0.5">{field.hint}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
      {/* Label column */}
      <div className="sm:w-64 shrink-0">
        <p className="font-sans text-xs uppercase tracking-wider text-on-surface/60">
          {field.label}
          {field.required && <span className="text-secondary ml-1">*</span>}
        </p>
        {field.hint && (
          <p className="font-sans text-[11px] text-on-surface-variant/60 mt-0.5 leading-relaxed">{field.hint}</p>
        )}
      </div>

      {/* Input preview column */}
      <div className="flex-1">
        {(field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'url') && (
          <div className="h-8 border-b border-outline-variant/30 flex items-end pb-1">
            <span className="font-sans text-xs text-on-surface-variant/40 italic">{field.placeholder ?? '—'}</span>
          </div>
        )}
        {field.type === 'textarea' && (
          <div className="rounded-lg border border-outline-variant/25 bg-surface px-3 py-2 min-h-[72px] flex items-start">
            <span className="font-sans text-xs text-on-surface-variant/40 italic">{field.placeholder ?? '—'}</span>
          </div>
        )}
        {field.type === 'radio' && (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <div key={opt} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full border-2 border-outline-variant/40 shrink-0" />
                <span className="font-sans text-sm text-on-surface/70">{opt}</span>
              </div>
            ))}
          </div>
        )}
        {field.type === 'checkbox-group' && (
          <div className="flex flex-wrap gap-2">
            {field.options?.map((opt) => (
              <div key={opt} className="flex items-center gap-2 bg-surface-container-low/80 border border-outline-variant/20 px-3 py-1.5 rounded-full">
                <div className="w-3.5 h-3.5 rounded border border-outline-variant/40 shrink-0" />
                <span className="font-sans text-xs text-on-surface/70">{opt}</span>
              </div>
            ))}
          </div>
        )}
        {field.type === 'file-upload' && (
          <div className="rounded-xl border-2 border-dashed border-outline-variant/25 p-4 text-center">
            <span className="font-sans text-xs text-on-surface-variant/50">📎 File upload area — JPG, PNG, WebP · max 10 MB per file</span>
          </div>
        )}
      </div>
    </div>
  )
}
