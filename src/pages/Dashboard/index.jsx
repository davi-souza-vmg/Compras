import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Header from '../../components/layout/Header'
import MinhasSolicitacoes from '../Solicitacoes/MinhasSolicitacoes'
import AprovacoesPendentes from '../Solicitacoes/AprovacoesPendentes'
import CatalogoSugestoes from '../Catalogo'
import AguardandoCotacao from '../Cotacoes'
import VisaoGeral from './VisaoGeral'
import Fab from '../Solicitacoes/Fab'

const ABAS = [
  { id: 'min', label: 'Minhas Solicitações', roles: ['Solicitante'], C: MinhasSolicitacoes },
  { id: 'apr', label: 'Aprovações Pendentes', roles: ['Aprovador'], C: AprovacoesPendentes },
  { id: 'cat', label: 'Catálogo & Sugestões', roles: ['Cadastrador'], C: CatalogoSugestoes },
  { id: 'cot', label: 'Aguardando Cotação', roles: ['Cotador'], C: AguardandoCotacao },
  { id: 'adm', label: 'Visão Geral', roles: ['Admin'], C: VisaoGeral },
]
export default function Dashboard() {
  const { usuario, hasRole } = useAuth()
  const visiveis = ABAS.filter((a) => a.roles.some((r) => usuario.perfis.includes(r)))
  const [ativa, setAtiva] = useState(visiveis[0]?.id)
  const Atual = visiveis.find((a) => a.id === ativa)?.C
  return (<div className="min-h-screen"><Header />
    <nav className="flex gap-1 overflow-x-auto border-b bg-white px-2">{visiveis.map((a) => (
      <button key={a.id} onClick={() => setAtiva(a.id)}
        className={`whitespace-nowrap px-3 py-2 text-sm ${ativa === a.id ? 'border-b-2 border-blue-600 font-medium' : 'text-slate-500'}`}>{a.label}</button>))}</nav>
    <main className="p-4">{Atual ? <Atual /> : <p>Seu usuário ainda não tem perfil. Fale com um Admin.</p>}</main>
    {hasRole('Solicitante') && <Fab />}</div>)
}
