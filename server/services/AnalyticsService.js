const Analytics = require('../models/Analytics');
const Session = require('../models/Session');

class AnalyticsService {
  static async trackEvent(sessionId, userId, eventType, data) {
    try {
      await Analytics.updateOne(
        { sessionId },
        {
          $push: {
            events: {
              userId,
              type: eventType,
              data,
              timestamp: new Date()
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
      const session = await Session.findOne({ sessionId });
      const analytics = await Analytics.findOne({ sessionId: session._id });

      if (!analytics) return null;

      return {
        summary: {
          duration: this.calculateSessionDuration(analytics.events),
          participantCount: this.getUniqueParticipants(analytics.events).size,
          productViews: this.getProductViewStats(analytics.events),
          cartActions: this.getCartActionStats(analytics.events)
        },
        events: this.processEvents(analytics.events)
      };
    } catch (error) {
      console.error('Analytics retrieval error:', error);
      return null;
    }
  }

  static calculateSessionDuration(events) {
    if (events.length < 2) return 0;
    const firstEvent = new Date(events[0].timestamp);
    const lastEvent = new Date(events[events.length - 1].timestamp);
    return (lastEvent - firstEvent) / 1000; // Duration in seconds
  }

  static getUniqueParticipants(events) {
    return new Set(events.map(event => event.userId.toString()));
  }

  static getProductViewStats(events) {
    return events
      .filter(e => e.type === 'product_view')
      .reduce((acc, event) => {
        const productId = event.data.productId;
        acc[productId] = (acc[productId] || 0) + 1;
        return acc;
      }, {});
  }

  static getCartActionStats(events) {
    return events
      .filter(e => ['add_to_cart', 'remove_from_cart'].includes(e.type))
      .map(event => ({
        type: event.type,
        productId: event.data.productId,
        userId: event.userId,
        timestamp: event.timestamp
      }));
  }

  static processEvents(events) {
    return events.map(event => ({
      type: event.type,
      timestamp: event.timestamp,
      userId: event.userId,
      data: event.data
    }));
  }
}

module.exports = AnalyticsService;