const Product = require('../models/Product');
const Analytics = require('../models/Analytics');

class RecommendationService {
  static async getPersonalizedRecommendations(userId, sessionId) {
    try {
      // Get user's shopping history
      const history = await Analytics.find({
        'events.data.userId': userId,
        'events.type': 'product_view'
      });

      // Get current session views
      const sessionViews = await Analytics.findOne({
        sessionId,
        'events.type': 'product_view'
      });

      // Analyze preferences
      const preferences = this.analyzePreferences(history, sessionViews);

      // Get recommendations
      const recommendations = await this.findSimilarProducts(preferences);

      return recommendations;
    } catch (error) {
      console.error('Recommendation error:', error);
      throw error;
    }
  }

  static analyzePreferences(history, sessionViews) {
    const categories = new Map();
    const brands = new Map();
    const priceRanges = new Map();

    // Process historical data
    history.forEach(session => {
      session.events
        .filter(e => e.type === 'product_view')
        .forEach(event => {
          const { category, brand, price } = event.data;
          
          categories.set(category, (categories.get(category) || 0) + 1);
          brands.set(brand, (brands.get(brand) || 0) + 1);
          priceRanges.set(this.getPriceRange(price), 
            (priceRanges.get(this.getPriceRange(price)) || 0) + 1);
        });
    });

    return {
      topCategories: this.getTopItems(categories, 3),
      topBrands: this.getTopItems(brands, 3),
      preferredPriceRanges: this.getTopItems(priceRanges, 2)
    };
  }

  static async findSimilarProducts(preferences) {
    const { topCategories, topBrands, preferredPriceRanges } = preferences;

    // Build query based on preferences
    const query = {
      $or: [
        { category: { $in: topCategories } },
        { brand: { $in: topBrands } }
      ],
      price: {
        $gte: preferredPriceRanges[0].min,
        $lte: preferredPriceRanges[0].max
      }
    };

    const products = await Product.find(query)
      .limit(10)
      .sort({ rating: -1 });

    return products;
  }

  static getTopItems(map, count) {
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(item => item[0]);
  }

  static getPriceRange(price) {
    if (price < 50) return { min: 0, max: 50 };
    if (price < 100) return { min: 50, max: 100 };
    if (price < 200) return { min: 100, max: 200 };
    return { min: 200, max: Infinity };
  }
}

module.exports = RecommendationService;