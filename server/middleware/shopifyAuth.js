const { Shopify } = require('@shopify/shopify-api');

const shopifyAuth = async (req, res, next) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      false
    );

    if (!session) {
      return res.redirect(`/auth?shop=${req.query.shop}`);
    }

    const client = new Shopify.Clients.Rest(
      session.shop,
      session.accessToken
    );

    req.shopify = { session, client };
    next();
  } catch (error) {
    console.error('Shopify auth middleware error:', error);
    res.status(401).json({ error: 'Shopify authentication required' });
  }
};

module.exports = shopifyAuth;