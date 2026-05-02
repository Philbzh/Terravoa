import type { Metadata } from 'next'
import { PageContainer } from '@/components/ui/PageContainer'
import { Link } from '@/i18n/navigation'
import { COMPANY_LEGAL_NAME, COMPANY_REGISTERED_OFFICE, SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: `The terms and conditions governing your use of ${SITE_NAME} and purchases made through our marketplace.`,
}

export default function TermsPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl text-primary mb-6 text-center">
          Terms &amp; Conditions
        </h1>
        <p className="text-on-surface-variant font-sans text-sm mb-12 text-center">
          Last updated: 12 April 2026
        </p>

        <div className="space-y-10 text-on-surface/80 font-sans leading-relaxed text-sm">

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">1. Introduction</h2>
            <p>
              These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the {SITE_NAME}{' '}
              website and marketplace platform (the &ldquo;Platform&rdquo;), operated by Terravoa SAS, a company
              registered in France. By accessing the Platform or placing an order, you confirm that you have
              read, understood, and agree to be bound by these Terms in their entirety.
            </p>
            <p className="mt-3">
              If you do not agree to these Terms, you must not use the Platform. We reserve the right to
              update these Terms at any time; continued use of the Platform after any change constitutes
              your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">2. Use of the Platform</h2>
            <p>
              You may use the Platform only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="mt-3 space-y-2 ml-4">
              <li>• Use the Platform in any way that violates applicable French or EU law or regulation.</li>
              <li>• Transmit any unsolicited or unauthorised advertising or promotional material.</li>
              <li>• Attempt to gain unauthorised access to any part of the Platform or its related systems.</li>
              <li>• Use automated tools to scrape, crawl, or extract data from the Platform without our prior written consent.</li>
              <li>• Impersonate any person or entity, or falsely represent your affiliation with any person or entity.</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate your account at any time if we have reason to believe
              you have breached these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">3. Orders &amp; Payments</h2>
            <p>
              All prices displayed on the Platform are in Euros (EUR) and include applicable VAT unless
              otherwise stated. By submitting an order, you make a binding offer to purchase the selected
              products. A contract of sale is formed when you receive an order confirmation by email.
            </p>
            <p className="mt-3">
              Payment is processed securely at the time of purchase via Stripe. We accept major credit and
              debit cards, Apple Pay, and Google Pay. Your payment details are never stored on our servers.
              Orders are dispatched only after successful payment authorisation.
            </p>
            <p className="mt-3">
              {SITE_NAME} acts as the merchant of record for all transactions on the Platform. Producers
              receive payment for their goods through our internal settlement process after order fulfilment.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">4. Producer Responsibilities</h2>
            <p>
              Producers listed on the Platform are independent sellers who have entered into a separate
              Producer Agreement with {SITE_NAME}. Each producer is responsible for:
            </p>
            <ul className="mt-3 space-y-2 ml-4">
              <li>• The accuracy of all product information, descriptions, ingredients, and allergen declarations.</li>
              <li>• Compliance with all applicable food safety, labelling, and hygiene regulations in their jurisdiction and destination markets.</li>
              <li>• Packing, preparing, and dispatching orders in a timely and professional manner.</li>
              <li>• Maintaining appropriate product liability insurance.</li>
            </ul>
            <p className="mt-3">
              {SITE_NAME} conducts due-diligence checks on producers before listing, but does not act as the
              manufacturer or direct seller of any product. As a consumer, your statutory rights under EU
              consumer protection law apply regardless of the producer&apos;s country of origin.
            </p>

            <h3 className="font-serif text-lg text-primary mt-8 mb-2">Consumer reviews</h3>
            <p>
              Product star ratings and written reviews displayed on the Platform are submitted by customers
              who have purchased through {SITE_NAME}. They reflect buyers&apos; experiences with the product
              and, where relevant, fulfilment. {SITE_NAME} does not write, set, or edit individual ratings as
              its own opinion. We may moderate or remove content that is unlawful, abusive, fraudulent, or
              spam, but we do not alter star ratings for commercial reasons or to favour any producer or
              customer.
            </p>

            <h3 className="font-serif text-lg text-primary mt-8 mb-2">Producer listings and performance</h3>
            <p>
              Producers acknowledge that sustained poor customer feedback, repeated shipping or packaging
              failures, unresponsiveness to legitimate buyer enquiries, or serious breaches of the Producer
              Agreement may, after reasonable notice where contractually required, result in suspension or
              removal of listings. {SITE_NAME} exercises this discretion to protect customers and marketplace
              integrity. Nothing in these Terms limits mandatory consumer rights or relieves producers of
              their legal obligations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">5. Intellectual Property</h2>
            <p>
              All content on the Platform — including text, images, logos, graphics, video, and software —
              is the property of Terravoa SAS or its licensors and is protected by French and EU intellectual
              property law. You may not reproduce, distribute, or create derivative works from any content
              on the Platform without our express written permission.
            </p>
            <p className="mt-3">
              Product images and descriptions provided by producers remain the intellectual property of the
              respective producer. By uploading content to the Platform, producers grant {SITE_NAME} a
              non-exclusive, royalty-free licence to use that content for the purposes of operating and
              promoting the Platform.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, {SITE_NAME} shall not be liable for any
              indirect, incidental, special, or consequential damages arising out of or in connection with
              your use of the Platform or purchase of products through it, including but not limited to loss
              of profit, loss of data, or business interruption.
            </p>
            <p className="mt-3">
              Nothing in these Terms limits or excludes our liability for death or personal injury caused by
              our negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be
              excluded under applicable French or EU law.
            </p>
            <p className="mt-3">
              Your statutory consumer rights under EU Directive 2011/83/EU on consumer rights and the
              applicable French transposing legislation are not affected by these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">7. Governing Law</h2>
            <p>
              These Terms and any dispute or claim arising out of or in connection with them shall be governed
              by and construed in accordance with the laws of France, without prejudice to any mandatory
              consumer protection provisions of the law of your country of habitual residence within the EU.
            </p>
            <p className="mt-3">
              Any dispute that cannot be resolved amicably may be submitted to the competent courts of Paris,
              France, unless you are entitled under EU law to bring proceedings before the courts of your
              country of residence. As a consumer within the EU, you also have access to the European
              Commission&apos;s Online Dispute Resolution platform at{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                ec.europa.eu/consumers/odr
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">8. Returns &amp; Refunds</h2>
            <p>
              Please refer to our{' '}
              <Link href="/returns" className="text-secondary hover:underline">
                Returns &amp; Refunds Policy
              </Link>{' '}
              for detailed information about your right of withdrawal and how to request a return or refund.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">9. Contact</h2>
            <p>
              For questions regarding these Terms, please contact us at{' '}
              <a href="mailto:legal@terravoa.com" className="text-secondary hover:underline">
                legal@terravoa.com
              </a>{' '}
              or by post at: {COMPANY_LEGAL_NAME}, {COMPANY_REGISTERED_OFFICE}.
            </p>
          </section>

        </div>
      </div>
    </PageContainer>
  )
}
