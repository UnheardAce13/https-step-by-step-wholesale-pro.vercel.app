import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { ConditionalLayout } from "@/components/conditional-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "S.B.S.W.P 2.0 - Step-By-Step Wholesale Pro",
  description: "The ultimate real estate investment platform with AI-powered deal analysis, agent management, and comprehensive CRM.",
  keywords: "real estate, wholesale, investment, CRM, property analysis, AI, deal flow",
  authors: [{ name: "S.B.S.W.P Team" }],
  creator: "S.B.S.W.P",
  publisher: "S.B.S.W.P",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sbswp.com'),
  openGraph: {
    title: "S.B.S.W.P 2.0 - Ultimate Real Estate Platform",
    description: "Advanced real estate investment platform that annihilates all competition",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "S.B.S.W.P 2.0 - Ultimate Real Estate Platform",
    description: "Advanced real estate investment platform that annihilates all competition",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
