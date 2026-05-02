import type { Metadata } from 'next'
import { PageContainer } from '@/components/ui/PageContainer'
import { Link } from '@/i18n/navigation'
import { COMPANY_LEGAL_NAME, COMPANY_REGISTERED_OFFICE, SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE_NAME} collects, uses, and protects your personal data in accordance with the GDPR.`,
}

export default function PrivacyPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl text-primary mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-on-surface-variant font-sans text-sm mb-12 text-center">
          Last updated: 12 April 2026
        </p>

        <div className="space-y-10 text-on-surface/80 font-sans leading-relaxed text-sm">

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">1. Data Controller</h2>
            <p>
              Terravoa SAS (&ldquo;{SITE_NAME}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is the data controller for personal data collected
              through this website and marketplace platform, in accordance with Regulation (EU) 2016/679
              (the General Data Protection Regulation, &ldquo;GDPR&rdquo;) and applicable French data
              protection law (Loi Informatique et Libertés).
            </p>
            <p className="mt-3">
              Our registered address is: Terravoa SAS, [Registered Address], France.
              For all data protection enquiries, please contact our Data Protection Officer at{' '}
              <a href="mailto:privacy@terravoa.com" className="text-secondary hover:underline">
                privacy@terravoa.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">2. Data We Collect</h2>
            <p>We collect the following categories of personal data:</p>
            <ul className="mt-3 space-y-2 ml-4">
              <li>
                <strong className="text-on-surface/90">Identity data:</strong> first name, last name,
                username or similar identifier.
              </li>
              <li>
                <strong className="text-on-surface/90">Contact data:</strong> billing address, delivery
                address, email address, and telephone number.
              </li>
              <li>
                <strong className="text-on-surface/90">Transaction data:</strong> details about payments
                and orders you have placed through the Platform.
              </li>
              <li>
                <strong className="text-on-surface/90">Technical data:</strong> internet protocol (IP)
                address, browser type and version, time zone setting, browser plug-in types and versions,
                operating system, and other technology on the devices you use to access the Platform.
              </li>
              <li>
                <strong className="text-on-surface/90">Usage data:</strong> information about how you use
                our website and services, including pages visited, time spent on pages, and navigation paths.
              </li>
              <li>
                <strong className="text-on-surface/90">Marketing preferences:</strong> your preferences
                regarding receiving marketing communications from us.
              </li>
            </ul>
            <p className="mt-3">
              We do not collect any Special Category data (such as data revealing racial or ethnic origin,
              political opinions, health data, or biometric data) and we do not collect data relating to
              criminal convictions or offences.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">3. How We Use Your Data</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul className="mt-3 space-y-2 ml-4">
              <li>• To create and manage your account on the Platform.</li>
              <li>• To process and fulfil your orders, including payment processing and delivery coordination.</li>
              <li>• To send you order confirmations, shipping updates, and other transactional communications.</li>
              <li>• To respond to enquiries, complaints, and support requests.</li>
              <li>• To send you marketing communications about products, offers, and events — only where you have given your consent or we have a legitimate interest to do so.</li>
              <li>• To improve and personalise your experience on the Platform.</li>
              <li>• To comply with our legal and regulatory obligations, including fraud prevention and financial record-keeping.</li>
            </ul>
            <p className="mt-3">
              We never sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">4. Legal Basis for Processing (GDPR)</h2>
            <p>We process your personal data on the following legal bases:</p>
            <ul className="mt-3 space-y-2 ml-4">
              <li>
                <strong className="text-on-surface/90">Performance of a contract (Art. 6(1)(b) GDPR):</strong>{' '}
                Processing necessary to fulfil your orders and manage your account.
              </li>
              <li>
                <strong className="text-on-surface/90">Legal obligation (Art. 6(1)(c) GDPR):</strong>{' '}
                Processing required by applicable law, such as retaining financial records for accounting purposes.
              </li>
              <li>
                <strong className="text-on-surface/90">Legitimate interests (Art. 6(1)(f) GDPR):</strong>{' '}
                Processing for fraud prevention, network security, and improving our services, where these
                interests are not overridden by your rights and interests.
              </li>
              <li>
                <strong className="text-on-surface/90">Consent (Art. 6(1)(a) GDPR):</strong>{' '}
                Processing for marketing communications and optional analytics cookies, where you have given
                your explicit consent. You may withdraw your consent at any time.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">5. Data Retention</h2>
            <p>
              We retain your personal data only for as long as is necessary for the purposes for which it was
              collected, or as required by applicable law. Specifically:
            </p>
            <ul className="mt-3 space-y-2 ml-4">
              <li>• Account data is retained for the duration of your account plus 3 years following closure.</li>
              <li>• Order and financial records are retained for 10 years in accordance with French accounting law.</li>
              <li>• Marketing consent records are retained for 3 years from the date of consent or your last interaction with us.</li>
              <li>• Technical and usage data derived from analytics is retained in anonymised form indefinitely.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">6. Your Rights (GDPR Art. 15–22)</h2>
            <p>Under the GDPR, you have the following rights regarding your personal data:</p>
            <ul className="mt-3 space-y-2 ml-4">
              <li>
                <strong className="text-on-surface/90">Right of access (Art. 15):</strong>{' '}
                You may request a copy of the personal data we hold about you.
              </li>
              <li>
                <strong className="text-on-surface/90">Right to rectification (Art. 16):</strong>{' '}
                You may ask us to correct any inaccurate or incomplete data.
              </li>
              <li>
                <strong className="text-on-surface/90">Right to erasure (Art. 17):</strong>{' '}
                You may request deletion of your personal data where there is no compelling reason for its continued processing.
              </li>
              <li>
                <strong className="text-on-surface/90">Right to restriction of processing (Art. 18):</strong>{' '}
                You may request that we restrict processing of your data in certain circumstances.
              </li>
              <li>
                <strong className="text-on-surface/90">Right to data portability (Art. 20):</strong>{' '}
                You may request to receive your data in a structured, machine-readable format.
              </li>
              <li>
                <strong className="text-on-surface/90">Right to object (Art. 21):</strong>{' '}
                You may object to processing based on legitimate interests or for direct marketing purposes.
              </li>
              <li>
                <strong className="text-on-surface/90">Right to withdraw consent (Art. 7(3)):</strong>{' '}
                Where processing is based on consent, you may withdraw it at any time without affecting the
                lawfulness of prior processing.
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:privacy@terravoa.com" className="text-secondary hover:underline">
                privacy@terravoa.com
              </a>. We will respond within 30 days. You also have the right to lodge a complaint with the
              French data protection authority (CNIL) at{' '}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                cnil.fr
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">7. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies on our Platform. For detailed information about
              the cookies we use and how to control them, please see our{' '}
              <Link href="/cookies" className="text-secondary hover:underline">
                Cookie Policy
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">8. Third-Party Services</h2>
            <p>We work with carefully selected third-party service providers who process data on our behalf:</p>
            <ul className="mt-3 space-y-2 ml-4">
              <li>
                <strong className="text-on-surface/90">Supabase:</strong>{' '}
                Our database and authentication provider. Supabase processes authentication data and stores
                user account information. Data is hosted in the EU. See{' '}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline"
                >
                  Supabase Privacy Policy
                </a>.
              </li>
              <li>
                <strong className="text-on-surface/90">Stripe:</strong>{' '}
                Our payment processing provider. Stripe handles all payment card data and is certified to
                PCI DSS Level 1. We do not store payment card details on our servers. See{' '}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline"
                >
                  Stripe Privacy Policy
                </a>.
              </li>
              <li>
                <strong className="text-on-surface/90">Sanity:</strong>{' '}
                Our content management system. Sanity stores product and editorial content. It does not
                process end-user personal data. See{' '}
                <a
                  href="https://www.sanity.io/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline"
                >
                  Sanity Privacy Policy
                </a>.
              </li>
            </ul>
            <p className="mt-3">
              We require all third-party processors to respect the security of your data and to process it
              only in accordance with our instructions and applicable data protection law.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">9. International Transfers</h2>
            <p>
              Where personal data is transferred outside the European Economic Area (EEA), we ensure that
              appropriate safeguards are in place, such as Standard Contractual Clauses approved by the
              European Commission, or that the recipient country benefits from an adequacy decision.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">10. Contact the DPO</h2>
            <p>
              For any questions or concerns regarding this Privacy Policy or the processing of your personal
              data, please contact our Data Protection Officer:
            </p>
            <p className="mt-3">
              Email:{' '}
              <a href="mailto:privacy@terravoa.com" className="text-secondary hover:underline">
                privacy@terravoa.com
              </a>
              <br />
              Post: Data Protection Officer, {COMPANY_LEGAL_NAME}, {COMPANY_REGISTERED_OFFICE}.
            </p>
          </section>

        </div>
      </div>
    </PageContainer>
  )
}
