# Instruções para Migração do Sistema de Créditos

Este documento contém as instruções passo a passo para migrar o sistema do modelo atual (com usuários premium e créditos mensais) para o novo modelo (apenas créditos comprados).

## Pré-requisitos

1. Acesso ao banco de dados de produção
2. Backup completo do banco de dados antes de iniciar
3. Janela de manutenção programada (recomendado)

## Procedimento de Migração

### 1. Backup do Banco de Dados

```bash
# PostgreSQL
pg_dump -U usuario -d database_name > backup_pre_migration.sql

# MySQL
mysqldump -u usuario -p database_name > backup_pre_migration.sql
```

### 2. Script de Migração

Salve o script abaixo como `remove_premium_model.sql`:

```sql
-- Início da transação
BEGIN;

-- 1. Criar backup das tabelas de usuários
CREATE TABLE users_backup AS SELECT * FROM users;

-- 2. Remover colunas relacionadas ao modelo premium
ALTER TABLE users DROP COLUMN IF EXISTS isPremium;
ALTER TABLE users DROP COLUMN IF EXISTS premium_until;
ALTER TABLE users DROP COLUMN IF EXISTS subscription_id;
ALTER TABLE users DROP COLUMN IF EXISTS next_billing_date;

-- 3. Garantir que a coluna de créditos existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'credits'
    ) THEN
        ALTER TABLE users ADD COLUMN credits INTEGER DEFAULT 0;
    END IF;
END
$$;

-- 4. Definir créditos iniciais para usuários sem créditos
UPDATE users 
SET credits = 5 
WHERE credits IS NULL OR credits = 0;

-- Commit da transação
COMMIT;
```

### 3. Desativar Cron Jobs Relacionados

Localize e desative os seguintes cron jobs no servidor:

```bash
# Listar todos os cron jobs
crontab -l

# Editar cron jobs
crontab -e

# Remover ou comentar as linhas relacionadas a:
# - addMonthlyCredits
# - renewPremiumSubscriptions
# - checkPremiumStatus
```

### 4. Executar o Script de Migração

```bash
# PostgreSQL
psql -U usuario -d database_name -f remove_premium_model.sql

# MySQL
mysql -u usuario -p database_name < remove_premium_model.sql
```

### 5. Verificar a Migração

Execute as seguintes consultas para verificar se a migração foi bem-sucedida:

```sql
-- Verificar se as colunas foram removidas
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('isPremium', 'premium_until');

-- Verificar se os créditos foram definidos corretamente
SELECT id, email, credits FROM users;

-- Verificar estatísticas
SELECT 
  COUNT(*) as total_users,
  AVG(credits) as avg_credits,
  SUM(credits) as total_credits
FROM users;
```

### 6. Atualizar o Código do Backend

Após as alterações no banco de dados, siga as instruções em `backend-changes.md` para atualizar o código do backend.

## Rollback (em caso de problemas)

Se for necessário reverter as alterações:

```sql
-- Restaurar a tabela de usuários do backup
DROP TABLE users;
ALTER TABLE users_backup RENAME TO users;
```

## Considerações Finais

- Monitore o sistema de perto após a migração
- Verifique os logs do sistema em busca de erros relacionados a créditos ou permissões
- Atualize a documentação do sistema para refletir o novo modelo de créditos 