import { useAuth } from '../../context/AuthContext'
import { useSheet } from '../../hooks/useSheet'
import { decidirSolicitacao } from '../../services/sheetsService'
import Table from '../../components/common/Table'
export default function AprovacoesPendentes() {
  const { usuario } = useAuth()
  const { dados, loading, recarregar } = useSheet('Solicitacoes', { status: 'Pendente Aprovação', id_filial: usuario.id_filial })
  const decidir = async (id, ok) => {
    let motivo = ''
    if (!ok) { motivo = prompt('Motivo da reprovação:') || ''; if (!motivo) return }
    await decidirSolicitacao(id, ok, motivo); recarregar()
  }
  if (loading) return <p>Carregando…</p>
  return <Table colunas={[{key:'id_solicitacao',label:'ID'},{key:'tipo',label:'Tipo'},{key:'id_solicitante',label:'Solicitante'},{key:'data_solicitacao',label:'Data'}]} linhas={dados}
    acoes={(l) => (<span className="space-x-2"><button onClick={() => decidir(l.id_solicitacao, true)} className="rounded bg-green-600 px-2 py-1 text-white">Aprovar</button>
      <button onClick={() => decidir(l.id_solicitacao, false)} className="rounded bg-red-600 px-2 py-1 text-white">Reprovar</button></span>)} />
}
