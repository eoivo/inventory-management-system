describe('Inventory Management System', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should load the dashboard', () => {
        cy.contains('Dashboard').should('be.visible');
        cy.contains('Visão Geral').should('be.visible');
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
        cy.get('nav').contains('Sugestão de Produção').click();
        cy.url().should('include', '/production');
        cy.contains('Sugestões de Produção').should('be.visible');
    });
});
