# Plano: Importar Fatura de Cartão de Crédito

Plano de implementação para a feature de upload de fatura de cartão de
crédito, com extração automática dos gastos (data, descrição, valor e
categoria sugerida), discutida e validada em sessões anteriores de análise.

## Contexto e decisões já tomadas

- **Uso de IA (Gemini):** viável e vale a pena. Como a fatura é usada apenas
  1x por mês por cartão, e o Gemini tokeniza PDF a ~258 tokens/página, o
  custo estimado é de frações de centavo de dólar por fatura (ver seção
  "Custo estimado"). Reaproveita a mesma infraestrutura já usada pelo bot do
  Telegram (`lib/gemini.ts`, `server/api/telegram/webhook.post.ts`).
- **Privacidade (LGPD):** faturas contêm dados sensíveis (nome completo,
  CPF, endereço, número parcial do cartão). A estratégia é **minimizar o que
  é enviado ao Gemini**: extrair texto localmente no navegador, filtrar
  apenas as linhas de lançamento antes de enviar ao servidor, e nunca
  persistir o conteúdo da fatura.
- **Descarte do arquivo:** o PDF/imagem original só existe em memória no
  navegador (nunca é enviado ao Storage/Firestore) e é descartado assim que
  o texto é extraído e a lista de transações é revisada/confirmada.
- **Fatura com senha:** tratada com um modal dedicado, usando o suporte
  nativo do `pdfjs-dist` a `PasswordException`.
- **Revisão obrigatória:** a IA pode errar valores/datas ocasionalmente;
  o usuário sempre revisa/edita a lista antes de confirmar a importação —
  nenhuma transação é salva automaticamente sem confirmação.

## Custo estimado (Gemini `gemini-2.5-flash-lite`)

| Item | Estimativa |
|---|---|
| Input (páginas da fatura, texto filtrado + prompt) | ~1.000–1.500 tokens |
| Output (JSON com os lançamentos) | ~800–1.200 tokens |
| Custo por fatura | ≈ US$ 0,0005 (menos de meio centavo) |
| Custo mensal (1 fatura) | ≈ US$ 0,01 ou menos |

## Dependências novas

- `pdfjs-dist` — extração de texto de PDF no navegador (client-side, sem
  custo de API). Rodar `runtime-tools-gh-advisory-database`/checagem de
  vulnerabilidades antes de instalar.
- (Opcional, fase futura) `tesseract.js` — OCR local para faturas em
  imagem/foto sem texto selecionável. Não faz parte do MVP.

## Etapas de implementação

### 1. Constantes e tipos
- [ ] Adicionar `TransactionPaymentMethod.CREDIT_CARD` como valor padrão
  fixo para transações importadas de fatura (já existe no enum em
  `constants/transactions.ts`, não precisa de mudança aqui — só reforçar
  o uso).
- [ ] Definir tipo `ParsedInvoiceTransaction` (nome, valor, data, categoria
  sugerida, campo `selected`/`confirmed` para a tela de revisão) em um novo
  arquivo `lib/parseInvoiceTransaction.ts` (ou similar).

### 2. Extração de texto do PDF (client-side)
- [ ] Instalar `pdfjs-dist`.
- [ ] Criar `composables/usePdfTextExtractor.ts` (ou `lib/pdfInvoice.ts`)
  que recebe um `File`/`ArrayBuffer` e retorna o texto de cada página.
- [ ] Tratar o caso de PDF protegido por senha:
  - Capturar `PasswordException` (`code: NEED_PASSWORD` /
    `INCORRECT_PASSWORD`).
  - Expor um estado reativo (`needsPassword`, `passwordError`) para a UI
    acionar o modal de senha.
  - Reabrir o documento com `getDocument({ data, password })` ao receber a
    senha do modal; permitir novas tentativas em caso de senha incorreta.

### 3. Filtro de dados sensíveis (client-side, antes de enviar ao servidor)
- [ ] Criar função `filterInvoiceLines(rawText: string): string` em
  `lib/parseInvoiceTransaction.ts` que:
  - Remove/ignora linhas que batem com padrões de CPF
    (`\d{3}\.\d{3}\.\d{3}-\d{2}`), palavras-chave ("CPF", "Endereço",
    "Titular") e números de cartão mascarados.
  - Mantém apenas linhas que batem com o padrão de lançamento
    (`DD/MM  DESCRIÇÃO  VALOR`).
- [ ] Cobrir essa função com testes unitários (`tests/unit/`), incluindo
  casos de fatura com CPF/endereço para garantir que são removidos.

### 4. Endpoint de servidor (proxy para o Gemini)
- [ ] Criar `server/api/invoices/parse.post.ts`, análogo ao
  `server/api/telegram/webhook.post.ts`:
  - Recebe **apenas o texto já filtrado** (não o arquivo original).
  - Valida tamanho máximo do texto recebido (equivalente ao
    `MAX_MESSAGE_TEXT_LENGTH` do webhook do Telegram).
  - Monta o prompt via novo `buildInvoiceTransactionsPrompt(text)` em
    `lib/telegramTransaction.ts` (reaproveitando o módulo existente) ou em
    um novo `lib/invoiceTransaction.ts`, pedindo ao Gemini um **array** de
    lançamentos (nome, valor, data, categoria), diferente do fluxo atual que
    extrai só uma transação.
  - Chama `callGemini`/`extractGeminiText` (já existentes em
    `lib/gemini.ts`).
  - Faz `parse` e validação do JSON retornado (valor numérico, data válida,
    categoria dentro do enum `TransactionCategory`), descartando/repassando
    como erro qualquer item malformado.
  - Não loga nem persiste o texto da fatura em nenhum momento.
  - Exige autenticação do usuário (checar padrão de auth já usado nas
    demais rotas/serviços, ex. Firebase Auth) antes de aceitar a chamada.

### 5. Componente de UI
- [ ] Criar `components/ImportInvoiceDialog.vue`, seguindo o padrão visual
  dos `Upsert*Dialog.vue` existentes:
  - Input de arquivo (aceitar apenas `.pdf` no MVP).
  - Estado de carregamento durante extração/parsing.
  - Modal de senha (`PasswordException`) quando aplicável.
  - Tabela de revisão dos lançamentos extraídos (nome, valor, data,
    categoria — todos editáveis), reaproveitando padrões de
    `components/transactions/columns.ts` quando possível.
  - Ação "Confirmar importação": para cada linha marcada, chamar
    `addTransaction` (`service/transactionService.ts`) com
    `paymentMethod: CREDIT_CARD`.
  - Ação "Cancelar": descarta o estado (arquivo, texto extraído, lista)
    sem salvar nada.
- [ ] Adicionar o botão de entrada dessa dialog em
  `pages/transactions/index.vue` (ou local equivalente onde já existem
  outras ações de criação/importação, ex. exportação CSV).

### 6. Segurança e privacidade — checklist final
- [ ] Confirmar que o arquivo original (`File`/`ArrayBuffer`) só existe em
  memória no componente e é descartado (`= null`) após a extração de texto,
  nunca enviado ao Storage/Firestore.
- [ ] Confirmar que a senha da fatura só existe em uma variável reativa
  temporária, nunca persistida nem logada.
- [ ] Confirmar que o endpoint de servidor não grava logs com o texto da
  fatura (mesmo em caso de erro/exception).
- [ ] Confirmar que o texto filtrado enviado ao Gemini não contém CPF,
  endereço ou nome completo (validação manual com faturas de exemplo de
  diferentes bancos).
- [ ] Rodar `codeql_checker` e `runtime-tools-secret_scanning` sobre os
  arquivos novos/alterados antes de finalizar.

### 7. Testes
- [ ] `tests/unit/parseInvoiceTransaction.test.ts` — parsing/filtragem de
  linhas, remoção de dados sensíveis, validação de JSON retornado pela IA
  (usando respostas mockadas do Gemini, no padrão de `gemini.test.ts` /
  `telegramTransaction.test.ts`).
- [ ] Testes de componente para `ImportInvoiceDialog.vue` cobrindo o fluxo
  de senha incorreta/correta e a edição/remoção de linhas antes de
  confirmar.

### 8. Documentação
- [ ] Atualizar `ROADMAP.md` com a nova entrada de feature, seguindo o
  padrão das demais (status ✅/🟨/⬜ e lista de arquivos envolvidos).
- [ ] Atualizar `.env.example` se alguma nova variável de ambiente for
  necessária (não deve ser o caso — reaproveita `VITE_GEMINI_API_KEY`
  existente).

## Fora de escopo (MVP)

- OCR de faturas em foto/imagem sem texto selecionável (`tesseract.js`) —
  tratar como fase 2, caso haja demanda real.
- Suporte a múltiplos formatos de banco com parsers dedicados — o MVP conta
  com o Gemini para lidar com a variação de formato.
- Detecção automática de parcelamento (ex. "Compra 3/12") como transação
  recorrente — pode ser adicionado depois, reaproveitando
  `RecurrenceFrequency` já existente em `constants/transactions.ts`.
