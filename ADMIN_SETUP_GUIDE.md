# 🔐 Guia de Configuração do Admin - Lotofy

## 📋 Resumo dos Problemas Encontrados

### ✅ Problemas Corrigidos:
1. **Erro na função `createServerSupabaseClient()`** - Corrigido para `createClient()`
2. **Linting** - Nenhum erro encontrado
3. **Configurações** - Todos os arquivos de configuração estão corretos

### ⚠️ Configurações Pendentes:
1. **Configurar usuário admin no Supabase**
2. **Executar scripts SQL na ordem correta**
3. **Configurar variáveis de ambiente**

---

## 🚀 Passo a Passo para Configurar o Admin

### **ETAPA 1: Configurar o Supabase** 🗄️

#### 1.1 Criar/Acessar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Crie um novo projeto ou acesse um existente

#### 1.2 Obter Credenciais
1. No painel do Supabase, vá em **Settings** → **API**
2. Copie as seguintes credenciais:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### **ETAPA 2: Configurar Variáveis de Ambiente** 🔧

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

**⚠️ IMPORTANTE:** Substitua pelos valores reais do seu projeto Supabase!

---

### **ETAPA 3: Executar Scripts SQL na Ordem Correta** 📊

No Supabase, vá em **SQL Editor** e execute os scripts na seguinte ordem:

#### Script 1: Criar Tabelas
```sql
-- Cole o conteúdo do arquivo: scripts/001_create_tables.sql
-- Este script cria todas as tabelas necessárias
```

#### Script 2: Habilitar RLS (Row Level Security)
```sql
-- Cole o conteúdo do arquivo: scripts/002_enable_rls.sql
-- Este script configura as políticas de segurança
```

#### Script 3: Criar Funções
```sql
-- Cole o conteúdo do arquivo: scripts/003_create_functions.sql
-- Este script cria funções para estatísticas automáticas
```

#### Script 4: Dados de Exemplo (Opcional)
```sql
-- Cole o conteúdo do arquivo: scripts/004_seed_sample_data.sql
-- Este script adiciona dados de teste
```

#### Script 5: Trigger de Perfil
```sql
-- Cole o conteúdo do arquivo: scripts/005_create_profile_trigger.sql
-- Este script cria trigger para criar perfil automaticamente
```

#### Script 6: **CONFIGURAR ADMIN** ⭐
```sql
-- Cole o conteúdo do arquivo: scripts/006_add_admin_roles.sql
-- IMPORTANTE: Altere o email 'admin@lotofy.com' para SEU email
```

#### Script 7: Atualizar Perfis
```sql
-- Cole o conteúdo do arquivo: scripts/007_update_profiles_table.sql
-- Este script adiciona campos extras aos perfis
```

---

### **ETAPA 4: Criar Usuário Admin** 👤

#### 4.1 Cadastrar no Sistema
1. Execute o projeto localmente: `npm run dev`
2. Acesse: `http://localhost:3000`
3. Clique em **"Cadastrar"**
4. Cadastre-se com o **MESMO EMAIL** que você configurou no script SQL

#### 4.2 Verificar se foi criado como Admin
1. No Supabase, vá em **Table Editor**
2. Selecione a tabela `profiles`
3. Verifique se seu usuário tem `role = 'admin'`

#### 4.3 Se não for admin, execute:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'SEU_EMAIL_AQUI';
```

---

### **ETAPA 5: Testar Acesso Admin** ✅

#### 5.1 Fazer Login
1. Acesse: `http://localhost:3000/auth/login`
2. Faça login com sua conta admin

#### 5.2 Testar Rotas Admin
- `http://localhost:3000/admin` - Dashboard principal
- `http://localhost:3000/admin/results` - Gerenciar resultados
- `http://localhost:3000/admin/analytics` - Analytics avançado

#### 5.3 Verificar Funcionalidades
- ✅ Dashboard carrega estatísticas
- ✅ Pode acessar área administrativa
- ✅ APIs de admin funcionam

---

### **ETAPA 6: Configurar para Produção** 🚀

#### 6.1 No Supabase (Produção)
1. Configure as **Site URL** e **Redirect URLs**
2. Adicione seu domínio de produção

#### 6.2 Na Vercel
1. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🔍 Verificação Final

### ✅ Checklist de Verificação:

- [ ] Projeto Supabase criado
- [ ] Variáveis de ambiente configuradas
- [ ] Todos os scripts SQL executados
- [ ] Usuário admin criado e configurado
- [ ] Login funcionando
- [ ] Acesso ao `/admin` funcionando
- [ ] Dashboard admin carregando dados
- [ ] APIs de admin respondendo

---

## 🆘 Solução de Problemas

### Problema: "Unauthorized" ao acessar /admin
**Solução:**
1. Verifique se o usuário tem `role = 'admin'` na tabela `profiles`
2. Execute: `UPDATE public.profiles SET role = 'admin' WHERE email = 'seu@email.com';`

### Problema: Erro de conexão com Supabase
**Solução:**
1. Verifique as variáveis de ambiente
2. Confirme se o projeto Supabase está ativo
3. Teste a conexão no dashboard do Supabase

### Problema: Dashboard admin não carrega dados
**Solução:**
1. Verifique se a view `admin_stats` foi criada
2. Execute o Script 6 novamente
3. Verifique se há dados nas tabelas

### Problema: APIs retornam erro 403
**Solução:**
1. Verifique se o usuário está logado
2. Confirme se o `role` está como 'admin'
3. Verifique as políticas RLS

---

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** no console do navegador
2. **Consulte os logs** no dashboard do Supabase
3. **Teste as APIs** diretamente no Supabase
4. **Verifique as políticas RLS** se houver problemas de acesso

---

**🎉 Parabéns! Seu sistema admin está configurado e funcionando!**
