// O registro real é feito no servidor (Apps Script) em cada ação, para não
// poder ser burlado pelo navegador. Aqui fica só a consulta (Admin).
import { listar } from './sheetsService'
export const listarAuditoria = (filtro) => listar('Audit_Log', filtro)
