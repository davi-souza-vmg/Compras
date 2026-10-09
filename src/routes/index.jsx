import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
function Protegida({ roles, children }) {
  const { usuario, carregando, hasRole } = useAuth()
  if (carregando) return <p className="p-6">Carregando…</p>
  if (!usuario) return <Navigate to="/login" replace />
  if (roles && !hasRole(...roles)) return <Navigate to="/" replace />
  return children
}
export default function AppRoutes() {
  return (<Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Protegida><Dashboard /></Protegida>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>)
}
