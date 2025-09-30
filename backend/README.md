# Backend Lotofácil SaaS

API REST para ingestão, consulta, estatísticas e geração de números Lotofácil.

## Como rodar
- Instale dependências: `npm install`
- Configure .env
- Rode: `npm run dev`

## Endpoints principais
- GET /api/concursos/latest
- POST /api/concursos/sync
- GET /api/concursos/:numero
- GET /api/estatisticas/frequencia
- GET /api/gerador?strategy=...&count=10
- POST /api/user/history
- GET /api/user/history

## Testes
- Unitários: `npm test`
- Integração: `npm test`
