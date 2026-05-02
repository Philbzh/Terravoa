import type { Metadata } from 'next'
import { PageContainer } from '@/components/ui/PageContainer'
import { Link } from '@/i18n/navigation'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: `How ${SITE_NAME} uses cookies and similar technologies, and how you can control them.`,
}

export default function CookiesPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl text-primary mb-6 text-center">
          Cookie Policy
        </h1>
        <p className="text-on-surface-variant font-sans text-sm mb-12 text-center">
          Last updated: 12 April 2026
        </p>

        <div className="space-y-10 text-on-surface/80 font-sans leading-relaxed text-sm">

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They
              allow the website to recognise your device, remember your preferences, and provide certain
              features. Cookies cannot run programs or deliver viruses to your device.
            </p>
            <p className="mt-3">
              We use cookies in accordance with the GDPR and applicable French law (including guidance from
              the CNIL). Where cookies are not strictly necessary, we ask for your consent before setting
              them. You can update your preferences at any time via our cookie banner.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">Essential Cookies</h2>
            <p>
              These cookies are strictly necessary for the Platform to function and cannot be disabled.
              They are set automatically when you visit the site and do not require your consent under
              applicable law.
            </p>
            <div className="mt-4 bg-surface-container-low rounded-lg p-6 space-y-4">
              <div>
                <p className="font-medium text-on-surface/90 mb-1">
                  <code className="text-xs bg-surface-container rounded px-1 py-0.5">sb-access-token</code>
                  {' '}&amp;{' '}
                  <code className="text-xs bg-surface-container rounded px-1 py-0.5">sb-refresh-token</code>
                </p>
                <p>
                  Set by Supabase to manage your authentication session. These cookies allow you to remain
                  logged in as you navigate between pages. They expire when your session ends or after a
                  maximum of 7 days.
                </p>
              </div>
              <div>
                <p className="font-medium text-on-surface/90 mb-1">
                  <code className="text-xs bg-surface-container rounded px-1 py-0.5">terravoa_cookie_consent</code>
                  {' '}(browser local storage)
                </p>
                <p>
                  Stores your cookie preferences so we do not ask for consent on every visit. This value
                  is saved in your browser&apos;s local storage (not transmitted with every request) and
                  only after you interact with the cookie banner. It remains until you clear your browser
                  storage or explicitly reset your preferences.
                </p>
              </div>
              <div>
                <p className="font-medium text-on-surface/90 mb-1">
                  <code className="text-xs bg-surface-container rounded px-1 py-0.5">NEXT_LOCALE</code>
                </p>
                <p>
                  Stores your selected language preference to ensure the correct version of the site is
                  displayed on subsequent visits. Expires after 12 months.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">Analytics Cookies (Optional)</h2>
            <p>
              These cookies help us understand how visitors interact with the Platform, so we can improve
              the user experience. They are only set if you have given your consent. All analytics data
              is anonymised and cannot be used to identify you personally.
            </p>
            <div className="mt-4 bg-surface-container-low rounded-lg p-6">
              <p className="font-medium text-on-surface/90 mb-1">Analytics provider cookies</p>
              <p>
                We may use a privacy-friendly analytics service to collect aggregated statistics such as
                page views, session duration, and navigation paths. No personal data or cross-site
                tracking is involved. You can opt out at any time by updating your cookie preferences.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">How to Control Cookies</h2>
            <p>You have several options for managing cookies:</p>
            <ul className="mt-3 space-y-2 ml-4">
              <li>
                <strong className="text-on-surface/90">Cookie banner:</strong>{' '}
                You can update your preferences at any time by clicking the &ldquo;Cookie Settings&rdquo; link
                in the footer of any page.
              </li>
              <li>
                <strong className="text-on-surface/90">Browser settings:</strong>{' '}
                Most browsers allow you to refuse or delete cookies via their settings. Please note that
                disabling essential cookies will impair the functionality of the Platform — for example,
                you will not be able to stay logged in.
              </li>
              <li>
                <strong className="text-on-surface/90">Device settings:</strong>{' '}
                For cookies set by third parties on mobile devices, you may be able to manage these through
                your device operating system settings.
              </li>
            </ul>
            <p className="mt-3">
              For guidance on how to manage cookies in your browser, visit your browser&apos;s help pages or
              refer to resources such as{' '}
              <a
                href="https://www.aboutcookies.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                aboutcookies.org
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">Further Information</h2>
            <p>
              For more information on how we use your personal data, please see our{' '}
              <Link href="/privacy" className="text-secondary hover:underline">
                Privacy Policy
              </Link>. For questions about our use of cookies, contact us at{' '}
              <a href="mailto:privacy@terravoa.com" className="text-secondary hover:underline">
                privacy@terravoa.com
              </a>.
            </p>
          </section>

        </div>
      </div>
    </PageContainer>
  )
}
