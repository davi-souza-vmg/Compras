import { useState } from 'react'
import { useSheet } from '../../hooks/useSheet'
import { criarSolicitacao } from '../../services/sheetsService'
export default function FormSolicitacao({ tipo, onDone }) {
  const { dados: catalogo } = useSheet('Cat_Materiais_Servicos', { tipo, status: 'Ativo' })
  const [f, setF] = useState({ id_item: '', quantidade: 1, urgencia: 'Média', observacao_item: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const enviar = async (e) => { e.preventDefault(); await criarSolicitacao({ tipo, itens: [f] }); onDone() }
  return (<form onSubmit={enviar} className="space-y-3">
    <select required value={f.id_item} onChange={set('id_item')} className="w-full rounded border p-2">
      <option value="">Selecione o item…</option>{catalogo.map((c) => <option key={c.id_item} value={c.id_item}>{c.descricao} ({c.unidade_medida})</option>)}</select>
    <input type="number" min="1" required value={f.quantidade} onChange={set('quantidade')} className="w-full rounded border p-2" />
    <select value={f.urgencia} onChange={set('urgencia')} className="w-full rounded border p-2">{['Baixa','Média','Alta'].map((u) => <option key={u}>{u}</option>)}</select>
    <textarea placeholder="Observação / detalhamento" value={f.observacao_item} onChange={set('observacao_item')} className="w-full rounded border p-2" />
    <button className="w-full rounded bg-blue-600 py-2 text-white">Enviar solicitação</button></form>)
}
