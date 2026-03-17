# Documentação do Projeto: ALFA Bank

## 1. Visão Geral
O **ALFA Bank** é um simulador de banco digital moderno, focado em oferecer uma experiência de usuário (UX) premium e realista. O projeto foi desenvolvido como um MVP (Minimum Viable Product) evolutivo, utilizando uma arquitetura 100% frontend para demonstração de fluxos bancários complexos sem a necessidade imediata de um servidor back-end.

## 2. Pilha Tecnológica
*   **Framework**: [React](https://reactjs.org/) com [Vite](https://vitejs.dev/)

*   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
*   **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
*   **Componentes de UI**: [shadcn/ui](https://ui.shadcn.com/) (baseado em Radix UI)
*   **Gerenciamento de Estado**: React Context API (`BankContext`)
*   **Persistência**: LocalStorage (Simulando um banco de dados)
*   **Validação**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
*   **Ícones**: [Lucide React](https://lucide.dev/)
*   **Gráficos**: [Recharts](https://recharts.org/)

## 3. Arquitetura do Sistema

### 3.1. Camada de Dados (Database Simulado)
Localizado em `src/services/database.ts`, o sistema utiliza o `LocalStorage` do navegador para persistir dados. Ao iniciar, se não houver registros, o sistema popula o banco com dados iniciais ("seed").
*   **Estrutura**: Gerencia Usuários, Saldo, Transações, Cartões e Chaves PIX.

### 3.2. Camada de Serviço (BankService)
Localizado em `src/services/bankService.ts`, esta camada abstrai as operações de negócio. Todas as funções são `async` e possuem um `delay` artificial para simular a latência de uma API real, facilitando a transição para um back-end real no futuro.

### 3.3. Estado Global (BankContext)
Localizado em `src/context/BankContext.tsx`, o contexto provê os dados essenciais para toda a aplicação:
*   `user`: Informações do perfil logado.
*   `balance`: Saldo atual calculado.
*   `transactions`: Histórico completo de movimentações.
*   `cards`: Lista de cartões virtuais/físicos.
*   `refresh()`: Função para sincronizar o estado global com o "banco de dados" local após operações.

## 4. Funcionalidades Principais

### 4.1. Dashboard
Exibe um resumo financeiro com saldo, gráficos de movimentação (Entradas vs. Saídas) e acesso rápido às principais operações.

### 4.2. Sistema PIX
*   **Envio de PIX**: Validação de saldo e destinatário.
*   **Recebimento**: Simulação de recebimento via chave.
*   **Gerenciamento de Chaves**: Cadastro e visualização de chaves PIX.
*   **QR Code**: Geração e simulação de pagamento via código.

### 4.3. Cartões
Área dedicada à gestão de cartões, permitindo visualizar detalhes, saldo disponível no limite e a funcionalidade de bloquear/desbloquear cartões instantaneamente.

### 4.4. Transferências e Depósitos
*   **Transferências**: Simulador de transferências via PIX e TED/DOC.
*   **Depósitos**: Geração de QR Code PIX, Boletos e consulta de dados bancários para depósito.
*   **Pagamento de Boletos**: Simulação de pagamento de boletos via código de barras.

### 4.5. Extrato Bancário
*   **Extrato Detalhado**: Histórico detalhado de transações com filtros por categoria.
*   **Exportação em PDF**: Funcionalidade para gerar e baixar um documento PDF profissional com o extrato consolidado.

### 4.6. Histórico de Acesso
*   **Registro de Segurança**: Registro de segurança com dispositivos e locais de acesso.

## 5. Estrutura de Pastas
```text
src/
├── components/     # Componentes reutilizáveis (shadcn/ui e customizados)
├── context/        # Contextos do React (Estado Global)
├── hooks/          # Hooks customizados para lógica de UI
├── lib/            # Configurações de bibliotecas (ex: utils do shadcn)
├── pages/          # Páginas principais da aplicação
├── services/       # Lógica de negócio, simulação de API e Banco de Dados
├── utils/          # Funções utilitárias (formatadores, máscaras, etc.)
└── assets/         # Imagens, fontes e recursos estáticos
```

## 6. Como Executar o Projeto
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. O sistema estará disponível em `http://localhost:5173`.

---
*Documentação gerada em 09/03/2026 para o projeto ALFA Bank.*
