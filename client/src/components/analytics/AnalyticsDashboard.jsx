import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AnalyticsDashboard = ({ sessionId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [sessionId]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading analytics...</div>;
  if (!analytics) return <div>No analytics available</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium">Duration</h3>
              <p className="text-2xl font-bold">
                {Math.round(analytics.summary.totalDuration / 60)} minutes
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-medium">Participants</h3>
              <p className="text-2xl font-bold">
                {analytics.summary.participantCount}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-medium">Products Viewed</h3>
              <p className="text-2xl font-bold">
                {Object.keys(analytics.summary.totalProducts).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            width={600}
            height={300}
            data={analytics.timeline}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analytics.summary.totalProducts)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([productId, views]) => (
                <div
                  key={productId}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span>{productId}</span>
                  <span className="font-medium">{views} views</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;