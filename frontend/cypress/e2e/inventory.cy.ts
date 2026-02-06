describe('Inventory Management System', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should load the dashboard', () => {
        cy.contains('Dashboard').should('be.visible');
        cy.contains('Visão geral').should('be.visible');
    });

    it('should navigate to Products page', () => {
        cy.get('nav').contains('Produtos').click();
        cy.url().should('include', '/products');
        cy.contains('Produtos').should('be.visible');
    });

    it('should navigate to Materials page', () => {
        cy.get('nav').contains('Matérias-Primas').click();
        cy.url().should('include', '/materials');
        cy.contains('Matérias-Primas').should('be.visible');
    });

    it('should navigate to Production suggestions page', () => {
        cy.get('nav').contains('Produção').click();
        cy.url().should('include', '/production');
        cy.contains('Sugestões de Produção').should('be.visible');
    });

    it('should complete a full Raw Material creation flow', () => {
        const materialCode = `TEST-${Date.now()}`;

        // 1. Go to materials page
        cy.get('nav').contains('Matérias-Primas').click();

        // 2. Open modal
        cy.contains('Nova Matéria-Prima').click();

        // 3. Fill form - Using placeholder since 'name' attribute is missing
        cy.get('input[placeholder="Ex: RM001"]').type(materialCode);
        cy.get('input[placeholder="Nome da matéria-prima"]').type('Material de Teste Cypress');
        cy.get('input[type="number"]').clear().type('500');

        // 4. Submit
        cy.get('button[type="submit"]').click();

        // 5. Verify it exists in the table
        cy.contains(materialCode).should('be.visible');
        cy.contains('Material de Teste Cypress').should('be.visible');
    });

    it('should verify the "Back to Products" button in Product Materials page', () => {
        // Go to products
        cy.get('nav').contains('Produtos').click();

        // Click on the first product's BOM/Materials link (first to avoid duplicates)
        cy.get('table tbody tr').first().find('a[href*="/materials"]').first().click();

        // Verify we are in the materials page of the product
        cy.url().should('include', '/materials');
        cy.contains('Materiais do Produto').should('be.visible');

        // Click the new "Back" button
        cy.contains('Voltar para Produtos').click();

        // Verify we are back
        cy.url().should('match', /\/products$/);
        cy.contains('Produtos').should('be.visible');
    });
});
