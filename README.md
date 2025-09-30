# Lotofácil SaaS

Projeto completo para análise estatística e geração de números prováveis da Lotofácil.

## Estrutura
- Backend: Node.js/Express (API REST, integração Supabase)
- Frontend: Next.js SPA
- Scripts: ingestão de concursos, sync diário
- Banco: Supabase (Postgres + Auth)
- Deploy: Vercel/Netlify (frontend), Supabase (backend/db)

## Deploy 100% grátis
1. Crie conta no Supabase (https://supabase.com/)
2. Crie projeto, copie SUPABASE_URL e SUPABASE_KEY
3. Configure variáveis no .env (veja .env.example)
4. Rode `npm run sync-all` para importar concursos
5. Deploy frontend em Vercel/Netlify/Cloudflare Pages

## Scripts
- `npm run sync-all`: importa todos concursos históricos
- Cron job: atualiza concursos diariamente

## Segurança
- Autenticação JWT (Supabase Auth)
- Rate limiting em endpoints sensíveis
- HTTPS obrigatório

## Testes
- Unitários: cálculo de frequência
- Integração: GET /api/concursos/{numero}

## Amostras
- Veja pasta `amostras/` para exemplos de concursos e gerações

## Migração para plano pago
- Recomendações no final do README

## Diagrama de arquitetura
Caixa/API → Ingestor → Postgres (Supabase) → Backend API → Front-end (Vercel) → Users

## Observações
- Não inclui cobrança real; página de preços apenas informativa
- Documentação detalhada para fallback/migração
