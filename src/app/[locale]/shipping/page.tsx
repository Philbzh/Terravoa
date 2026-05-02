import type { Metadata } from 'next'
import { PageContainer } from '@/components/ui/PageContainer'
import { Package, Truck, Globe, Clock, CreditCard, ShieldCheck, Thermometer, MapPin, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping Information',
  description: 'How Terravoa products are shipped — directly from the producer to your door, with transparent delivery times, temperature-controlled options, and eco-friendly packaging.',
}

const shippingInfo = [
  {
    icon: Truck,
    title: 'Direct from the source',
    description: 'Every product is shipped directly by the producer — no warehouses, no middlemen. Your order travels straight from the origin to your door.',
  },
  {
    icon: Package,
    title: 'Separate packages, separate stories',
    description: 'If you order from more than one producer, your items will arrive in separate packages. Each one is packed with care at its place of origin.',
  },
  {
    icon: Clock,
    title: 'Dispatch &amp; delivery times',
    description: 'Most orders are dispatched within 1–3 business days of confirmed payment. Delivery within Europe typically takes 3–7 business days. Times vary by producer location and destination country.',
  },
  {
    icon: Globe,
    title: 'Delivery areas',
    description: 'We currently ship to all EU member states, Switzerland, Norway, and the United Kingdom. Additional countries may be available depending on the individual producer.',
  },
]

export default function ShippingPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl text-primary mb-4 text-center">
          Shipping &amp; Delivery
        </h1>
        <p className="text-on-surface-variant font-sans text-center mb-3 max-w-xl mx-auto">
          Seamless payment. Direct delivery from the source.
        </p>
        <p className="text-on-surface-variant/70 font-sans text-sm text-center mb-6 max-w-lg mx-auto">
          You pay once through Terravoa — securely and simply. Your products are then shipped directly
          by each producer, fresh from the origin.
        </p>
        <p className="text-on-surface-variant font-sans text-xs text-center mb-16">
          Last updated: 12 April 2026
        </p>

        {/* Core shipping facts */}
        <div className="space-y-8 mb-16">
          {shippingInfo.map((info) => {
            const Icon = info.icon
            return (
              <div key={info.title} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
                  <Icon size={22} strokeWidth={1.2} className="text-secondary" />
                </div>
                <div>
                  <h3
                    className="font-serif text-xl text-primary mb-2"
                    dangerouslySetInnerHTML={{ __html: info.title }}
                  />
                  <p className="text-on-surface/70 font-sans text-sm leading-relaxed">
                    {info.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Shipping costs */}
        <div className="bg-surface-container-low rounded-xl p-8 mb-8">
          <h3 className="font-serif text-xl text-primary mb-4">Shipping Costs</h3>
          <div className="space-y-3 font-sans text-sm text-on-surface/70">
            <div className="flex justify-between py-2 border-b border-outline-variant/10">
              <span>Orders under €50</span>
              <span className="text-primary font-medium">From €4.90</span>
            </div>
            <div className="flex justify-between py-2 border-b border-outline-variant/10">
              <span>Orders €50–€99</span>
              <span className="text-primary font-medium">From €2.90</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Orders over €100</span>
              <span className="text-secondary font-medium">Free shipping</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-sans text-xs mt-4">
            Exact shipping costs vary by producer location and destination country. The final cost is
            shown at checkout before you confirm your order.
          </p>
        </div>

        {/* Temperature-controlled delivery */}
        <div className="bg-surface-container-low rounded-xl p-8 mb-8">
          <div className="flex gap-4 items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
              <Thermometer size={20} strokeWidth={1.2} className="text-secondary" />
            </div>
            <h3 className="font-serif text-xl text-primary mt-1">Temperature-Controlled Delivery</h3>
          </div>
          <div className="space-y-3 font-sans text-sm text-on-surface/70">
            <p>
              Fresh, chilled, and frozen products require specialised packaging and carrier services to
              maintain the cold chain from producer to your door. Producers offering these products ship
              in insulated boxes with ice packs or dry ice, using express courier services that deliver
              within 24–48 hours of dispatch.
            </p>
            <p>
              Temperature-controlled products are typically dispatched at the beginning of the week
              (Monday–Wednesday) to avoid weekend delays. In exceptional heat conditions, dispatch may
              be postponed to protect product quality — we will notify you by email if this applies to
              your order.
            </p>
            <p>
              Due to the perishable nature of these products, an additional temperature-controlled
              delivery surcharge may apply. This will be clearly displayed at checkout.
            </p>
          </div>
        </div>

        {/* Tracking */}
        <div className="bg-surface-container-low rounded-xl p-8 mb-8">
          <div className="flex gap-4 items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
              <MapPin size={20} strokeWidth={1.2} className="text-secondary" />
            </div>
            <h3 className="font-serif text-xl text-primary mt-1">Order Tracking</h3>
          </div>
          <div className="space-y-3 font-sans text-sm text-on-surface/70">
            <p>
              Once your order has been dispatched, you will receive a shipping confirmation email
              containing a tracking number and a link to the carrier&apos;s tracking page. Tracking
              information may take up to 24 hours to become active after dispatch.
            </p>
            <p>
              As orders are shipped directly by individual producers, each producer&apos;s package will have
              its own tracking number. If you have ordered from multiple producers, you will receive
              separate tracking emails for each shipment.
            </p>
          </div>
        </div>

        {/* Lost parcels */}
        <div className="bg-surface-container-low rounded-xl p-8 mb-8">
          <div className="flex gap-4 items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
              <AlertCircle size={20} strokeWidth={1.2} className="text-secondary" />
            </div>
            <h3 className="font-serif text-xl text-primary mt-1">Lost or Delayed Parcels</h3>
          </div>
          <div className="space-y-3 font-sans text-sm text-on-surface/70">
            <p>
              If your parcel has not arrived within the estimated delivery window shown at checkout,
              please first check the tracking link provided in your shipping confirmation email.
            </p>
            <p>
              If tracking shows no movement for more than 5 business days, or if the estimated delivery
              date has passed without delivery, please contact us at{' '}
              <a href="mailto:hello@terravoa.com" className="text-secondary hover:underline">
                hello@terravoa.com
              </a>{' '}
              with your order number. We will liaise with the producer and carrier on your behalf to
              investigate and, where applicable, arrange a replacement shipment or full refund.
            </p>
            <p>
              Please note that Terravoa is not liable for delays caused by force majeure events, customs
              inspections, or circumstances beyond the carrier&apos;s reasonable control. However, we will
              always work to find a fair resolution.
            </p>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-surface-container-low rounded-xl p-8">
          <h3 className="font-serif text-xl text-primary mb-4">Payment</h3>
          <div className="space-y-4 font-sans text-sm text-on-surface/70">
            <div className="flex gap-4 items-start">
              <CreditCard size={18} strokeWidth={1.2} className="text-secondary shrink-0 mt-0.5" />
              <p>
                One simple, central payment — credit card, Apple Pay, or Google Pay. All transactions
                are processed securely through Stripe. You pay once regardless of how many producers
                your order spans.
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <ShieldCheck size={18} strokeWidth={1.2} className="text-secondary shrink-0 mt-0.5" />
              <p>
                Your payment details are never stored on our servers. All prices include VAT for
                your country of delivery.
              </p>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  )
}
