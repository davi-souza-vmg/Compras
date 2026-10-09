import { useAuth } from '../../context/AuthContext'
import { logout } from '../../services/authService'
export default function Header() {
  const { usuario } = useAuth()
  return (<header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm">
    <h1 className="text-lg font-semibold">Compras e Cotações</h1>
    <div className="flex items-center gap-3 text-sm"><span className="hidden sm:inline">{usuario?.nome}</span>
      <button onClick={logout} className="rounded border px-3 py-1">Sair</button></div></header>)
}
