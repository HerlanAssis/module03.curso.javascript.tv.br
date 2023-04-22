/// <reference types="cypress" />

// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
export {};
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(selector: string): Chainable<JQuery<Node>>;
      addToCart({ indexes }: { indexes: 'all' | number[] }): void;
      //   login(email: string, password: string): Chainable<void>
      //   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //   dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //   visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}

Cypress.Commands.add('getByTestId', (selector: string) => {
  return cy.get(`[data-testid="${selector}"]`);
});

Cypress.Commands.add('addToCart', ({ indexes }) => {
  cy.getByTestId('product-cart-tid').as('productList');

  const addProductOnCart = (index: number, isLast: boolean) => {
    cy.get('@productList').eq(index).find('button').click();

    if (!isLast) cy.getByTestId('close-cart-tid').click();
  };

  if (indexes === 'all') {
    cy.get('@productList').then(($elements: JQuery<HTMLElement>) => {
      for (let i = 0; i < $elements.length; i++) addProductOnCart(i, i === $elements.length - 1);
    });
  }

  if (Array.isArray(indexes)) {
    indexes.forEach((pindex, i) => {
      addProductOnCart(pindex, i === indexes.length - 1);
    });
  }
});
