export default function Table({ colunas, linhas, acoes }) {
  if (!linhas.length) return <p className="p-4 text-slate-500">Nada por aqui ainda.</p>
  return (<div className="overflow-x-auto rounded border bg-white"><table className="w-full text-left text-sm">
    <thead className="bg-slate-100"><tr>{colunas.map((c) => <th key={c.key} className="px-3 py-2">{c.label}</th>)}{acoes && <th />}</tr></thead>
    <tbody>{linhas.map((l, i) => (<tr key={i} className="border-t">
      {colunas.map((c) => <td key={c.key} className="px-3 py-2">{String(l[c.key] ?? '')}</td>)}
      {acoes && <td className="px-3 py-2 text-right">{acoes(l)}</td>}</tr>))}</tbody></table></div>)
}
