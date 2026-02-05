# Inventory Management System - Project Overview

## Case Information

**Company:** Projedata Informática  
**Position:** Desenvolvedor de Software Full Stack Júnior  
**Phase:** Teste Prático (Mão na massa)  
**Developer:** Ivo Martins Fernandes

---

## Business Context

### Company Profile
Projedata é uma empresa especializada em desenvolvimento e implantação de software para gestão integrada (ERP), com mais de 20 anos no mercado. A empresa possui foco em indústrias de embalagens flexíveis e plásticos, oferecendo soluções como:
- **Iniflex** (ERP principal)
- Ferramentas de BI, APS e MES

### Target Market
- Indústrias que produzem produtos diversos
- Necessidade de controle de estoque de insumos (matérias-primas)
- Gestão de produção baseada em disponibilidade de materiais

---

## Problem Statement

Uma indústria precisa controlar o estoque dos insumos necessários para produção de seus itens fabricados. O sistema deve:

1. **Manter cadastros de:**
   - Produtos (código, nome, valor)
   - Matérias-primas (código, nome, quantidade em estoque)
   - Associações produto-material (quantidade necessária de cada material)

2. **Fornecer inteligência de produção:**
   - Quais produtos podem ser produzidos com o estoque atual
   - Quantidades possíveis de produção
   - Valor total da produção sugerida
   - Priorização por produtos de maior valor

3. **Regra de negócio crítica:**
   - Uma matéria-prima pode ser usada em múltiplos produtos
   - Sistema deve priorizar produtos de maior valor
   - Otimização de aproveitamento do estoque

---

## System Objectives

### Primary Goals
1. Controle eficiente de estoque de matérias-primas
2. Gestão completa do catálogo de produtos
3. Mapeamento de composição de produtos (BOM - Bill of Materials)
4. Sugestão inteligente de produção baseada em estoque disponível

### Business Value
- Maximização de receita através de produção estratégica
- Redução de desperdício de matérias-primas
- Visibilidade em tempo real do potencial produtivo
- Decisões baseadas em dados concretos

---

## Technical Challenge

### Core Algorithm
Implementar um sistema de sugestão de produção que:
1. Analisa todo o estoque disponível
2. Calcula quantos de cada produto podem ser fabricados
3. Prioriza produtos por valor unitário
4. Aloca matérias-primas otimizadamente
5. Retorna plano de produção com valor total

### Complexity Factors
- Múltiplos produtos competindo pelas mesmas matérias-primas
- Necessidade de algoritmo de alocação eficiente
- Performance em escalas maiores (muitos produtos/materiais)
- Manutenção de integridade referencial

---

## Success Criteria

### Functional Requirements (Mandatory)
- ✅ CRUD completo de Produtos
- ✅ CRUD completo de Matérias-Primas
- ✅ CRUD de Associações Produto-Material
- ✅ Consulta de Produção com algoritmo de sugestão

### Non-Functional Requirements (Mandatory)
- ✅ Plataforma Web (Chrome, Firefox, Edge)
- ✅ Arquitetura API (Backend/Frontend separados)
- ✅ Interface responsiva
- ✅ Banco de dados relacional (PostgreSQL/MySQL/Oracle)
- ✅ Código em inglês (variáveis, tabelas, colunas)

### Desirable (Differentiators)
- 🎯 Testes unitários (backend/frontend)
- 🎯 Testes de integração (Cypress sugerido)
- 🎯 Deploy com links funcionais
- 🎯 Documentação clara e completa

---

## Strategic Decisions

### Technology Stack

**Backend**
- Framework: **NestJS** (Node.js)
- Language: **TypeScript**
- ORM: **Prisma**
- Database: **PostgreSQL**
- Tests: **Jest + Supertest**

**Rationale:** Developer has proven experience with Node.js ecosystem. NestJS provides enterprise-grade architecture similar to Quarkus/Spring (mentioned in job description).

**Frontend**
- Framework: **React 19**
- Language: **TypeScript**
- State Management: **Redux Toolkit**
- Styling: **Tailwind CSS**
- Components: **Shadcn/UI**
- Tests: **Jest + React Testing Library**

**Rationale:** All technologies explicitly suggested in job requirements and case description. Developer has extensive experience with this stack.

### Architecture Pattern
- **Clean Architecture** principles
- **Repository Pattern** for data access
- **Service Layer** for business logic
- **DTO Pattern** for data transfer
- **Dependency Injection** (NestJS native)

---

## Project Structure

```
inventory-management-system/
├── backend/
│   ├── src/
│   │   ├── products/
│   │   ├── raw-materials/
│   │   ├── product-materials/
│   │   ├── production/
│   │   ├── database/
│   │   └── common/
│   ├── test/
│   ├── prisma/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   ├── components/
│   │   ├── store/
│   │   ├── services/
│   │   └── styles/
│   ├── tests/
│   └── package.json
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   ├── DEVELOPMENT_BACKEND.md
│   ├── DEVELOPMENT_FRONTEND.md
│   ├── DATABASE_SCHEMA.md
│   ├── BUSINESS_RULES.md
│   └── STYLEGUIDE.md
├── docker-compose.yml
└── README.md
```

---

## Development Phases

### Phase 1: Foundation (Priority 1)
1. Setup project structure
2. Configure database with Prisma
3. Implement Products CRUD (RF001, RF005)
4. Implement Raw Materials CRUD (RF002, RF006)

### Phase 2: Core Business Logic (Priority 1)
1. Implement Product-Material associations (RF003, RF007)
2. Develop production suggestion algorithm (RF004)
3. Create production consultation interface (RF008)

### Phase 3: Quality Assurance (Priority 2)
1. Unit tests for all services
2. Integration tests for critical flows
3. Component tests for UI

### Phase 4: Polish & Deploy (Priority 3)
1. Deploy backend (Railway/Render)
2. Deploy frontend (Vercel)
3. Final documentation
4. Demo data seeding

### Phase 5: Differentiators (Optional)
1. Swagger/OpenAPI documentation
2. Production dashboard with charts
3. E2E tests with Cypress
4. Performance optimizations
5. Advanced error handling

---

## Quality Standards

### Code Quality
- ESLint + Prettier configured
- Semantic commit messages
- Meaningful variable/function names
- Code comments for complex logic
- No hardcoded values

### UI/UX Principles
- **NO EMOJIS in interface**
- Clean, professional design
- Consistent spacing and typography
- Clear error messages
- Loading states for async operations
- Empty states with guidance
- Responsive across devices

### Testing Coverage
- Target: 70%+ coverage
- All service methods tested
- Critical UI components tested
- Happy path + error scenarios

---

## Delivery Requirements

### GitHub Repository (Public)
- Clean commit history
- Descriptive README
- Setup instructions
- Environment variables documentation

### Live Demo (Optional but Recommended)
- Backend API accessible
- Frontend application deployed
- Functional end-to-end

### Code Review Preparation
- Be ready to explain architectural decisions
- Understand the production algorithm deeply
- Know trade-offs of chosen technologies
- Articulate testing strategy

---

## Risk Mitigation

### Potential Challenges
1. **Algorithm complexity**: Production suggestion logic
   - Mitigation: Start simple, iterate
   
2. **Time constraints**: Many features
   - Mitigation: Prioritize mandatory requirements
   
3. **Unfamiliar deployment**: First full-stack deploy
   - Mitigation: Use familiar platforms (Vercel/Railway)

### Fallback Plans
- If tests take too long: Focus on backend tests first
- If deployment fails: Provide local setup instructions
- If algorithm is too complex: Implement simpler greedy approach first

---

## Expected Outcomes

### Technical Demonstration
- Full-stack application working end-to-end
- Clean, maintainable code
- Professional UI/UX
- Test coverage showing quality mindset

### Interview Preparation
- Deep understanding of all implemented features
- Ability to discuss technical trade-offs
- Readiness to explain algorithm approach
- Showcase problem-solving skills

---

## Timeline

**Estimated Duration:** 5-7 days

**Daily Goals:**
- Day 1-2: Backend foundation + CRUD
- Day 3: Production algorithm + tests
- Day 4-5: Frontend implementation
- Day 6: Integration + deployment
- Day 7: Polish + documentation

---

## Additional Notes

### Job Alignment
This project demonstrates:
- Full-stack development capability
- API design and implementation
- Database modeling skills
- Problem-solving with algorithms
- Code quality consciousness
- Documentation practices
- Professional UI development

All aligned with Projedata's requirements for the Junior Full Stack Developer position.

### Personal Branding
This case study can be added to portfolio as:
- "Industrial Inventory Management System"
- Showcases ERP-adjacent development
- Demonstrates business logic implementation
- Real-world problem solving
