import type React from "react"
import type { Metadata } from "next"
import { Inter, Amiri } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import {ClerkProvider} from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] })
const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
})

export const metadata: Metadata = {
  title: "ilm - Knowledge, Visualized",
  description: "Transform educational topics into comprehensive explanations and visual content",
  icons : 'logo.png'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${inter.className} ${amiri.variable} bg-primary-50`}>{children} <Toaster position="top-center" richColors/></body>
    </html>
    </ClerkProvider>
  )
}
