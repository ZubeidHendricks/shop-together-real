const AnalyticsService = require('../services/AnalyticsService');

class AnalyticsController {
  static async getSessionAnalytics(req, res) {
    try {
      const { sessionId } = req.params;
      const analytics = await AnalyticsService.getSessionAnalytics(sessionId);
      
      if (!analytics) {
        return res.status(404).json({ error: 'Analytics not found' });
      }
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async trackEvent(req, res) {
    try {
      const { sessionId } = req.params;
      const { eventType, data } = req.body;

      await AnalyticsService.trackEvent(
        sessionId,
        req.user._id,
        eventType,
        data
      );

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AnalyticsController;