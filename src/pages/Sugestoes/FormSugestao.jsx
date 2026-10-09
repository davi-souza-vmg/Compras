import { useState } from 'react'
import { criarSugestao } from '../../services/sheetsService'
export default function FormSugestao({ onDone }) {
  const [f, setF] = useState({ tipo: 'Material', nome_sugerido: '', categoria_sugerida: '', unidade_medida: '', justificativa: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const enviar = async (e) => { e.preventDefault(); await criarSugestao(f); onDone() }
  return (<form onSubmit={enviar} className="space-y-3">
    <select value={f.tipo} onChange={set('tipo')} className="w-full rounded border p-2"><option>Material</option><option>Serviço</option></select>
    <input required placeholder="Nome do item" value={f.nome_sugerido} onChange={set('nome_sugerido')} className="w-full rounded border p-2" />
    <input placeholder="Categoria sugerida" value={f.categoria_sugerida} onChange={set('categoria_sugerida')} className="w-full rounded border p-2" />
    <input required placeholder="Unidade de medida (un, kg, hora…)" value={f.unidade_medida} onChange={set('unidade_medida')} className="w-full rounded border p-2" />
    <textarea required placeholder="Justificativa da necessidade" value={f.justificativa} onChange={set('justificativa')} className="w-full rounded border p-2" />
    <button className="w-full rounded bg-blue-600 py-2 text-white">Enviar sugestão</button></form>)
}
