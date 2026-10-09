# Compras e Cotações

Webapp React (Vite + Tailwind) com login Google (Firebase Auth) e Google Sheets como banco,
acessado por uma API em Google Apps Script (`apps-script/Code.gs`) que valida o token do Firebase,
aplica as permissões por perfil e grava o `Audit_Log` no servidor.

## Antes de rodar: ajustes na planilha
1. **Usuarios**: adicionar a coluna `id_filial` (hoje não existe, e a aprovação por filial depende dela).
2. **Usuarios.perfil**: pode ser `Solicitante, Aprovador` ou JSON `["Solicitante","Aprovador"]`.
3. Cadastre seu e-mail em `Usuarios` com status `Ativo` e perfil `Admin`.
4. **Cat_Materiais_Servicos.status**: usar `Ativo` / `Inativo`.

## Passo a passo
1. Firebase Console: criar projeto, ativar Authentication > Google, copiar as chaves para `.env`.
2. Planilha: Extensões > Apps Script, colar `Code.gs`. Em Propriedades do script: `FIREBASE_API_KEY`, `SPREADSHEET_ID`.
3. Implantar > Nova implantação > App da Web (Executar como: eu; Acesso: qualquer pessoa). Copiar a URL `/exec` para `VITE_SHEETS_API_URL`.
4. `npm install && npm run dev`. Deploy: Vercel/Netlify/Firebase Hosting (lembre de autorizar o domínio no Firebase Auth).

## Estrutura
`src/{config,context,hooks,services,utils,routes,components,pages}` conforme a especificação.

## Publicar no GitHub Pages
1. Repositório > Settings > Pages > Source: **GitHub Actions**.
2. Settings > Secrets and variables > Actions > New repository secret: crie `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`, `VITE_SHEETS_API_URL`.
3. Firebase > Authentication > Settings > Authorized domains: adicionar `SEU-USUARIO.github.io`.
4. Faça push na branch `main`; a aba Actions mostra o andamento e o site sobe sozinho.
