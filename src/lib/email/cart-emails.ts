import { Resend } from 'resend'
import { SITE_NAME } from '@/lib/constants'
import { absoluteUrl } from '@/lib/site-url'
import { escapeHtml } from '@/lib/email/escape-html'

function emailFrom() {
  return process.env.EMAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`
}

type CartItem = {
  name?: string
  slug?: string
  quantity?: number
}

const SUBJECTS: Record<string, string> = {
  en: 'You left something behind',
  de: 'Du hast etwas vergessen',
  fr: 'Vous avez oublié quelque chose',
  es: 'Has dejado algo pendiente',
  it: 'Hai dimenticato qualcosa',
  pt: 'Esqueceu algo no carrinho',
}

export async function sendAbandonedCartReminder({
  to,
  locale,
  items,
}: {
  to: string
  locale: string
  items: CartItem[]
}) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.warn('[cart-emails] RESEND_API_KEY not set, skipping')
    return
  }

  const lang = SUBJECTS[locale] ? locale : 'en'
  const subject = SUBJECTS[lang]
  const cartUrl = absoluteUrl(`/${lang}/cart`)

  const itemListHtml = items
    .slice(0, 10)
    .map((item) => {
      const name = escapeHtml(item.name ?? 'Product')
      const qty = item.quantity ?? 1
      return `<li style="margin-bottom:8px;">${name} × ${qty}</li>`
    })
    .join('')

  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#faf9f6;">
  <div style="max-width:540px;margin:0 auto;padding:32px;font-family:system-ui,sans-serif;">
    <h1 style="font-family:Georgia,serif;font-size:24px;color:#182a1b;margin-bottom:16px;">
      ${subject}
    </h1>
    <p style="font-size:15px;color:#434842;line-height:1.6;">
      ${lang === 'de' ? 'Dein Warenkorb wartet auf dich:' : lang === 'fr' ? 'Votre panier vous attend :' : 'Your cart is waiting for you:'}
    </p>
    <ul style="font-size:14px;color:#1a1c1a;padding-left:20px;margin:16px 0;">
      ${itemListHtml}
    </ul>
    <a href="${cartUrl}" style="display:inline-block;background:#944925;color:#fff;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin-top:16px;">
      ${lang === 'de' ? 'Zum Warenkorb' : lang === 'fr' ? 'Voir mon panier' : 'Return to cart'}
    </a>
    <p style="font-size:12px;color:#737872;margin-top:24px;">
      ${lang === 'de' ? 'Diese E-Mail wurde automatisch gesendet. Wenn du deinen Einkauf abgeschlossen hast, ignoriere diese Nachricht.' : lang === 'fr' ? 'Cet e-mail a été envoyé automatiquement. Si vous avez finalisé votre achat, ignorez ce message.' : 'This email was sent automatically. If you have already completed your purchase, please ignore this message.'}
    </p>
  </div></body></html>`

  const resend = new Resend(resendKey)
  await resend.emails.send({
    from: emailFrom(),
    to,
    subject,
    html,
  })
}
