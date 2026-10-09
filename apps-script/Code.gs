/**
 * API da planilha Compras. Publicar como Web App:
 *  Executar como: Eu | Quem tem acesso: Qualquer pessoa
 * (a segurança vem da validação do token do Firebase em cada chamada).
 * Propriedades do script: FIREBASE_API_KEY, SPREADSHEET_ID
 */
const P = PropertiesService.getScriptProperties();
const ss = () => SpreadsheetApp.openById(P.getProperty('SPREADSHEET_ID'));

function doPost(e) {
  try {
    const { token, action, payload } = JSON.parse(e.postData.contents);
    const u = autenticar(token);
    const h = HANDLERS[action];
    if (!h) throw new Error('Ação desconhecida');
    return json({ ok: true, data: h(u, payload || {}) });
  } catch (err) { return json({ ok: false, error: String(err.message || err) }); }
}
const json = (o) => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

// ---------- autenticação ----------
function autenticar(idToken) {
  const r = UrlFetchApp.fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + P.getProperty('FIREBASE_API_KEY'),
    { method: 'post', contentType: 'application/json', payload: JSON.stringify({ idToken }), muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) throw new Error('Sessão inválida');
  const fb = JSON.parse(r.getContentText()).users[0];
  const row = lerAba('Usuarios').find((x) => String(x.email).toLowerCase() === fb.email.toLowerCase());
  if (!row || String(row.status).toLowerCase() !== 'ativo') throw new Error('Usuário não cadastrado ou inativo');
  if (!row.uid_firebase) atualizar('Usuarios', 'email', row.email, { uid_firebase: fb.localId });
  return { uid: fb.localId, nome: row.nome, email: row.email, id_filial: row.id_filial, perfis: parsePerfis(row.perfil) };
}
function parsePerfis(v) {
  const s = String(v || '').trim();
  if (s.startsWith('[')) return JSON.parse(s);
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}
const tem = (u, ...r) => u.perfis.includes('Admin') || r.some((x) => u.perfis.includes(x));
const exige = (u, ...r) => { if (!tem(u, ...r)) throw new Error('Sem permissão'); };

// ---------- helpers de planilha ----------
function lerAba(nome) {
  const sh = ss().getSheetByName(nome); const v = sh.getDataDisplayValues();
  const cab = v[0]; return v.slice(1).filter((r) => r.some(String)).map((r) => Object.fromEntries(cab.map((c, i) => [c, r[i]])));
}
function inserir(nome, obj) {
  const sh = ss().getSheetByName(nome); const cab = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  sh.appendRow(cab.map((c) => (obj[c] !== undefined ? obj[c] : '')));
}
function atualizar(nome, chave, valor, campos) {
  const sh = ss().getSheetByName(nome); const v = sh.getDataRange().getValues(); const cab = v[0]; const ci = cab.indexOf(chave);
  for (let i = 1; i < v.length; i++) if (String(v[i][ci]) === String(valor)) {
    Object.keys(campos).forEach((k) => { const c = cab.indexOf(k); if (c >= 0) sh.getRange(i + 1, c + 1).setValue(campos[k]); });
    return true;
  }
  throw new Error('Registro não encontrado: ' + valor);
}
function proximoId(prefixo, aba, col) {
  const ano = new Date().getFullYear(); const usados = lerAba(aba).map((r) => r[col]).filter((x) => String(x).startsWith(prefixo + '-' + ano));
  return prefixo + '-' + ano + '-' + String(usados.length + 1).padStart(4, '0');
}
const seqNum = (aba, col) => lerAba(aba).reduce((m, r) => Math.max(m, Number(r[col]) || 0), 0) + 1;
const tz = Session.getScriptTimeZone();
const hoje = () => Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
function audit(u, modulo, id, acao, desc) {
  inserir('Audit_Log', { id_log: seqNum('Audit_Log', 'id_log'), data: hoje(), hora: Utilities.formatDate(new Date(), tz, 'HH:mm:ss'),
    uid_usuario: u.uid, email_usuario: u.email, modulo, id_item: id, acao, descricao_detalhada: desc });
}

// ---------- ações ----------
const HANDLERS = {
  me: (u) => u,

  list: (u, { aba, filtro = {} }) => {
    const LIVRE = ['Cat_Materiais_Servicos'];
    let rows = lerAba(aba);
    if (aba === 'Audit_Log' || aba === 'Usuarios') exige(u, 'Admin');
    if (aba === 'Solicitacoes' || aba === 'Itens_Solicitacao') {
      if (!tem(u, 'Admin', 'Cotador')) {
        if (tem(u, 'Aprovador') && filtro.id_filial === u.id_filial && filtro.status) filtro = { ...filtro, id_filial: u.id_filial };
        else filtro = { ...filtro, id_solicitante: u.uid };
      }
    }
    if (aba === 'Cotacoes') exige(u, 'Cotador');
    if (aba === 'Sugestoes_Novos_Itens' && !tem(u, 'Cadastrador')) filtro = { ...filtro, id_solicitante: u.uid };
    if (!LIVRE.includes(aba) && !['Solicitacoes','Itens_Solicitacao','Cotacoes','Sugestoes_Novos_Itens','Audit_Log','Usuarios','Filiais'].includes(aba)) throw new Error('Aba inválida');
    return rows.filter((r) => Object.keys(filtro).every((k) => String(r[k]) === String(filtro[k])));
  },

  criarSolicitacao: (u, { tipo, itens }) => {
    exige(u, 'Solicitante');
    const id = proximoId('SOL', 'Solicitacoes', 'id_solicitacao');
    inserir('Solicitacoes', { id_solicitacao: id, tipo, id_solicitante: u.uid, id_filial: u.id_filial, data_solicitacao: hoje(), status: 'Pendente Aprovação' });
    itens.forEach((i) => inserir('Itens_Solicitacao', { id_item_solicitacao: seqNum('Itens_Solicitacao', 'id_item_solicitacao'), id_solicitacao: id, ...i }));
    audit(u, 'Solicitacoes', id, 'CRIAR', 'Solicitação de ' + tipo + ' com ' + itens.length + ' item(ns)');
    return { id };
  },

  decidirSolicitacao: (u, { id, aprovado, motivo }) => {
    exige(u, 'Aprovador');
    const s = lerAba('Solicitacoes').find((r) => r.id_solicitacao === id);
    if (!s || s.status !== 'Pendente Aprovação') throw new Error('Solicitação não está pendente');
    if (!tem(u, 'Admin') && s.id_filial !== u.id_filial) throw new Error('Solicitação de outra filial');
    if (!aprovado && !motivo) throw new Error('Informe o motivo');
    const novo = aprovado ? 'Aprovado' : 'Reprovado';
    atualizar('Solicitacoes', 'id_solicitacao', id, { status: novo, id_aprovador: u.uid, data_aprovacao: hoje(), motivo_rejeicao: motivo || '' });
    audit(u, 'Solicitacoes', id, aprovado ? 'APROVAR' : 'REPROVAR', (motivo || 'Aprovada') + ' | anterior: Pendente Aprovação | novo: ' + novo);
    return { status: novo };
  },

  criarSugestao: (u, d) => {
    exige(u, 'Solicitante');
    const n = lerAba('Sugestoes_Novos_Itens').length + 1; const idS = 'SUG-' + String(n).padStart(4, '0');
    inserir('Sugestoes_Novos_Itens', { id_sugestao: idS, data_sugestao: hoje(), tipo: d.tipo, nome_sugerido: d.nome_sugerido, categoria_sugerida: d.categoria_sugerida,
      unidade_medida: d.unidade_medida, justificativa: d.justificativa, id_solicitante: u.uid, id_filial: u.id_filial, status: 'Pendente' });
    audit(u, 'Sugestoes', idS, 'SUGERIR_ITEM', d.tipo + ': ' + d.nome_sugerido);
    return { id: idS };
  },

  analisarSugestao: (u, { id, aceitar, motivo_rejeicao }) => {
    exige(u, 'Cadastrador');
    const s = lerAba('Sugestoes_Novos_Itens').find((r) => r.id_sugestao === id);
    if (!s || s.status !== 'Pendente') throw new Error('Sugestão não está pendente');
    let idItem = '';
    if (aceitar) {
      idItem = seqNum('Cat_Materiais_Servicos', 'id_item');
      inserir('Cat_Materiais_Servicos', { id_item: idItem, tipo: s.tipo, descricao: s.nome_sugerido, categoria: s.categoria_sugerida, unidade_medida: s.unidade_medida, status: 'Ativo', data_cadastro: hoje() });
    }
    atualizar('Sugestoes_Novos_Itens', 'id_sugestao', id, { status: aceitar ? 'Aprovado/Cadastrado' : 'Rejeitado', id_item_cadastrado: idItem, id_cadastrador: u.uid, data_analise: hoje(), motivo_rejeicao: motivo_rejeicao || '' });
    audit(u, 'Catalogo', id, 'EDITAR', aceitar ? 'Sugestão aceita → item ' + idItem : 'Sugestão rejeitada: ' + motivo_rejeicao);
    return { id_item: idItem };
  },

  salvarCotacao: (u, d) => {
    exige(u, 'Cotador');
    const s = lerAba('Solicitacoes').find((r) => r.id_solicitacao === d.id_solicitacao);
    if (!s || !['Aprovado', 'Em Cotação'].includes(s.status)) throw new Error('Solicitação não está disponível para cotação');
    const idC = 'COT-' + String(lerAba('Cotacoes').length + 1).padStart(4, '0');
    inserir('Cotacoes', { ...d, id_cotacao: idC, id_cotador: u.uid, status_cotacao: 'Em Análise', data_cotacao: hoje() });
    if (s.status === 'Aprovado') atualizar('Solicitacoes', 'id_solicitacao', d.id_solicitacao, { status: 'Em Cotação' });
    audit(u, 'Cotacoes', idC, 'COTAR', d.fornecedor_nome + ' - R$ ' + d.valor_total);
    return { id: idC };
  },

  escolherVencedora: (u, { idCotacao, idSolicitacao }) => {
    exige(u, 'Cotador');
    lerAba('Cotacoes').filter((c) => c.id_solicitacao === idSolicitacao).forEach((c) =>
      atualizar('Cotacoes', 'id_cotacao', c.id_cotacao, { status_cotacao: c.id_cotacao === idCotacao ? 'Vencedora' : 'Rejeitada' }));
    atualizar('Solicitacoes', 'id_solicitacao', idSolicitacao, { status: 'Finalizado' });
    audit(u, 'Cotacoes', idCotacao, 'COTAR', 'Vencedora da ' + idSolicitacao + ' | novo status: Finalizado');
    return { ok: true };
  },
};
