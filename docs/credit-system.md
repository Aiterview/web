# Sistema de Créditos

## Visão Geral

O AIterview utiliza um sistema de créditos simples para permitir que os usuários gerem perguntas de entrevista personalizadas. Cada usuário recebe um número inicial de créditos ao criar uma conta e pode comprar créditos adicionais conforme necessário.

## Funcionamento

- Cada geração de perguntas consome **1 crédito**
- Usuários recebem **5 créditos** iniciais ao criar uma conta (apenas uma vez)
- Não há renovação automática de créditos - eles precisam ser comprados
- Todos os usuários são tratados igualmente - não há distinção entre tipos de usuários

## Consumo de Créditos

Créditos são consumidos nos seguintes momentos:

1. Quando o usuário gera perguntas para uma nova sessão de prática
2. Quando o usuário gera novas perguntas para o mesmo cargo/requisitos na tela de feedback

## Compra de Créditos

Os usuários podem comprar pacotes de créditos nas seguintes quantidades:
- 1 crédito
- 5 créditos
- 10 créditos
- 20 créditos

## Interfaces e Tipos

### `UsageStats`

```typescript
interface UsageStats {
  current: number;   // Total de créditos consumidos pelo usuário
  limit: number;     // Limite não utilizado (valor constante)
  remaining: number; // Número de créditos restantes disponíveis
}
```

## Alterações no Sistema

A partir da versão atual, as seguintes alterações foram feitas:

1. Remoção do conceito de "usuário premium"
2. Remoção do cron job que adicionava 5 créditos mensalmente
3. Créditos iniciais (5) fornecidos apenas na criação da conta
4. Simplificação da interface de usuário para mostrar apenas créditos disponíveis
5. Todos os usuários agora utilizam o mesmo modelo de sistema de créditos

## Implementação Técnica

- O backend fornece apenas o número de créditos restantes para o frontend
- O frontend atualiza o contador de créditos após cada geração
- Validações são feitas para garantir que valores numéricos sejam exibidos corretamente
- Mensagens claras são mostradas ao usuário sobre o consumo de créditos 