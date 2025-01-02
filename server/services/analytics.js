const Analytics = require('../models/Analytics');

class AnalyticsService {
  static async trackEvent(sessionId, eventType, data) {
    try {
      await Analytics.updateOne(
        { sessionId },
        {
          $push: {
            events: {
              type: eventType,
              timestamp: new Date(),
              data
            }
          }
        },
        { upsert: true }
      );
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  static async getSessionAnalytics(sessionId) {
    try {
      const analytics = await Analytics.findOne({ sessionId });
      return this.processAnalytics(analytics);
    } catch (error) {
      console.error('Analytics retrieval error:', error);
      return null;
    }
  }

  static processAnalytics(analytics) {
    if (!analytics) return null;

    return {
      summary: {
        totalDuration: this.calculateSessionDuration(analytics.events),
        participantCount: this.getUniqueParticipants(analytics.events),
        totalProducts: this.getProductViews(analytics.events),
        totalActions: analytics.events.length
      },
      timeline: analytics.events
    };
  }

  static calculateSessionDuration(events) {
    if (events.length < 2) return 0;
    const start = new Date(events[0].timestamp);
    const end = new Date(events[events.length - 1].timestamp);
    return (end - start) / 1000; // Duration in seconds
  }

  static getUniqueParticipants(events) {
    return new Set(
      events
        .filter(e => e.data.userId)
        .map(e => e.data.userId)
    ).size;
  }

  static getProductViews(events) {
    return events
      .filter(e => e.type === 'product_view')
      .reduce((acc, event) => {
        const productId = event.data.productId;
        acc[productId] = (acc[productId] || 0) + 1;
        return acc;
      }, {});
  }
}

module.exports = AnalyticsService;