# Industrial Inventory Management System 🏭

Sistema de gestão de inventário industrial para controle de produtos, matérias-primas e sugestões de produção otimizadas. Desenvolvido para o case técnico da Projedata.

### 🌐 Live Demo & API
- **Frontend App**: [https://inventory-management-frontend-orcin.vercel.app/](https://inventory-management-frontend-orcin.vercel.app/)
- **API Documentation (Swagger)**: [https://inventory-backend-3dx5.onrender.com/api](https://inventory-backend-3dx5.onrender.com/api)
- **Base API URL**: [https://inventory-backend-3dx5.onrender.com](https://inventory-backend-3dx5.onrender.com)

## 🚀 Tecnologias

### Backend
- **NestJS** - Framework Node.js para aplicações escaláveis
- **Prisma 7** - ORM moderno para PostgreSQL
- **PostgreSQL** (Neon.tech) - Banco de dados relacional
- **Swagger** - Documentação interativa da API
- **Jest** - Suite de testes unitários (95% coverage)

### Frontend
- **React 19** - Biblioteca UI com as últimas funcionalidades
- **Vite** - Build tool ultra-rápida
- **Redux Toolkit** - Gerenciamento de estado global
- **Tailwind CSS** - Estilização moderna e responsiva
- **Lucide React** - Set de ícones premium

### Testes & Qualidade
- **Vitest** - Suite de testes unitários ultra-rápida (Frontend)
- **Jest** - Suite de testes unitários (Backend)
- **Cypress** - Testes de ponta a ponta (E2E)
- **v8/Istanbul** - Relatórios detalhados de cobertura

## 🏗️ Estrutura do Projeto

```
inventory-management-system/
├── backend/                 # API NestJS
│   ├── prisma/              # Schema, migrations e seeds
│   ├── src/
│   │   ├── database/        # Módulo Prisma
│   │   ├── products/        # CRUD de produtos
│   │   ├── raw-materials/   # CRUD de matérias-primas
│   │   ├── product-materials/ # Gerenciamento de BOM (materiais por produto)
│   │   └── production/      # Algoritmo de sugestão inteligente
│   └── package.json
├── frontend/                # React App
│   ├── src/
│   │   ├── components/      # UI Components
│   │   ├── pages/           # Views da aplicação
│   │   ├── store/           # Redux logic (slices)
│   │   └── services/        # Integração com API
│   └── package.json
└── docker-compose.yml       # PostgreSQL local dev server
```

## 🧪 Qualidade de Software

Este projeto foi desenvolvido com foco em alta testabilidade e previsibilidade.

### Backend
- **Unitários**: 83 testes passando com **95.37% de cobertura global**.
- **Services & Controllers**: 100% de cobertura funcional.
- **Validação**: Rigorosa com `class-validator` e `class-transformer`.

### Frontend
- **Unitários**: 134 testes passando com **~95% de cobertura global**.
- **Core Logic**: Store (Redux) e Services com 100% de cobertura de linhas.
- **Integração (E2E)**: Fluxos críticos validados com Cypress.

## 🚀 Comandos de Teste

| Camada | Comando | Descrição |
| :--- | :--- | :--- |
| **Backend** | `npm run test:cov` (na pasta /backend) | Testes unitários + Relatório de cobertura |
| **Frontend** | `npm run test:coverage` (na pasta /frontend) | Testes unitários + Relatório de cobertura |
| **E2E** | `npm run cypress:run` (na pasta /frontend) | Execução de testes de integração E2E |

## 🧠 Algoritmo de Sugestão de Produção

O sistema utiliza um **Algoritmo Guloso (Greedy Algorithm)** para maximizar o valor da produção baseado no estoque disponível:

1. **Priorização**: Ordena produtos pelo valor de mercado (Unit Value).
2. **Cálculo de Capacidade**: Identifica o material limitante para cada produto.
3. **Alocação Inteligente**: Produz o máximo possível do produto mais valioso e utiliza o estoque remanescente para os próximos da lista.
4. **Relatório Detalhado**: Retorna exatamente quanto de cada material foi consumido em cada etapa.

## ⚙️ Configuração Local

### Requisitos
- Node.js 22+
- Docker (opcional para rodar banco local)

### Backend
1. Entre na pasta `backend`
2. `npm install`
3. Configure o `.env` (exemplo no `.env.example`)
4. `npx prisma db push`
5. `npm run db:seed` (Popula dados de teste)
6. `npm run db:clear` (Limpa dados mantendo apenas usuários)
7. `npm run start:dev`

### Frontend
1. Entre na pasta `frontend`
2. `npm install`
3. `npm run dev`

## 🔗 URLs Úteis

### Ambiente de Produção
- **Frontend**: [https://inventory-management-frontend-orcin.vercel.app/](https://inventory-management-frontend-orcin.vercel.app/)
- **Swagger Docs**: [https://inventory-backend-3dx5.onrender.com/api](https://inventory-backend-3dx5.onrender.com/api)

### Ambiente Local
- **Backend**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api
- **Frontend**: http://localhost:5173

## 📝 Licença
MIT
