/*
 * Mirage JS guide on Routes: https://miragejs.com/docs/route-handlers/functions
 */

// import { Response } from 'miragejs';

export default function routes() {
  this.namespace = 'api';

  /*
   * A resource comprises all operations for a CRUD
   * operation. .get(), .post(), .put() and delete().
   * Mirage JS guide on Resource: https://miragejs.com/docs/route-handlers/shorthands#resource-helper
   */
  this.resource('users');
  this.resource('products');

  this.post('checkout', (_, request) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const products = JSON.parse(request.requestBody);

      return new Response(
        200,
        {},
        // { errorMessage: 'Problemas ao carregar a lista, contate o administrador.' },
      );
    } catch {
      return new Response(500, {}, { errorMessage: 'Problemas ao recuperar a lista.' });
    }
  });

  /*
   * From your component use fetch('api/messages?userId=<a user id>')
   * replacing <a user id> with a real ID
   */
  this.get('messages', (schema, request) => {
    const {
      queryParams: { userId },
    } = request;

    return schema.messages.where({ userId });
  });
}
