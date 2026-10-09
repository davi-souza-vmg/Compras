import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { getMe } from '../services/sheetsService'
const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null) // {uid,nome,email,perfis[],id_filial}
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  useEffect(() => onAuthStateChanged(auth, async (fu) => {
    setErro('')
    if (!fu) { setUsuario(null); setCarregando(false); return }
    try { setUsuario(await getMe()) }
    catch (e) { setErro(e.message); setUsuario(null) }
    setCarregando(false)
  }), [])
  const hasRole = (...r) => !!usuario && (usuario.perfis.includes('Admin') || r.some((x) => usuario.perfis.includes(x)))
  return <Ctx.Provider value={{ usuario, carregando, erro, hasRole }}>{children}</Ctx.Provider>
}
