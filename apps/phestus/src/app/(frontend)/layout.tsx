import React from 'react'
import '@/styles/theme.css'
import { Header } from '@/components/frontend/header'
import { Footer } from '@/components/frontend/footer'
import { getPayload } from 'payload'
import config from '@payload-config'

export const metadata = {
  description:
    'A custom and modular web stack built for a new wave of software development',
  title: '@phestus',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const payload = await getPayload({ config })

  const navigation = await payload.findGlobal({
    slug: 'site-navigation',
    depth: 2,
  })

  if (!navigation.header || !navigation.footer) {
    throw new Error('Site navigation is not configured.')
  }

  return (
    <html lang="en">
      <body>
        <Header data={navigation.header} />

        <main>{children}</main>

        <Footer data={navigation.footer} />
      </body>
    </html>
  )
}