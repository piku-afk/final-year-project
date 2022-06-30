/// <reference types="cypress" />

describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('correctly render homepage', () => {
    cy.get('h1').contains('Secure');
  });
});

export {};
