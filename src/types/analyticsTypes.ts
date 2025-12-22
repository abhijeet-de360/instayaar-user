
export interface Analytics {
  id: string;
  type: AnalyticsType;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'processing';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dateRange: {
    start: string;
    end: string;
  };
  metrics: Record<string, number | string>;
  chartData: ChartDataPoint[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type AnalyticsType = 
  | 'user_analytics'
  | 'booking_analytics'
  | 'revenue_analytics'
  | 'payment_analytics'
  | 'service_category_analytics'
  | 'freelancer_analytics'
  | 'employer_analytics'
  | 'geographic_analytics'
  | 'dispute_analytics'
  | 'withdrawal_analytics'
  | 'message_analytics'
  | 'seasonal_analytics';

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface AnalyticsFilters {
  type: string;
  category: string;
  status: string;
  priority: string;
  dateRange: string;
  search: string;
}

export interface AnalyticsStats {
  totalAnalytics: number;
  activeAnalytics: number;
  criticalAnalytics: number;
  recentAnalytics: number;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'area' | 'pie' | 'donut';
  xKey: string;
  yKey: string | string[];
  colors?: string[];
  title: string;
}
