# MyLife.AI - React 19 Template

Um template moderno e production-ready para desenvolvimento de aplicações React com TypeScript, otimizado com as mais recentes tecnologias e melhores práticas.

## 🚀 Sobre o Template

Este template fornece uma base sólida para construir aplicações React modernas, implementando **Domain-Driven Design (DDD)** com monitoramento de performance avançado e otimizações para React 19.

### ⚡ Principais Tecnologias

- **React 19** com hooks mais recentes (`use`, `useOptimistic`, `startTransition`)
- **TypeScript 5.8+** com configuração estrita
- **Vite 7.1.2** com configuração otimizada para produção
- **TanStack Router** para roteamento type-safe
- **TanStack Query** para gerenciamento de estado do servidor
- **Tailwind CSS v4** para estilização
- **Sistema de store customizado** otimizado para React 19

### 🏗️ Arquitetura (DDD)

```
src/
├── app/              # Configuração da aplicação (providers, temas, config)
├── features/         # Módulos de funcionalidades isoladas
├── entities/         # Entidades de domínio e schemas
├── shared/           # Componentes, hooks e utilitários reutilizáveis
├── pages/            # Componentes de rota (TanStack Router)
├── infrastructure/   # Integrações externas (API, monitoramento)
└── types/            # Definições de tipos globais
```

## 📋 Requisitos

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recomendado) ou npm >= 9.0.0
- **Git** para controle de versão

## 🚀 Instalação e Uso

### 1. Clone o repositório
```bash
git clone https://github.com/henriqueyujiandrade/mylifeai.git
cd mylifeai
```

### 2. Instale as dependências
```bash
# Com pnpm (recomendado)
pnpm install

# Ou com npm
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 4. Inicie o servidor de desenvolvimento
```bash
pnpm dev
# Aplicação disponível em http://localhost:3000
```

## 📜 Scripts Disponíveis

### Desenvolvimento
- `pnpm dev` - Servidor de desenvolvimento na porta 3000
- `pnpm build` - Build de produção otimizado
- `pnpm preview` - Preview do build de produção

### Qualidade de Código
- `pnpm lint` - Verificação ESLint (máx 20 warnings)
- `pnpm lint:fix` - Correção automática de problemas ESLint
- `pnpm type-check` - Verificação de tipos TypeScript

### Testes
- `pnpm test` - Executa testes com Vitest
- `pnpm test:ui` - Interface de testes

### Análise de Bundle
- `pnpm build:analyze` - Análise do tamanho do bundle
- `pnpm build:stats` - Estatísticas detalhadas na porta 3001

## 🎯 Recursos Incluídos

- ✅ **Monitoramento de Performance** - Web Vitals e métricas de componentes
- ✅ **Error Boundaries Avançados** - Recuperação inteligente de erros
- ✅ **Sistema de Temas** - Troca dinâmica entre temas claro/escuro
- ✅ **Internacionalização** - Sistema i18n configurado
- ✅ **Code Splitting** - Chunks otimizados por funcionalidade
- ✅ **DevTools** - React Query e Router DevTools incluídos
- ✅ **SEO Ready** - Meta tags e configurações otimizadas

## 📊 Performance Targets

- **React vendor chunk**: ~230KB → ~73KB gzipped
- **Feature chunks**: <10KB cada
- **Initial load**: <100KB gzipped

## 🔧 Configurações Avançadas

### Customização do ESLint

Para projetos em produção, recomendamos habilitar regras type-aware:

```js
// eslint.config.js
export default tseslint.config([
  // ... outras configurações
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strictTypeChecked,
])
```
