import { useSheet } from '../../hooks/useSheet'
import { analisarSugestao } from '../../services/sheetsService'
import Table from '../../components/common/Table'
export default function CatalogoSugestoes() {
  const cat = useSheet('Cat_Materiais_Servicos'); const sug = useSheet('Sugestoes_Novos_Itens', { status: 'Pendente' })
  const analisar = async (id, aceitar) => {
    const motivo = aceitar ? '' : prompt('Motivo da rejeição:') || ''
    if (!aceitar && !motivo) return
    await analisarSugestao(id, aceitar, { motivo_rejeicao: motivo }); sug.recarregar(); cat.recarregar()
  }
  return (<div className="space-y-6">
    <section><h2 className="mb-2 font-semibold">Sugestões pendentes</h2>
      <Table colunas={[{key:'id_sugestao',label:'ID'},{key:'tipo',label:'Tipo'},{key:'nome_sugerido',label:'Item'},{key:'justificativa',label:'Justificativa'}]} linhas={sug.dados}
        acoes={(l) => (<span className="space-x-2"><button onClick={() => analisar(l.id_sugestao, true)} className="rounded bg-green-600 px-2 py-1 text-white">Cadastrar</button>
          <button onClick={() => analisar(l.id_sugestao, false)} className="rounded bg-red-600 px-2 py-1 text-white">Rejeitar</button></span>)} /></section>
    <section><h2 className="mb-2 font-semibold">Catálogo oficial</h2>
      <Table colunas={[{key:'id_item',label:'ID'},{key:'tipo',label:'Tipo'},{key:'descricao',label:'Descrição'},{key:'categoria',label:'Categoria'},{key:'unidade_medida',label:'Un.'},{key:'status',label:'Status'}]} linhas={cat.dados} /></section></div>)
}
