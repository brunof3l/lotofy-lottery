# 🚀 Guia de Deploy - Lotofy

## 📋 Pré-requisitos
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Vercel](https://vercel.com) (gratuita)
- Conta no [GitHub](https://github.com) (gratuita)
- Git instalado no seu computador

---

## **ETAPA 1: Configurar o Supabase** 🗄️

### 1.1 Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub
4. Clique em "New Project"
5. Preencha:
   - **Name:** `lotofy-production`
   - **Database Password:** (crie uma senha forte)
   - **Region:** Escolha a mais próxima do Brasil (us-east-1)
6. Clique em "Create new project"
7. Aguarde a criação (2-3 minutos)

### 1.2 Obter Credenciais
1. No painel do Supabase, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

---

## **ETAPA 2: Configurar Banco de Dados** 🛠️

### 2.1 Executar Scripts SQL
1. No Supabase, vá em **SQL Editor**
2. Execute cada script da pasta `scripts/` na ordem:

**Script 1 - Criar Tabelas:**
```sql
-- Cole o conteúdo do arquivo 001_create_tables.sql
```

**Script 2 - Habilitar RLS:**
```sql
-- Cole o conteúdo do arquivo 002_enable_rls.sql
```

**Script 3 - Criar Funções:**
```sql
-- Cole o conteúdo do arquivo 003_create_functions.sql
```

**Script 4 - Dados de Exemplo:**
```sql
-- Cole o conteúdo do arquivo 004_seed_sample_data.sql
```

**Script 5 - Trigger de Perfil:**
```sql
-- Cole o conteúdo do arquivo 005_create_profile_trigger.sql
```

**Script 6 - Funções Admin:**
```sql
-- Cole o conteúdo do arquivo 006_add_admin_roles.sql
```

**Script 7 - Atualizar Perfis:**
```sql
-- Cole o conteúdo do arquivo 007_update_profiles_table.sql
```

---

## **ETAPA 3: Preparar o Código** 📝

### 3.1 Criar Repositório no GitHub
1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Preencha:
   - **Repository name:** `lotofy-lottery`
   - **Description:** "Lotofy - Previsões Inteligentes para Lotofácil"
   - **Visibility:** Public
4. Clique em "Create repository"

### 3.2 Fazer Upload do Código
```bash
# Conectar ao repositório remoto
git remote add origin https://github.com/SEU_USUARIO/lotofy-lottery.git

# Fazer push do código
git branch -M main
git push -u origin main
```

### 3.3 Atualizar Variáveis de Ambiente
Crie um arquivo `.env.local` com suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

---

## **ETAPA 4: Deploy na Vercel** 🚀

### 4.1 Conectar com Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione o repositório `lotofy-lottery`
5. Clique em "Import"

### 4.2 Configurar Variáveis de Ambiente
1. Na página de configuração do projeto, vá em **Environment Variables**
2. Adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = sua URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua chave anônima do Supabase
3. Clique em "Save"

### 4.3 Fazer Deploy
1. Clique em "Deploy"
2. Aguarde o processo (2-3 minutos)
3. Seu site estará disponível em: `https://lotofy-lottery.vercel.app`

---

## **ETAPA 5: Configurar Domínio Personalizado** 🌐

### 5.1 Comprar Domínio (Opcional)
- [Namecheap](https://namecheap.com)
- [GoDaddy](https://godaddy.com)
- [Registro.br](https://registro.br) (para .com.br)

### 5.2 Configurar DNS
1. No painel do seu provedor de domínio
2. Adicione um registro CNAME:
   - **Name:** `www`
   - **Value:** `cname.vercel-dns.com`
3. Adicione um registro A:
   - **Name:** `@`
   - **Value:** `76.76.19.61`

### 5.3 Adicionar Domínio na Vercel
1. No painel da Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure o SSL (automático)

---

## **ETAPA 6: Configurações Finais** ⚙️

### 6.1 Configurar Supabase para Produção
1. No Supabase, vá em **Settings** → **API**
2. Adicione sua URL de produção nas **Site URL**
3. Configure as **Redirect URLs** se necessário

### 6.2 Testar Aplicação
1. Acesse seu site
2. Teste o cadastro de usuários
3. Verifique se as funcionalidades estão funcionando
4. Teste em diferentes dispositivos

---

## **ETAPA 7: Manutenção** 🔧

### 7.1 Monitoramento
- Use o dashboard da Vercel para monitorar performance
- Configure alertas no Supabase
- Monitore logs de erro

### 7.2 Atualizações
- Faça commits no GitHub
- A Vercel fará deploy automático
- Teste sempre em ambiente de desenvolvimento primeiro

### 7.3 Backup
- O Supabase faz backup automático
- Mantenha backups do código no GitHub
- Documente mudanças importantes

---

## **🔗 Links Úteis**

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)

---

## **❓ Problemas Comuns**

### Erro de Conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique se as políticas RLS estão configuradas

### Erro de Build na Vercel
- Verifique se todas as dependências estão no package.json
- Confirme se não há erros de TypeScript
- Verifique os logs de build na Vercel

### Problemas de Performance
- Use o Vercel Analytics
- Otimize imagens
- Configure cache adequadamente

---

**🎉 Parabéns! Seu site Lotofy está no ar!**
