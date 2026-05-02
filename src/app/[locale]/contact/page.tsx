import type { Metadata } from 'next'
import { ContactClient } from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact — Terravoa',
  description: 'Get in touch with Terravoa. Whether you\'re a producer, a customer, or simply curious — we\'d love to hear from you.',
}

export default function ContactPage() {
  return <ContactClient />
}
