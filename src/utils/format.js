export const moeda = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const dataBR = (d) => (d ? new Date(d).toLocaleDateString('pt-BR') : '')
