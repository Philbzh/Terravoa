import { Resend } from 'resend'
import { SITE_NAME } from '@/lib/constants'
import { absoluteUrl } from '@/lib/site-url'
import { escapeHtml } from '@/lib/email/escape-html'

function emailFrom() {
  return process.env.EMAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`
}

const strings = {
  en: {
    subject: `Welcome to ${SITE_NAME}`,
    heading: "You're on the list.",
    body: 'Thank you for subscribing. Each month, we send a short dispatch — new producers, seasonal finds, and the stories behind them.',
    cta: 'Explore the collection',
    signoff: `The ${SITE_NAME} team`,
  },
  de: {
    subject: `Willkommen bei ${SITE_NAME}`,
    heading: 'Sie sind dabei.',
    body: 'Vielen Dank für Ihre Anmeldung. Jeden Monat senden wir einen kurzen Brief — neue Produzenten, saisonale Entdeckungen und die Geschichten dahinter.',
    cta: 'Kollektion entdecken',
    signoff: `Das ${SITE_NAME}-Team`,
  },
  fr: {
    subject: `Bienvenue chez ${SITE_NAME}`,
    heading: 'Vous êtes inscrit(e).',
    body: 'Merci de votre inscription. Chaque mois, nous envoyons une courte lettre — nouveaux producteurs, trouvailles de saison et les histoires qui les accompagnent.',
    cta: 'Explorer la collection',
    signoff: `L’équipe ${SITE_NAME}`,
  },
  es: {
    subject: `Bienvenido/a a ${SITE_NAME}`,
    heading: 'Ya estás en la lista.',
    body: 'Gracias por suscribirte. Cada mes enviamos un breve despacho — nuevos productores, hallazgos de temporada y las historias detrás de ellos.',
    cta: 'Explorar la colección',
    signoff: `El equipo de ${SITE_NAME}`,
  },
  it: {
    subject: `Benvenuto/a in ${SITE_NAME}`,
    heading: 'Sei nella lista.',
    body: "Grazie per l'iscrizione. Ogni mese inviamo un breve dispaccio — nuovi produttori, scoperte stagionali e le storie che li accompagnano.",
    cta: 'Esplora la collezione',
    signoff: `Il team ${SITE_NAME}`,
  },
  pt: {
    subject: `Bem-vindo/a à ${SITE_NAME}`,
    heading: 'Está na lista.',
    body: 'Obrigado/a pela subscrição. Todos os meses enviamos um breve despacho — novos produtores, descobertas sazonais e as histórias por detrás deles.',
    cta: 'Explorar a coleção',
    signoff: `A equipa ${SITE_NAME}`,
  },
} as const

type Locale = keyof typeof strings

function resolveLocale(raw?: string | null): Locale {
  if (raw && raw in strings) return raw as Locale
  return 'en'
}

export async function sendNewsletterWelcome(opts: { to: string; locale?: string | null }) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn('[email] RESEND_API_KEY not set; skipping newsletter welcome')
    return
  }

  const t = strings[resolveLocale(opts.locale)]
  const collectionUrl = absoluteUrl('/collection')

  const html = `
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:sans-serif;">
    <p style="font-family:Georgia,serif;font-size:22px;color:#1a1a1a;margin:0 0 20px;">
      ${escapeHtml(t.heading)}
    </p>
    <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 24px;">
      ${escapeHtml(t.body)}
    </p>
    <a href="${escapeHtml(collectionUrl)}"
       style="display:inline-block;background:#2d5016;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500;">
      ${escapeHtml(t.cta)}
    </a>
    <p style="font-size:13px;color:#888;margin:32px 0 0;">
      ${escapeHtml(t.signoff)}
    </p>
  </div>`

  const resend = new Resend(key)
  const { error } = await resend.emails.send({
    from: emailFrom(),
    to: opts.to,
    subject: t.subject,
    html,
  })
  if (error) console.error('[email] newsletter welcome error:', error.message)
}
