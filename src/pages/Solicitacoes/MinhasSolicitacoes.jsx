import { useAuth } from '../../context/AuthContext'
import { useSheet } from '../../hooks/useSheet'
import Table from '../../components/common/Table'
export default function MinhasSolicitacoes() {
  const { usuario } = useAuth()
  const { dados, loading, erro } = useSheet('Solicitacoes', { id_solicitante: usuario.uid })
  if (loading) return <p>Carregando…</p>
  if (erro) return <p className="text-red-600">{erro}</p>
  return <Table colunas={[{key:'id_solicitacao',label:'ID'},{key:'tipo',label:'Tipo'},{key:'data_solicitacao',label:'Data'},{key:'status',label:'Status'}]} linhas={dados} />
}
