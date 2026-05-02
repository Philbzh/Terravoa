import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PageContainer } from '@/components/ui/PageContainer'
import { Link } from '@/i18n/navigation'
import {
  COMPANY_CONTACT_EMAIL,
  COMPANY_HOSTING_PROVIDER,
  COMPANY_LEGAL_NAME,
  COMPANY_MANAGING_DIRECTOR,
  COMPANY_PHONE,
  COMPANY_REGISTERED_OFFICE,
  COMPANY_REGISTRATION,
  COMPANY_SHARE_CAPITAL,
  COMPANY_SIRET,
  COMPANY_VAT_ID,
  SITE_NAME,
} from '@/lib/constants'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('footer')
  return {
    title: t('imprint'),
    description: `Legal notice for ${SITE_NAME} — Impressum (TMG §5) / Mentions légales (LCEN Art. 6-III).`,
    robots: { index: true, follow: true },
  }
}

export default async function ImprintPage() {
  const t = await getTranslations('footer')

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl text-primary mb-2 text-center">
          {t('imprint')}
        </h1>
        <p className="text-on-surface-variant font-sans text-xs mb-10 text-center uppercase tracking-[0.2em]">
          Impressum &middot; Mentions l&eacute;gales &middot; Legal Notice
        </p>

        <div className="space-y-10 text-on-surface/80 font-sans leading-relaxed text-sm">

          <section>
            <h2 className="font-serif text-xl text-primary mt-6 mb-3">
              1. Service Provider / Diensteanbieter / &Eacute;diteur
            </h2>
            <p>
              This website and marketplace is operated by:
            </p>
            <div className="mt-3 bg-surface-container-low rounded-lg p-6 space-y-1 font-sans text-sm text-on-surface/90">
              <p className="font-medium">{COMPANY_LEGAL_NAME}</p>
              <p>{COMPANY_REGISTERED_OFFICE}</p>
              <p className="mt-3">
                Email:{' '}
                <a
                  href={`mailto:${COMPANY_CONTACT_EMAIL}`}
                  className="text-secondary hover:underline"
                >
                  {COMPANY_CONTACT_EMAIL}
                </a>
              </p>
              <p>Phone: {COMPANY_PHONE}</p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-6 mb-3">
              2. Legal Representative / Vertretungsberechtigt / Directeur de la publication
            </h2>
            <p>
              {COMPANY_LEGAL_NAME} is legally represented by its managing director:
            </p>
            <p className="mt-2 font-medium text-on-surface/90">
              {COMPANY_MANAGING_DIRECTOR}
            </p>
            <p className="mt-3 text-xs text-on-surface-variant">
              Also responsible for editorial content of this website within the
              meaning of &sect;&nbsp;18 para.&nbsp;2 of the German Interstate Media
              Treaty (MStV) and Art.&nbsp;6-III of the French LCEN law.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-6 mb-3">
              3. Commercial Registration
            </h2>
            <p>
              <strong className="text-on-surface/90">Register / RCS:</strong>{' '}
              {COMPANY_REGISTRATION}
            </p>
            <p className="mt-2">
              <strong className="text-on-surface/90">SIRET:</strong>{' '}
              {COMPANY_SIRET}
            </p>
            <p className="mt-2">
              <strong className="text-on-surface/90">Share capital / Capital social:</strong>{' '}
              {COMPANY_SHARE_CAPITAL}
            </p>
            <p className="mt-2">
              <strong className="text-on-surface/90">
                VAT&nbsp;ID / USt-IdNr. / TVA intracommunautaire:
              </strong>{' '}
              {COMPANY_VAT_ID}
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-6 mb-3">
              4. Hosting Provider / H&eacute;bergeur
            </h2>
            <p>
              Disclosure required by LCEN Art.&nbsp;6-III. This website is hosted by:
            </p>
            <p className="mt-3 text-on-surface/90">
              {COMPANY_HOSTING_PROVIDER}
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-6 mb-3">
              5. EU Online Dispute Resolution
            </h2>
            <p>
              Under Regulation (EU) No.&nbsp;524/2013 we are required to inform
              consumers of the European Commission&rsquo;s Online Dispute Resolution
              (&ldquo;ODR&rdquo;) platform, which provides a single point of entry for
              the out-of-court resolution of disputes concerning online sales
              contracts:
            </p>
            <p className="mt-3">
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p className="mt-3">
              Our contact email for all consumer concerns is{' '}
              <a
                href={`mailto:${COMPANY_CONTACT_EMAIL}`}
                className="text-secondary hover:underline"
              >
                {COMPANY_CONTACT_EMAIL}
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-6 mb-3">
              6. Consumer Dispute Resolution (&sect;&nbsp;36 VSBG, Germany)
            </h2>
            <p>
              {COMPANY_LEGAL_NAME} is <strong className="text-on-surface/90">not obliged
              and not willing to participate</strong> in a formal dispute resolution
              procedure before a consumer arbitration board within the meaning of
              the German Act on Consumer Dispute Resolution (VSBG). Consumers
              retain full access to the courts and to the EU ODR platform linked
              in section&nbsp;5.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-6 mb-3">
              7. Liability for Content
            </h2>
            <p>
              As a service provider we are responsible for our own content on
              these pages under general law. We are not, however, obliged to
              monitor transmitted or stored third-party information or to
              investigate circumstances pointing to illegal activity. Obligations
              to remove or block the use of information under general law remain
              unaffected.
            </p>
            <p className="mt-3">
              Product listings, imagery, and descriptions submitted by
              independent producers remain the responsibility of the respective
              producer under our Producer Agreement. Liability in this respect
              attaches only from the moment we gain knowledge of a specific
              infringement. Upon notification of such infringements we will
              remove the content concerned without delay.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-6 mb-3">
              8. Liability for Links
            </h2>
            <p>
              Our website contains links to external third-party websites. We
              have no influence on the content of those external sites and
              therefore accept no liability for that content. The respective
              provider or operator of the linked pages is always responsible for
              the content. At the time of linking, the pages were reviewed for
              possible legal violations and no unlawful content was apparent.
              Permanent monitoring of the content of linked pages is not
              reasonable without concrete indications of a violation. Upon
              notification of violations we will remove such links immediately.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-6 mb-3">
              9. Further Information
            </h2>
            <p>
              For information on how we handle personal data and cookies, see
              our{' '}
              <Link href="/privacy" className="text-secondary hover:underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/cookies" className="text-secondary hover:underline">
                Cookie Policy
              </Link>
              . For our general terms of business, see our{' '}
              <Link href="/terms" className="text-secondary hover:underline">
                Terms &amp; Conditions
              </Link>{' '}
              (AGB).
            </p>
          </section>

        </div>
      </div>
    </PageContainer>
  )
}
