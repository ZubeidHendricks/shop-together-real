const Client = require('shopify-buy');

const shopifyClient = Client.buildClient({
  domain: process.env.SHOPIFY_SHOP_NAME,
  storefrontAccessToken: process.env.SHOPIFY_ACCESS_TOKEN
});

class ShopifyService {
  static async getProducts(query = {}) {
    try {
      const products = await shopifyClient.product.fetchAll();
      return products;
    } catch (error) {
      console.error('Shopify getProducts error:', error);
      throw error;
    }
  }

  static async getProduct(productId) {
    try {
      const product = await shopifyClient.product.fetch(productId);
      return product;
    } catch (error) {
      console.error('Shopify getProduct error:', error);
      throw error;
    }
  }

  static async createCheckout(lineItems) {
    try {
      const checkout = await shopifyClient.checkout.create();
      await shopifyClient.checkout.addLineItems(checkout.id, lineItems);
      return checkout;
    } catch (error) {
      console.error('Shopify createCheckout error:', error);
      throw error;
    }
  }
}

module.exports = ShopifyService;