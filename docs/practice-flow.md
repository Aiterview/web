# Fluxo de Prática de Entrevista

## Visão Geral

O fluxo de prática de entrevista é projetado para permitir que os usuários pratiquem entrevistas com base em uma posição específica e requisitos. O processo segue estas etapas sequenciais:

1. **Seleção de Tipo de Trabalho**: O usuário seleciona o tipo de posição para a qual está se candidatando
2. **Requisitos do Cargo**: O usuário insere os requisitos e habilidades necessárias para a posição
3. **Geração de Perguntas**: O sistema gera perguntas personalizadas com base no tipo de trabalho e requisitos
4. **Resposta às Perguntas**: O usuário responde às perguntas geradas
5. **Análise e Feedback**: O sistema analisa as respostas e fornece feedback personalizado

## Uso de Créditos

Para garantir uma utilização justa do serviço, implementamos um sistema de créditos:

- **1 crédito = 1 sessão completa de prática**
- Os créditos são consumidos apenas quando novas perguntas são geradas
- Cada sessão de prática é única e as perguntas não são armazenadas em cache
- Os usuários recebem 5 créditos iniciais ao criar uma conta
- Créditos adicionais podem ser comprados conforme necessário

### Quando os créditos são gastos:

1. **Início de uma nova sessão**: 1 crédito é gasto quando o usuário gera perguntas pela primeira vez
2. **Nova sessão com o mesmo tópico**: Na tela de feedback, o usuário pode escolher gerar novas perguntas para o mesmo tipo de trabalho e requisitos, o que gasta 1 crédito adicional
3. **Nova sessão com tópico diferente**: O usuário pode iniciar uma nova sessão com um tipo de trabalho ou requisitos diferentes, o que gasta 1 crédito

### Prevenção de gastos duplos:

- A geração de perguntas foi otimizada para evitar chamadas duplicadas à API
- O cache de perguntas foi desativado para garantir que cada sessão seja única
- Medidas de segurança foram implementadas para evitar que o usuário gaste créditos acidentalmente
- O botão "Gerar Novas Perguntas" só está disponível na etapa de feedback

## Sistema multi-camadas de proteção contra chamadas duplicadas

Para impedir o gasto duplicado de créditos, implementamos um sistema de proteção de múltiplas camadas:

### 1. Proteção no nível do componente React
- **Estado local**: Flag `localApiCallInProgress` para controlar o estado da chamada dentro do componente
- **Estado global**: Variável `isApiCallInProgressGlobal` compartilhada entre componentes para bloquear chamadas concorrentes
- **Sistema de timeout**: Libera automaticamente os bloqueios após 30 segundos se a API não responder
- **Controle de requisição**: Cada requisição recebe um ID único para rastreamento e validação
- **Debounce**: Atraso de 500ms para evitar chamadas duplicadas por cliques rápidos

### 2. Proteção no nível do serviço de API
- **Registro de requisições ativas**: Mapa de solicitações ativas para impedir envios duplicados
- **Verificação de duplicidade**: Bloqueia chamadas com parâmetros idênticos se já houver uma em andamento
- **Nonce único**: Cada requisição inclui um valor aleatório único para garantir que o backend não processe duplicados
- **Limpeza automática**: Sistema de registro limpa automaticamente requisições concluídas

### 3. Estados visuais claros
- **Indicador de carga**: Animação visível durante o processamento
- **Feedback imediato**: Informações claras sobre o status da chamada
- **Desativação de botões**: Impede interações adicionais durante chamadas em andamento

## Fluxo de Usuário Detalhado

1. **Início da prática**
   - O usuário inicia uma nova sessão de prática
   - Nenhum crédito é gasto nesta etapa

2. **Escolha do tipo de cargo**
   - O usuário seleciona o tipo de posição para a qual está se candidatando
   - Nenhum crédito é gasto nesta etapa

3. **Definição dos requisitos**
   - O usuário insere as habilidades e requisitos para o cargo
   - Nenhum crédito é gasto nesta etapa

4. **Geração de perguntas**
   - O sistema gera perguntas personalizadas com base nas informações fornecidas
   - **1 crédito é gasto nesta etapa**
   - O sistema bloqueia chamadas duplicadas através de múltiplas camadas de proteção
   - As perguntas são exibidas para o usuário

5. **Resposta às perguntas**
   - O usuário responde às perguntas geradas
   - Nenhum crédito adicional é gasto nesta etapa

6. **Feedback e análise**
   - O sistema analisa as respostas e fornece feedback personalizado
   - Nenhum crédito adicional é gasto nesta etapa
   - O usuário pode escolher:
     - **Nova entrevista (tópico diferente)**: Inicia uma nova sessão com um cargo/requisitos diferentes
     - **Novas perguntas (mesmo tópico)**: Gera novas perguntas para o mesmo cargo/requisitos, gastando 1 crédito adicional

## Considerações Técnicas

- A API é chamada apenas uma vez durante a geração de perguntas, graças ao sistema de proteção multi-camadas
- Estados de bloqueio são usados para evitar chamadas duplicadas quando o usuário clica várias vezes em um botão
- O sistema registra cada solicitação com um ID único para rastreamento e prevenção de duplicação
- O feedback é gerado localmente se a API não estiver disponível
- Modais de confirmação são exibidos antes de gastar créditos adicionais

## Comportamento em caso de falha

- Se uma chamada de API falhar, os bloqueios são liberados automaticamente após 30 segundos
- Se a API não estiver disponível, perguntas padrão serão fornecidas
- O sistema rastreia o estado de cada requisição e garante que apenas requisições válidas sejam processadas

## Limites de Uso

- Todos os usuários utilizam o mesmo sistema de créditos
- O sistema mostra claramente o número de créditos disponíveis
- Quando os créditos acabam, o usuário é notificado e direcionado para comprar mais 