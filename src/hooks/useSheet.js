import { useCallback, useEffect, useState } from 'react'
import { listar } from '../services/sheetsService'
export function useSheet(aba, filtro) {
  const [dados, setDados] = useState([]); const [loading, setLoading] = useState(true); const [erro, setErro] = useState('')
  const key = JSON.stringify(filtro || {})
  const recarregar = useCallback(async () => {
    setLoading(true)
    try { setDados(await listar(aba, filtro)); setErro('') } catch (e) { setErro(e.message) }
    setLoading(false)
  }, [aba, key])
  useEffect(() => { recarregar() }, [recarregar])
  return { dados, loading, erro, recarregar }
}
