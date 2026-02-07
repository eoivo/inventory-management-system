/// <reference types="cypress" />

export { };

Cypress.Commands.add('login', (email = 'admin@projedata.com.br', password = 'admin123') => {
    cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/auth/login`,
        body: { email, password },
    }).then((response) => {
        window.localStorage.setItem('token', response.body.access_token);
        window.localStorage.setItem('user', JSON.stringify(response.body.user));
    });
});

declare global {
    namespace Cypress {
        interface Chainable {
            login(email?: string, password?: string): Chainable<void>;
        }
    }
}
