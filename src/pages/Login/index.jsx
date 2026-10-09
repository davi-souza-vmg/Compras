import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { loginComGoogle } from '../../services/authService'
export default function Login() {
  const { usuario, erro } = useAuth()
  if (usuario) return <Navigate to="/" replace />
  return (<main className="grid min-h-screen place-items-center p-4"><div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow">
    <h1 className="mb-4 text-xl font-semibold">Compras e Cotações</h1>
    <button onClick={loginComGoogle} className="w-full rounded bg-blue-600 py-2 text-white">Entrar com Google</button>
    {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}</div></main>)
}
