#!/bin/bash

# Script de Deploy Automatizado para Lotofy
# Este script automatiza o processo de deploy na Vercel

echo "🚀 Iniciando processo de deploy do Lotofy..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto Lotofy"
    exit 1
fi

# Verificar se o Git está configurado
if [ ! -d ".git" ]; then
    echo "❌ Erro: Repositório Git não encontrado. Execute 'git init' primeiro"
    exit 1
fi

# Verificar se as variáveis de ambiente estão configuradas
if [ ! -f ".env.local" ]; then
    echo "⚠️  Aviso: Arquivo .env.local não encontrado"
    echo "📝 Criando arquivo .env.local de exemplo..."
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui

# Database Configuration (if needed)
DATABASE_URL=sua_url_do_banco_aqui
EOF
    echo "✅ Arquivo .env.local criado. Configure suas credenciais do Supabase antes de continuar."
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Executar testes de build
echo "🔨 Testando build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build. Corrija os erros antes de continuar."
    exit 1
fi

echo "✅ Build executado com sucesso!"

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Fazer deploy
echo "🚀 Fazendo deploy na Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "🎉 Deploy realizado com sucesso!"
    echo "🌐 Seu site está disponível na URL fornecida pela Vercel"
else
    echo "❌ Erro no deploy. Verifique os logs acima."
    exit 1
fi

echo "✨ Processo de deploy concluído!"
