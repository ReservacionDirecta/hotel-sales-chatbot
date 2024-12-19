import './globals.css'
import { Inter } from 'next/font/google'
import { Layout } from '@/components/Layout'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hotel Sales Chatbot - Panel de Administración',
  description: 'Panel de administración para el chatbot de ventas hoteleras',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Layout>{children}</Layout>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
