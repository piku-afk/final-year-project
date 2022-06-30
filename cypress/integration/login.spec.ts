/// <reference types="cypress" />

const validEmail = 'test@test.com';
const validPassword = 'hello world';

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('submitting form when input field is empty', () => {
    cy.contains('button', /log in/i)
      .should('be.visible')
      .click();
    cy.get('input:invalid').should('have.length', 2);
  });

  it('submitting form with only invalid email', () => {
    cy.get('[type="email"]').type('hello');
    cy.contains('button', /log in/i).click();
    cy.get('input:invalid').should('have.length', 2);
  });

  it('submitting form without password', () => {
    cy.get('[type="password"]').type('hello');
    cy.contains('button', /log in/i).click();
    cy.get('input:invalid').should('have.length', 1);
  });

  it('submitting form without password', () => {
    cy.get('[type="password"]').type('hello');
    cy.contains('button', /log in/i).click();
    cy.get('input:invalid').should('have.length', 1);
  });

  it('submitting without password', () => {
    cy.get('[type="email"]').type(validEmail);
    cy.contains('button', /log in/i).click();
    cy.get('input:invalid').should('have.length', 1);
  });

  it('submitting form with correct data', () => {
    cy.intercept('POST', '/api/auth/login', (req) => {
      req.reply((res) => {
        res.send(401, {});
      });
    });

    cy.get('[type="email"]').type(validEmail);
    cy.get('[type="password"]').type(validPassword);
    cy.contains('button', /log in/i).click();
    cy.get('input:invalid').should('have.length', 0);
    cy.get('div')
      .contains(/incorrect email or password/i)
      .should('be.visible');
  });
});

export {};
