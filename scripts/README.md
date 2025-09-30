# Scripts Lotofácil SaaS

- `ingestao.js`: importa concursos históricos via XLS/API
- `syncDaily.js`: atualiza concursos diariamente (cron)

Como usar:
- Rode `npm run sync-all` no backend para importar todos concursos
- Configure cron job para rodar `syncDaily.js` diariamente
