import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/hooks/use-toast'
import { AlertModalProvider } from '@/hooks/use-alert-modal'
import { AIAssistProvider } from '@/contexts/ai-assist-context'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Model Card Generator | Society of Actuaries',
  description: 'Create comprehensive model cards for ML models following the Google Model Card standard',
  icons: {
    icon: '/favicon.svg',
  },
}

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AlertModalProvider>
            <ToastProvider>
              <AIAssistProvider>
                {children}
              </AIAssistProvider>
            </ToastProvider>
          </AlertModalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
