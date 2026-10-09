import { useState } from 'react'
import { useSheet } from '../../hooks/useSheet'
import { salvarCotacao, escolherVencedora } from '../../services/sheetsService'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
export default function AguardandoCotacao() {
  const sol = useSheet('Solicitacoes', { status: 'Aprovado' }); const [alvo, setAlvo] = useState(null)
  return (<><Table colunas={[{key:'id_solicitacao',label:'ID'},{key:'tipo',label:'Tipo'},{key:'id_filial',label:'Filial'},{key:'data_aprovacao',label:'Aprovada em'}]} linhas={sol.dados}
    acoes={(l) => <button onClick={() => setAlvo(l.id_solicitacao)} className="rounded border px-2 py-1">Cotar</button>} />
    {alvo && <Modal titulo={`Cotações de ${alvo}`} onClose={() => { setAlvo(null); sol.recarregar() }}><PainelCotacao id={alvo} /></Modal>}</>)
}
function PainelCotacao({ id }) {
  const cot = useSheet('Cotacoes', { id_solicitacao: id })
  const [f, setF] = useState({ fornecedor_nome: '', fornecedor_cnpj: '', valor_total: '', prazo_entrega_dias: '', condicao_pagamento: '', link_anexo_orcamento: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const add = async (e) => { e.preventDefault(); await salvarCotacao({ id_solicitacao: id, ...f }); cot.recarregar() }
  return (<div className="space-y-3">
    <Table colunas={[{key:'fornecedor_nome',label:'Fornecedor'},{key:'valor_total',label:'Valor'},{key:'prazo_entrega_dias',label:'Prazo'},{key:'status_cotacao',label:'Status'}]} linhas={cot.dados}
      acoes={(l) => <button onClick={async () => { await escolherVencedora(l.id_cotacao, id); cot.recarregar() }} className="rounded bg-green-600 px-2 py-1 text-white">Vencedora</button>} />
    <form onSubmit={add} className="space-y-2">{Object.keys(f).map((k) => <input key={k} required={k !== 'link_anexo_orcamento'} placeholder={k.replaceAll('_', ' ')} value={f[k]} onChange={set(k)} className="w-full rounded border p-2 text-sm" />)}
      <button className="w-full rounded bg-blue-600 py-2 text-white">Adicionar cotação</button></form></div>)
}
