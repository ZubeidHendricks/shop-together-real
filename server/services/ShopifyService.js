const Shopify = require('@shopify/shopify-api');

class ShopifyService {
  constructor() {
    this.client = new Shopify.Clients.Rest(
      process.env.SHOPIFY_SHOP_NAME,
      process.env.SHOPIFY_ACCESS_TOKEN
    );
  }

  async getProducts(query = {}) {
    try {
      const response = await this.client.get({
        path: 'products',
        query: {
          limit: query.limit || 50,
          ...query
        }
      });
      return response.body.products;
    } catch (error) {
      console.error('Shopify getProducts error:', error);
      throw error;
    }
  }

  async getProduct(productId) {
    try {
      const response = await this.client.get({
        path: `products/${productId}`
      });
      return response.body.product;
    } catch (error) {
      console.error('Shopify getProduct error:', error);
      throw error;
    }
  }

  async createCart(items) {
    try {
      const response = await this.client.post({
        path: 'cart/create',
        data: {
          items: items.map(item => ({
            variant_id: item.variantId,
            quantity: item.quantity
          }))
        }
      });
      return response.body.cart;
    } catch (error) {
      console.error('Shopify createCart error:', error);
      throw error;
    }
  }

  async createCheckout(cartId) {
    try {
      const response = await this.client.post({
        path: 'checkouts',
        data: {
          cart_id: cartId
        }
      });
      return response.body.checkout;
    } catch (error) {
      console.error('Shopify createCheckout error:', error);
      throw error;
    }
  }
}

module.exports = new ShopifyService();