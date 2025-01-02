const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Product = require('../models/Product');

// Verify Shopify webhook
const verifyShopifyWebhook = (req, res, next) => {
  const hmac = req.get('X-Shopify-Hmac-Sha256');
  const body = req.body;
  
  const hash = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET)
    .update(body)
    .digest('base64');

  if (hash === hmac) {
    next();
  } else {
    res.status(401).send('Invalid webhook signature');
  }
};

// Product update webhook
router.post('/products/update', verifyShopifyWebhook, async (req, res) => {
  try {
    const product = req.body;
    
    await Product.findOneAndUpdate(
      { productId: product.id },
      {
        title: product.title,
        description: product.body_html,
        price: product.variants[0].price,
        images: product.images.map(img => img.src),
        variants: product.variants,
        shopifyData: product,
        updatedAt: new Date()
      },
      { upsert: true }
    );

    res.status(200).send('OK');
  } catch (error) {
    console.error('Product update webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

// Product delete webhook
router.post('/products/delete', verifyShopifyWebhook, async (req, res) => {
  try {
    const productId = req.body.id;
    await Product.deleteOne({ productId });
    res.status(200).send('OK');
  } catch (error) {
    console.error('Product delete webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

module.exports = router;