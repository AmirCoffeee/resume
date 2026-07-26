import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

interface Props {
  adminOnly?: boolean
}

export default function ProtectedRoute({ adminOnly = false }: Props) {
  const { token, user } = useAuthStore()

  if (!token) return <Navigate to="/login" replace />
  if (adminOnly && user?.role !== 'ADMIN') return <Navigate to="/" replace />

  return <Outlet />
}
