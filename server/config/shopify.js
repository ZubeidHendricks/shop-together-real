const { Shopify } = require('@shopify/shopify-api');

const shopifyConfig = {
  shopName: process.env.SHOPIFY_SHOP_NAME,
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecret: process.env.SHOPIFY_API_SECRET,
  scopes: [
    'read_products',
    'write_products',
    'read_orders',
    'write_orders',
    'read_inventory',
    'write_inventory'
  ],
  hostName: process.env.HOST.replace(/https?:\/\//, ''),
  apiVersion: '2024-01',
  isEmbeddedApp: true
};

const initializeShopify = () => {
  Shopify.Context.initialize({
    API_KEY: shopifyConfig.apiKey,
    API_SECRET_KEY: shopifyConfig.apiSecret,
    SCOPES: shopifyConfig.scopes,
    HOST_NAME: shopifyConfig.hostName,
    API_VERSION: shopifyConfig.apiVersion,
    IS_EMBEDDED_APP: shopifyConfig.isEmbeddedApp,
    SESSION_STORAGE: new Shopify.Session.MemorySessionStorage()
  });
};

module.exports = {
  shopifyConfig,
  initializeShopify
};