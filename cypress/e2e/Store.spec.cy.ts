context('Store', () => {
  const g = cy.get;
  const gid = cy.getByTestId;

  it('should display the store', () => {
    cy.visit('/');

    g('body').contains('Brand');
    g('body').contains('Wrist Watch');
  });

  context('Search bar', () => {
    it('should type in the search bar', () => {
      cy.visit('/');

      g("input[type='search']").type('Some text here');

      g("input[type='search']").should('have.value', 'Some text here');
    });
  });

  context('Product list', () => {
    it("should display '500 Products' when 500 products are returned", () => {
      cy.visit('/');

      gid('product-cart-tid').should('have.length', 500);
      g('body').contains('500 Products');
    });
  });

  context('Shopping cart', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should not display shopping cart when page is first loads', () => {
      gid('cart-tid').as('shoppingCart');

      gid('cart-tid').should('have.class', 'hidden');
      g("[data-testid='cart-tid']:visible").should('not.exist');
    });

    it('should not display "Clear cart" button when cart is empty', () => {
      g("[data-testid='toggle-cart-tid']").as('toggleButton');
      g('@toggleButton').click();

      gid('clear-cart-button-tid').should('not.exist');
    });

    it('should display shopping cart when cart item are clicked', () => {
      g("[data-testid='toggle-cart-tid']").as('toggleButton');

      g('@toggleButton').click();
      gid('cart-tid').should('not.have.class', 'hidden');
      g("[data-testid='cart-tid']:visible").should('exist');
    });

    it('should toggle shopping cart visibility when button is clicked', () => {
      gid('toggle-cart-tid').as('toggleButton');

      g('@toggleButton').click();
      gid('cart-tid').should('not.have.class', 'hidden');
      g("[data-testid='cart-tid']:visible").should('exist');

      gid('close-cart-tid').click();
      gid('cart-tid').should('have.class', 'hidden');
      g("[data-testid='cart-tid']:visible").should('not.exist');
    });

    it('shoud open shopping cart when a product are added', () => {
      gid('cart-tid').should('have.class', 'hidden');
      g("[data-testid='cart-tid']:visible").should('not.exist');

      gid('product-cart-tid').first().find('button').click();
      g("[data-testid='cart-tid']:visible").should('exist');
      gid('cart-tid').should('not.have.class', 'hidden');
    });

    it('shoud add selected product to the cart', () => {
      gid('cart-tid').should('have.class', 'hidden');
      g("[data-testid='cart-tid']:visible").should('not.exist');

      gid('product-cart-tid').first().find('button').click();
      g("[data-testid='cart-tid']:visible").should('exist');
      gid('cart-tid').should('not.have.class', 'hidden');
    });

    it('should add 1 product to the cart', () => {
      cy.addToCart({ indexes: [1] });

      gid('cart-item-tid').should('have.length', 1);
    });

    it('should add 3 products to the cart', () => {
      cy.addToCart({ indexes: [1, 4, 7] });

      gid('cart-item-tid').should('have.length', 3);
    });

    // it('should add all products to the cart', () => {

    //   cy.addToCart({ indexes: 'all' });

    //   gid('cart-item-tid').should('have.length', 10);
    // });

    it('should remove a product from the cart', () => {
      cy.addToCart({ indexes: [0] });

      gid('cart-item-tid').should('have.length', 1);
      gid('remove-button-tid').click();

      gid('cart-item-tid').should('have.length', 0);
      gid('cart-tid').contains('There are no items in the cart');
    });

    it("should display 'There are no items in the cart' when has no message in the shopping cart", () => {
      gid('toggle-cart-tid').click();
      gid('cart-tid').contains('There are no items in the cart');
    });

    it('should clear cart when "Clear Cart" button is clicked', () => {
      cy.addToCart({ indexes: [1, 4, 7] });
      gid('cart-item-tid').should('have.length', 3);

      gid('clear-cart-button-tid').click();
      gid('cart-item-tid').should('have.length', 0);
      gid('cart-tid').contains('There are no items in the cart.');
    });

    it('should clear cleart items if checkout has successfully', () => {
      cy.addToCart({ indexes: [1, 4, 7] });

      gid('cart-item-tid').should('have.length', 3);

      gid('checkout-cart-button-tid').click();
      g("[data-testid='cart-tid']:visible").should('not.exist');
    });

    it('should display quantity 1 when product is added to the cart', () => {
      cy.addToCart({ indexes: [0] });

      gid('quantity-tid').first().contains('1');
    });

    it('should increase quantity when plus button is clicked', () => {
      cy.addToCart({ indexes: [0] });

      gid('increase-button-tid').first().click();
      gid('quantity-tid').first().contains('2');
      gid('increase-button-tid').first().click();
      gid('quantity-tid').first().contains('3');
    });

    it('should decrease quantity when minus button is clicked', () => {
      cy.addToCart({ indexes: [0] });

      gid('increase-button-tid').first().click();
      gid('quantity-tid').first().contains('2');
      gid('increase-button-tid').first().click();
      gid('quantity-tid').first().contains('3');

      gid('decrease-button-tid').first().click();
      gid('quantity-tid').first().contains('2');
    });

    it('should not decrease below zero when when minus button is clicked', () => {
      cy.addToCart({ indexes: [0] });

      gid('decrease-button-tid').first().click();
      gid('decrease-button-tid').first().should('be.disabled');

      gid('quantity-tid').first().contains('0');
    });
  });
});
