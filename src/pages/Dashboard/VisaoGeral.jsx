import { useState } from 'react'
import { useSheet } from '../../hooks/useSheet'
import Table from '../../components/common/Table'
export default function VisaoGeral() {
  const [status, setStatus] = useState('')
  const { dados, loading } = useSheet('Solicitacoes', status ? { status } : {})
  return (<div className="space-y-3">
    <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded border p-2 text-sm">
      <option value="">Todos os status</option>{['Pendente Aprovação','Aprovado','Reprovado','Em Cotação','Finalizado','Cancelado'].map((s) => <option key={s}>{s}</option>)}</select>
    {loading ? <p>Carregando…</p> : <Table colunas={[{key:'id_solicitacao',label:'ID'},{key:'tipo',label:'Tipo'},{key:'id_filial',label:'Filial'},{key:'status',label:'Status'}]} linhas={dados} />}</div>)
}
