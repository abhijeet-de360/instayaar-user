import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Share, Calendar, TrendingUp, BarChart3, PieChart, Users, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useToast } from '@/hooks/use-toast';
import { Analytics } from '@/types/analyticsTypes';
import analyticsData from '@/data/analyticsData.json';

export const AnalyticsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const analytics = analyticsData.analytics.find(a => a.id === id) as Analytics;
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area' | 'pie'>('bar');
  const [timeRange, setTimeRange] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!analytics) {
    return (
      <div className="h-screen bg-background flex overflow-hidden">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={() => {
            localStorage.removeItem('adminAuthenticated');
            navigate('/admin');
          }}
        />
        <div className="flex-1 overflow-auto bg-background">
          <main className="p-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Analytics Not Found</h1>
              <Button onClick={() => navigate('/admin?tab=analytics')}>
                Back to Analytics
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    // Export functionality
    toast({
      title: "Export Started",
      description: "Analytics report is being generated...",
    });
  };

  const handleShare = () => {
    // Share functionality
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Analytics link copied to clipboard",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'processing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatMetricValue = (value: number | string): string => {
    if (typeof value === 'number') {
      if (value > 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value > 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toLocaleString();
    }
    return value.toString();
  };

  const getChartColors = () => ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const renderChart = () => {
    const colors = getChartColors();
    const chartConfig = {};

    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <RechartsPieChart>
            <Pie
              data={analytics.chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
            >
              {analytics.chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ChartContainer config={chartConfig} className="min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={analytics.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={Object.keys(analytics.chartData[0] || {})[0]} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {Object.keys(analytics.chartData[0] || {}).slice(1).map((key, index) => (
                <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
              ))}
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={analytics.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={Object.keys(analytics.chartData[0] || {})[0]} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {Object.keys(analytics.chartData[0] || {}).slice(1).map((key, index) => (
                <Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} strokeWidth={2} />
              ))}
            </LineChart>
          ) : (
            <AreaChart data={analytics.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={Object.keys(analytics.chartData[0] || {})[0]} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {Object.keys(analytics.chartData[0] || {}).slice(1).map((key, index) => (
                <Area key={key} type="monotone" dataKey={key} stackId="1" stroke={colors[index % colors.length]} fill={colors[index % colors.length]} />
              ))}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </ChartContainer>
    );
  };

  const getAnalyticsIcon = (type: string) => {
    switch (type) {
      case 'user_analytics': return <Users className="w-6 h-6" />;
      case 'revenue_analytics': return <DollarSign className="w-6 h-6" />;
      case 'booking_analytics': return <BarChart3 className="w-6 h-6" />;
      default: return <TrendingUp className="w-6 h-6" />;
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AdminSidebar
        activeTab="analytics"
        setActiveTab={setActiveTab}
        onLogout={() => {
          localStorage.removeItem('adminAuthenticated');
          navigate('/admin');
        }}
      />
      
      <div className="flex-1 overflow-auto bg-background">
        <main className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin?tab=analytics')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Analytics
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                {getAnalyticsIcon(analytics.type)}
                <div>
                  <h1 className="text-2xl font-bold">{analytics.title}</h1>
                  <p className="text-muted-foreground">{analytics.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
                <Share className="w-4 h-4" />
                Share
              </Button>
              <Button onClick={handleExport} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Analytics Info */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Analytics ID</label>
                  <p className="font-mono text-sm">{analytics.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p>{analytics.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={`${getStatusColor(analytics.status)} text-white`}>
                      {analytics.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <div className="mt-1">
                    <Badge className={`${getPriorityColor(analytics.priority)} text-white`}>
                      {analytics.priority}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p>{analytics.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                  <p className="text-sm">
                    {new Date(analytics.dateRange.start).toLocaleDateString()} - {new Date(analytics.dateRange.end).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{new Date(analytics.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">{new Date(analytics.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.entries(analytics.metrics).map(([key, value]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-2xl font-bold mt-1">{formatMetricValue(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Data Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Chart Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg p-4">
                {renderChart()}
              </div>
            </CardContent>
          </Card>

          {/* Raw Data */}
          <Card>
            <CardHeader>
              <CardTitle>Raw Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      {Object.keys(analytics.chartData[0] || {}).map(key => (
                        <th key={key} className="border border-border p-3 text-left font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.chartData.map((row, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="border border-border p-3">
                            {typeof value === 'number' ? formatMetricValue(value) : value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsDetails;
