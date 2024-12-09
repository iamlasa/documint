import './globals.css'
import { AuthProvider } from "@/components/providers/session-provider"
import { Toaster } from "@/components/ui/toaster"  // Make sure this import is correct

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />  {/* Make sure this is outside AuthProvider */}
      </body>
    </html>
  )
}