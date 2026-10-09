// Toda leitura/escrita passa pelo Apps Script, que valida o token do Firebase.
import { SHEETS_API_URL } from '../config/firebase'
import { getIdToken } from './authService'

async function call(action, payload = {}) {
  const token = await getIdToken()
  // text/plain evita preflight CORS no Apps Script
  const res = await fetch(SHEETS_API_URL, {
    method: 'POST', headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ token, action, payload }),
  })
  const json = await res.json()
  if (!json.ok) throw new Error(json.error || 'Erro na API')
  return json.data
}
export const getMe = () => call('me')
export const listar = (aba, filtro) => call('list', { aba, filtro })
export const criarSolicitacao = (dados) => call('criarSolicitacao', dados)
export const decidirSolicitacao = (id, aprovado, motivo) => call('decidirSolicitacao', { id, aprovado, motivo })
export const criarSugestao = (dados) => call('criarSugestao', dados)
export const analisarSugestao = (id, aceitar, dados) => call('analisarSugestao', { id, aceitar, ...dados })
export const salvarCotacao = (dados) => call('salvarCotacao', dados)
export const escolherVencedora = (idCotacao, idSolicitacao) => call('escolherVencedora', { idCotacao, idSolicitacao })
