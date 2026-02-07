"use strict";
/// <reference types="cypress" />
Object.defineProperty(exports, "__esModule", { value: true });
Cypress.Commands.add('login', function (email, password) {
    if (email === void 0) { email = 'admin@projedata.com.br'; }
    if (password === void 0) { password = 'admin123'; }
    cy.request({
        method: 'POST',
        url: "".concat(Cypress.config('baseUrl'), "/api/auth/login"),
        body: { email: email, password: password },
    }).then(function (response) {
        window.localStorage.setItem('token', response.body.access_token);
        window.localStorage.setItem('user', JSON.stringify(response.body.user));
    });
});
