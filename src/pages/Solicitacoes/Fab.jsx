import { useState } from 'react'
import Modal from '../../components/common/Modal'
import FormSolicitacao from './FormSolicitacao'
import FormSugestao from '../Sugestoes/FormSugestao'
export default function Fab() {
  const [menu, setMenu] = useState(false); const [modal, setModal] = useState(null)
  const abrir = (m) => { setModal(m); setMenu(false) }
  return (<>
    {menu && <div className="fixed bottom-20 right-4 z-40 w-56 space-y-1 rounded-xl bg-white p-2 shadow-lg">
      {[['Material','Solicitar Material'],['Serviço','Solicitar Serviço'],['sugestao','Sugerir Novo Material / Serviço']].map(([k, l]) => (
        <button key={k} onClick={() => abrir(k)} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-slate-100">{l}</button>))}</div>}
    <button onClick={() => setMenu(!menu)} aria-label="Nova solicitação" className="fixed bottom-4 right-4 z-40 h-14 w-14 rounded-full bg-blue-600 text-2xl text-white shadow-lg">+</button>
    {modal && <Modal titulo={modal === 'sugestao' ? 'Sugerir novo item' : `Solicitar ${modal}`} onClose={() => setModal(null)}>
      {modal === 'sugestao' ? <FormSugestao onDone={() => setModal(null)} /> : <FormSolicitacao tipo={modal} onDone={() => setModal(null)} />}</Modal>}</>)
}
