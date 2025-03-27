# Alterações Necessárias no Backend

## Resumo

Este documento descreve as alterações necessárias no backend para remover o conceito de usuários premium e implementar um sistema baseado exclusivamente em créditos comprados.

## Migrations a Serem Criadas

```sql
-- Remover coluna isPremium da tabela de usuários (se existir)
ALTER TABLE users DROP COLUMN IF EXISTS isPremium;

-- Remover coluna premium_until da tabela de usuários (se existir)
ALTER TABLE users DROP COLUMN IF EXISTS premium_until;

-- Garantir que todos os novos usuários recebam 5 créditos iniciais APENAS na criação da conta
-- (Isto deve ser implementado na lógica de criação de usuários)
```

## Cron Jobs a Serem Removidos

- Remover qualquer cron job que adicione créditos mensalmente aos usuários
- Exemplo: `addMonthlyCredits`, `renewPremiumSubscriptions` ou similar

## Alterações na API

### Endpoint: `/api/usage/stats`

Modificar este endpoint para retornar apenas:

```json
{
  "current": <número_de_créditos_usados>,
  "remaining": <número_de_créditos_disponíveis>,
  "limit": 0
}
```

### Endpoint: `/api/auth/register`

Modificar para adicionar 5 créditos iniciais APENAS ao criar um novo usuário:

```javascript
// Pseudocódigo
async function registerUser(userData) {
  // Criar usuário
  const user = await createUser(userData);
  
  // Adicionar 5 créditos iniciais (APENAS na criação)
  await addCredits(user.id, 5, 'initial_credits', 'Créditos iniciais');
  
  return user;
}
```

## Controle de Geração de Perguntas

Modificar o endpoint `/api/questions/generate` para:

1. Verificar se o usuário tem créditos disponíveis
2. Consumir 1 crédito por geração
3. Retornar erro específico se não houver créditos suficientes

```javascript
// Pseudocódigo
async function generateQuestions(userId, jobType, requirements) {
  // Verificar créditos disponíveis
  const credits = await getUserCredits(userId);
  
  if (credits.remaining <= 0) {
    return {
      success: false,
      status: 403,
      error: 'Créditos insuficientes',
      data: {
        limitReached: true
      }
    };
  }
  
  // Consumir 1 crédito
  await consumeCredit(userId, 1, 'question_generation', `Geração de perguntas para ${jobType}`);
  
  // Gerar perguntas
  const questions = await aiService.generateQuestions(jobType, requirements);
  
  // Obter estatísticas de uso atualizadas
  const updatedStats = await getUserUsageStats(userId);
  
  return {
    success: true,
    data: {
      questions,
      usage: updatedStats
    }
  };
}
```

## Testes a Serem Realizados

1. Verificar se novos usuários recebem exatamente 5 créditos apenas na criação da conta
2. Verificar se o consumo de créditos está funcionando corretamente
3. Confirmar que o cron job de adição mensal de créditos foi removido
4. Validar que a API retorna corretamente o número de créditos restantes 