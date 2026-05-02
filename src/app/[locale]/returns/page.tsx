import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { PageContainer } from '@/components/ui/PageContainer'
import { COMPANY_LEGAL_NAME, COMPANY_REGISTERED_OFFICE, SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: `${SITE_NAME} returns and refund policy — your EU right of withdrawal, exceptions for perishable food, and how to request a refund.`,
}

export default function ReturnsPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl text-primary mb-6 text-center">
          Returns &amp; Refunds
        </h1>
        <p className="text-on-surface-variant font-sans text-sm mb-12 text-center">
          Last updated: 12 April 2026
        </p>

        <div className="space-y-10 text-on-surface/80 font-sans leading-relaxed text-sm">

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">1. Right of Withdrawal (EU 14-Day Cooling-Off Period)</h2>
            <p>
              As a consumer within the European Union, you have the right to withdraw from your purchase
              without giving any reason within 14 calendar days of the day on which you, or a third party
              you have nominated, take physical possession of the goods. This right is provided under EU
              Directive 2011/83/EU on consumer rights, transposed into French law.
            </p>
            <p className="mt-3">
              To exercise your right of withdrawal, you must inform us of your decision to withdraw by an
              unequivocal statement (for example, a letter sent by post or an email). You may use the
              model withdrawal form below, but it is not obligatory.
            </p>
            <div className="mt-4 bg-surface-container-low rounded-lg p-6 text-on-surface/70 italic text-xs leading-relaxed">
              <p className="font-medium not-italic text-on-surface/90 mb-2">Model Withdrawal Form</p>
              <p>
                To: {COMPANY_LEGAL_NAME}, {COMPANY_REGISTERED_OFFICE} — hello@terravoa.com
                <br /><br />
                I hereby give notice that I withdraw from my contract of sale of the following goods:
                [description of goods] / ordered on [date] / received on [date].
                <br /><br />
                Name of consumer: ___________
                <br />
                Address of consumer: ___________
                <br />
                Signature (if paper form): ___________ Date: ___________
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">2. Exceptions — Perishable &amp; Personalised Products</h2>
            <p>
              The right of withdrawal does not apply to the following categories, in accordance with
              Art. L221-28 of the French Consumer Code:
            </p>
            <ul className="mt-3 space-y-2 ml-4">
              <li>
                <strong className="text-on-surface/90">Perishable food products:</strong>{' '}
                Goods that are liable to deteriorate or expire rapidly — including fresh produce, chilled
                items, fresh cheese, and any product with a short use-by date — cannot be returned.
              </li>
              <li>
                <strong className="text-on-surface/90">Sealed goods opened after delivery:</strong>{' '}
                Products that are not suitable for return for health or hygiene reasons where the seal has
                been broken after delivery (for example, vacuum-packed charcuterie or specialty oils once
                opened).
              </li>
              <li>
                <strong className="text-on-surface/90">Personalised or custom orders:</strong>{' '}
                Products that have been made to your specification or clearly personalised.
              </li>
            </ul>
            <p className="mt-3">
              Dry goods and non-perishable products (such as preserves, wines, and spirits) that remain
              sealed and in their original condition are eligible for return under the standard 14-day
              withdrawal right.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">3. Return Process</h2>
            <p>To initiate a return, please follow these steps:</p>
            <ol className="mt-3 space-y-3 ml-4">
              <li className="flex gap-3">
                <span className="font-serif text-secondary shrink-0">1.</span>
                Contact us at{' '}
                <a href="mailto:hello@terravoa.com" className="text-secondary hover:underline">
                  hello@terravoa.com
                </a>{' '}
                within 14 days of receiving your order. Include your order number and the item(s) you wish
                to return.
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-secondary shrink-0">2.</span>
                We will acknowledge your request within 2 business days and provide return instructions,
                including a return address and, where applicable, a pre-paid shipping label.
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-secondary shrink-0">3.</span>
                Pack the item securely in its original packaging, ensuring it is protected during transit.
                You are responsible for the goods until they are received by the producer.
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-secondary shrink-0">4.</span>
                Ship the return within 14 days of notifying us of your withdrawal. Unless we have offered
                to collect the goods, the cost of return shipping is borne by you unless the item is
                faulty or incorrectly sent.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">4. Refunds</h2>
            <p>
              Once we have received the returned goods and verified their condition, we will process your
              refund without undue delay, and no later than 14 days from the date we receive the goods
              back or from the date you provide evidence of having sent the goods, whichever is earlier.
            </p>
            <p className="mt-3">
              Refunds are issued to the original payment method used at checkout. Depending on your bank
              or payment provider, it may take an additional 3–10 business days for the credit to appear
              on your statement.
            </p>
            <p className="mt-3">
              The refund will include the full price of the returned product and the standard delivery costs
              you originally paid. We are not required to refund supplementary costs if you chose an express
              or premium delivery option.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-primary mt-10 mb-3">5. Damaged or Incorrectly Sent Goods</h2>
            <p>
              If your order arrives damaged, defective, or does not match what you ordered, please contact
              us within 48 hours of delivery. Provide your order number and photographs clearly showing the
              damage or discrepancy.
            </p>
            <p className="mt-3">
              In such cases, we will offer you the choice of a full refund (including any shipping costs) or
              a replacement, at no additional cost to you. We will also arrange and cover the cost of return
              shipping where the goods need to be sent back.
            </p>
            <p className="mt-3">
              Your statutory rights under French and EU consumer law are not affected by anything in this policy.
            </p>
          </section>

          <div className="mt-10 bg-surface-container-low rounded-xl p-8 text-center">
            <p className="font-serif text-xl text-primary mb-3">Ready to start a return?</p>
            <p className="text-on-surface/70 font-sans text-sm mb-6">
              Use our return request form — we'll respond within 2 business days with next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/account/returns/new"
                className="font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
              >
                Request a return
              </Link>
              <a
                href="mailto:hello@terravoa.com"
                className="font-sans text-xs uppercase tracking-wider border border-outline-variant/40 text-on-surface-variant px-6 py-2.5 rounded-full hover:bg-surface-container transition-colors"
              >
                Email us instead
              </a>
            </div>
          </div>

        </div>
      </div>
    </PageContainer>
  )
}
