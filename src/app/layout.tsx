import type { Metadata } from 'next'
import WatercolorDefs from '@/components/ui/WatercolorDefs'
import { PHProvider } from './providers'
import PostHogPageView from './PostHogPageView'
import './globals.css'

export const metadata: Metadata = {
  title: 'StudyBrew NYC',
  description: 'Find the best café study spots in New York City.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <PHProvider>
          <PostHogPageView />
          <WatercolorDefs />
          {children}
        </PHProvider>
      </body>
    </html>
  )
}
