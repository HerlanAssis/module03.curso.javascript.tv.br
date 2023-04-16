import { Server } from 'miragejs'
import { AnyRegistry } from 'miragejs/-types'
import { makeServer } from '../../miragejs/server'

context('Store', () => {
  let server: Server<AnyRegistry>
  const g = cy.get
  const gid = cy.getByTestId

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should display the store', () => {
    cy.visit('/')

    g('body').contains('Brand')
    g('body').contains('Wrist Watch')
  })

  context('Search bar', () => {
    it('should type in the search bar', () => {
      cy.visit('/')

      g("input[type='search']")
        .type('Some text here')
        .should('have.value', 'Some text here')
    })

    it("should return 1 product when search term 'Relógio bonito' is submited", () => {
      server.createList('product', 10)

      const searchTerm = 'Relógio bonito'

      server.create('product', {
        title: searchTerm,
      } as any)

      cy.visit('/')

      g("input[type='search']").type(searchTerm)
      g("form[data-testid='search-form-tid']").submit()

      gid('product-cart-tid').should('have.length', 1)
    })

    it('should not return any product', () => {
      server.createList('product', 10)

      cy.visit('/')

      g("input[type='search']").type('Relógio bonito')
      g("form[data-testid='search-form-tid']").submit()

      gid('product-cart-tid').should('have.length', 0)
      g('body').contains('0+ Product')
    })
  })

  context('Product list', () => {
    it("should display '0+ Product' when no product is returned", () => {
      cy.visit('/')

      gid('product-cart-tid').should('have.length', 0)
      g('body').contains('0+ Product')
    })

    it("should display '1+ Product' when 1 product is returned", () => {
      server.create('product')

      cy.visit('/')

      gid('product-cart-tid').should('have.length', 1)
      g('body').contains('1+ Product')
    })

    it("should display '10+ Products' when 10 products are returned", () => {
      server.createList('product', 10)

      cy.visit('/')

      gid('product-cart-tid').should('have.length', 10)
      g('body').contains('10+ Product')
    })
  })

  context('Shopping cart', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('should not display shopping cart when page is first loads', () => {
      gid('cart-tid').as('shoppingCart')

      gid('cart-tid').should('have.class', 'hidden')
      g("[data-testid='cart-tid']:visible").should('not.exist')
    })

    it('should not display "Clear cart" button when cart is empty', () => {
      g("[data-testid='toggle-cart-tid']").as('toggleButton')
      g('@toggleButton').click()

      gid('clear-cart-button-tid').should('not.be.visible')
    })

    it('should display shopping cart when cart item are clicked', () => {
      g("[data-testid='toggle-cart-tid']").as('toggleButton')

      g('@toggleButton').click()
      gid('cart-tid').should('not.have.class', 'hidden')
      g("[data-testid='cart-tid']:visible").should('exist')
    })

    it('should toggle shopping cart visibility when button is clicked', () => {
      gid('toggle-cart-tid').as('toggleButton')

      g('@toggleButton').click()
      gid('cart-tid').should('not.have.class', 'hidden')
      g("[data-testid='cart-tid']:visible").should('exist')

      gid('toggle-cart').click()
      gid('cart-tid').should('have.class', 'hidden')
      g("[data-testid='cart-tid']:visible").should('not.exist')
    })

    it('shoud open shopping cart when a product are added', () => {
      server.createList('product', 10)

      cy.reload()

      gid('cart-tid').should('have.class', 'hidden')
      g("[data-testid='cart-tid']:visible").should('not.exist')

      gid('product-cart-tid').first().find('button').click()
      g("[data-testid='cart-tid']:visible").should('exist')
      gid('cart-tid').should('not.have.class', 'hidden')
    })

    it('shoud add selected product to the cart', () => {
      server.create('product', {
        id: 'my-custom-product',
        title: 'Relógio bonito',
      } as any)
      server.createList('product', 10)

      cy.reload()

      gid('cart-tid').should('have.class', 'hidden')
      g("[data-testid='cart-tid']:visible").should('not.exist')

      // gid("product-cart").first().find("button").click()
      gid('add-to-cart-my-custom-product-tid').click()
      g("[data-testid='cart-tid']:visible").should('exist')
      gid('cart-tid').should('not.have.class', 'hidden')

      gid('cart-tid').contains('Relógio bonito')
    })

    it('should add 1 product to the cart', () => {
      server.createList('product', 10)

      cy.reload()

      cy.addToCart({ indexes: [1] })

      gid('cart-item-tid').should('have.length', 1)
    })

    it('should add 3 products to the cart', () => {
      server.createList('product', 10)

      cy.reload()

      cy.addToCart({ indexes: [1, 4, 7] })

      gid('cart-item-tid').should('have.length', 3)
    })

    it('should add all products to the cart', () => {
      server.createList('product', 10)

      cy.reload()

      cy.addToCart({ indexes: 'all' })

      gid('cart-item-tid').should('have.length', 10)
    })

    it('should remove a product from the cart', () => {
      server.createList('product', 10)

      cy.reload()

      cy.addToCart({ indexes: [0] })

      gid('cart-item-tid').should('have.length', 1)
      gid('remove-button-tid').click()

      gid('cart-item-tid').should('have.length', 0)
      gid('cart-tid').contains('Cart is empty')
    })

    it("should display 'Cart is empty' when has no message in the shopping cart", () => {
      gid('toggle-cart-tid').click()
      gid('cart-tid').contains('Cart is empty')
    })

    it('should clear cart when "Clear Cart" button is clicked', () => {
      server.createList('product', 10)

      cy.reload()

      cy.addToCart({ indexes: 'all' })
      gid('cart-item-tid').should('have.length', 10)

      gid('clear-cart-button-tid').click()
      gid('cart-item-tid').should('have.length', 0)
      gid('cart-tid').contains('Cart is empty')
    })

    it('should clear cleart items if checkout has successfully', () => {
      server.createList('product', 10)

      cy.reload()

      cy.addToCart({ indexes: 'all' })

      gid('cart-item-tid').should('have.length', 10)

      gid('checkout-cart-button-tid').click()
      g("[data-testid='cart-tid']:visible").should('not.exist')
    })

    it('should display quantity 1 when product is added to the cart', () => {
      server.createList('product', 10)

      cy.reload()

      cy.addToCart({ indexes: [0] })

      gid('quantity').first().contains('1')
    })

    it('should increase quantity when plus button is clicked', () => {
      server.createList('product', 10)

      cy.reload()

      cy.addToCart({ indexes: [0] })

      gid('increaseButton').first().click()
      gid('quantity').first().contains('2')
      gid('increaseButton').first().click()
      gid('quantity').first().contains('3')
    })

    it('should decrease quantity when minus button is clicked', () => {
      server.createList('product', 10)

      cy.reload()

      cy.addToCart({ indexes: [0] })

      gid('increaseButton').first().click()
      gid('quantity').first().contains('2')
      gid('increaseButton').first().click()
      gid('quantity').first().contains('3')

      gid('decreaseButton').first().click()
      gid('quantity').first().contains('2')
    })

    it('should not decrease below zero when when minus button is clicked', () => {
      server.createList('product', 10)

      cy.reload()

      cy.addToCart({ indexes: [0] })

      gid('decreaseButton').first().click()
      gid('decreaseButton').first().should('be.disabled')

      gid('quantity').first().contains('0')
    })
  })
})
