import { AuthGate } from '@/components/auth/AuthGate'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // App layout with AuthGate - requires authentication
  return <AuthGate>{children}</AuthGate>
}
