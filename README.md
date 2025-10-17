# Poupa.ai 💰

Seu assistente financeiro pessoal inteligente e acessível para controle e gestão de finanças.

## 📋 Sobre o Projeto

Poupa.ai é uma aplicação web moderna de gestão financeira pessoal, desenvolvida com Nuxt 3, que permite aos usuários controlar suas receitas, despesas e investimentos de forma intuitiva e acessível. A aplicação conta com recursos de inteligência artificial para geração de relatórios financeiros personalizados e múltiplos temas para acessibilidade.

## ✨ Funcionalidades Principais

### 💳 Gestão de Transações
- Cadastro de receitas, despesas e investimentos
- Categorização automática de transações
- Múltiplos métodos de pagamento (PIX, cartão, boleto, etc.)
- Filtros por período personalizável
- Edição e exclusão de transações

### 📊 Dashboard Inteligente
- Visualização do saldo atual
- Gráficos de pizza interativos com distribuição por tipo
- Análise de gastos por categoria
- Cards resumo de receitas, despesas e investimentos
- Últimas transações

### 🤖 Relatórios com IA
- Geração automática de relatórios financeiros usando IA (Groq/LLama 3.3)
- Insights personalizados sobre seus hábitos financeiros
- Dicas e orientações para melhorar sua saúde financeira
- Exportação de relatórios em PDF

### 🎨 Acessibilidade Avançada
- **Temas para Daltonismo**: Protanopia, Deuteranopia, Tritanopia
- **Temas Gerais**: Claro, Escuro, Alto Contraste
- **Fontes Personalizáveis**: OpenDyslexic, Arial, Padrão
- **Tamanhos de Fonte**: Pequeno, Médio, Grande
- Interface totalmente responsiva (mobile-first)

### 👤 Gerenciamento de Perfil
- Autenticação com Google ou Email/Senha
- Upload de foto de perfil
- Alteração de senha
- Visualização de informações da conta
- Exclusão de conta com confirmação

## 🛠️ Tecnologias Utilizadas

### Frontend
- **[Nuxt 3](https://nuxt.com/)** - Framework Vue.js
- **[Vue 3](https://vuejs.org/)** - Framework JavaScript reativo
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Shadcn Vue](https://www.shadcn-vue.com/)** - Componentes UI reutilizáveis
- **[Reka UI](https://reka-ui.com/)** - Componentes acessíveis sem estilo

### Backend & Dados
- **[Firebase](https://firebase.google.com/)** - Backend-as-a-Service
  - Authentication (Google OAuth e Email/Senha)
  - Firestore (Banco de dados NoSQL)
  - Storage (Armazenamento de imagens)
- **[VueFire](https://vuefire.vuejs.org/)** - Integração Vue + Firebase

### IA & Processamento
- **[Groq AI](https://groq.com/)** - API de IA para geração de relatórios
- **[Marked](https://marked.js.org/)** - Parser de Markdown
- **[DOMPurify](https://github.com/cure53/DOMPurify)** - Sanitização de HTML
- **[jsPDF](https://github.com/parallax/jsPDF)** - Geração de PDFs

### Gerenciamento de Estado
- **[Pinia](https://pinia.vuejs.org/)** - Store management
- **[VueUse](https://vueuse.org/)** - Coleção de composables Vue

### Validação & Formulários
- **[Vee-Validate](https://vee-validate.logaretm.com/)** - Validação de formulários
- **[Zod](https://zod.dev/)** - Schema validation

### Visualização de Dados
- **[@unovis/vue](https://unovis.dev/)** - Biblioteca de gráficos
- **[TanStack Table](https://tanstack.com/table)** - Tabelas reativas

### PWA
- **[@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/)** - Progressive Web App

## 📁 Estrutura do Projeto

```
poupa-ai-nuxt/
├── app/
│   ├── _actions/          # Server actions (IA)
│   ├── _data/             # Funções auxiliares
│   └── assets/css/        # Estilos globais
├── components/
│   ├── ui/                # Componentes UI base
│   ├── transactions/      # Componentes de transações
│   └── *.vue              # Componentes da aplicação
├── composables/           # Composables reutilizáveis
├── constants/             # Constantes e enums
├── layouts/               # Layouts da aplicação
├── middleware/            # Middlewares de rota
├── pages/                 # Páginas da aplicação
│   ├── (home)/           # Dashboard
│   ├── login/            # Autenticação
│   ├── register/         # Cadastro
│   ├── settings/         # Configurações
│   └── transactions/     # Gestão de transações
├── public/                # Arquivos estáticos
├── server/                # API server-side
├── service/               # Serviços (Firebase, Auth, etc.)
├── stores/                # Stores Pinia
└── lib/                   # Utilitários e configurações
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm, pnpm, yarn ou bun
- Conta Firebase
- Chave API Groq (para relatórios IA)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/poupa-ai-nuxt.git
cd poupa-ai-nuxt
```

### 2. Instale as dependências

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, seguindo o exemplo em `.env.example`.

### 4. Configure o Firebase

* Peça acesso ao administrador do projeto.

```

### 5. Inicie o servidor de desenvolvimento

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

Acesse `http://localhost:3000`

## 🏗️ Build para Produção

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

### Preview da build

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## 🎯 Principais Componentes

### Stores (Pinia)

#### [`useTransactionsStore`](stores/transactions.ts)
Gerencia todas as transações financeiras:
- `transactions`: Lista de transações
- `balance`: Saldo calculado
- `depositsTotal`, `expensesTotal`, `investmentsTotal`: Totais por tipo
- `totalExpensePerCategory`: Gastos por categoria
- `lastTransactions`: Últimas 10 transações

#### [`useThemeStore`](composables/useThemeStore.ts)
Gerencia temas e acessibilidade:
- Temas: dark, light, high-contrast
- Temas para daltonismo: protanopia, deuteranopia, tritanopia, colorblind

#### [`useFontStore`](composables/useFontStore.ts)
Gerencia preferências de fonte:
- Famílias: default, open-dyslexic, arial
- Tamanhos: small, medium, large

### Serviços

#### [`authService`](service/authService.ts)
- Autenticação com Google
- Autenticação com Email/Senha
- Gerenciamento de sessão
- Tratamento de erros localizado

#### [`transactionService`](service/transactionService.ts)
- CRUD de transações no Firestore
- Filtros por data
- Conversão de timestamps

### Componentes Principais

- [`TimeSelect`](components/TimeSelect.vue) - Seletor de intervalo de datas
- [`AiReportButton`](components/AiReportButton.vue) - Geração de relatórios IA
- [`TransactionPieChart`](components/TransactionPieChart.vue) - Gráfico de pizza
- [`ExpensesPerCategory`](components/ExpensesPerCategory.vue) - Gastos por categoria
- [`UpsertTransactionDialog`](components/UpsertTransactionDialog.vue) - Adicionar/Editar transação
- [`UserButton`](components/UserButton.vue) - Gerenciamento de perfil

## 🔐 Segurança

- Autenticação obrigatória em rotas protegidas via middleware
- Regras de segurança do Firestore por usuário
- Sanitização de HTML com DOMPurify
- Validação de dados com Zod
- Session cookies para autenticação

## 📱 PWA (Progressive Web App)

A aplicação é configurada como PWA:
- Instalável em dispositivos móveis e desktop
- Ícones adaptáveis para diferentes plataformas
- Auto-atualização
- Cache inteligente de recursos

## 🎨 Temas e Cores

### Variáveis CSS Customizadas
Todas as cores são definidas em [`app/assets/css/tailwind.css`](app/assets/css/tailwind.css) usando o espaço de cor OKLch para melhor acessibilidade e contraste.

### Paletas de Cores para Gráficos
Cores adaptadas para cada tema, incluindo paletas específicas para diferentes tipos de daltonismo.

## 📊 Estrutura de Dados

### Transaction
```typescript
interface Transaction {
  id: string
  name: string
  amount: number
  type: TransactionType // DEPOSIT | EXPENSE | INVESTMENT
  category: TransactionCategory
  paymentMethod: TransactionPaymentMethod
  date: Date
  createdAt: Date
  updatedAt: Date
  userId: string
}
```

### Categorias Disponíveis
- Alimentação
- Moradia
- Transporte
- Saúde
- Educação
- Entretenimento
- Utilidades
- Salário
- Vale Alimentação
- Vale Refeição
- Outros

## 👥 Autores

- Gideão Levi de Oliveira Frota
- Ailton Guarinho de Vasconcelos

## 📞 Suporte

Para suporte, envie um email para [levi.frota.09@hotmail.com] ou abra uma issue no GitHub.

---

Desenvolvido com ❤️ para ajudar você a ter uma vida financeira mais saudável!
