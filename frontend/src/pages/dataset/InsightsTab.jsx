import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, YAxis } from 'recharts';
import { 
  TrendingDown, 
  UserMinus, 
  Files, 
  PackageMinus, 
  TrendingUp, 
  CalendarClock, 
  Activity,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Info
} from 'lucide-react';

const MOCK_INSIGHTS = [
  {
    id: 'i1',
    type: 'revenue_drop',
    severity: 'critical',
    title: 'Sudden Revenue Drop Detected',
    description: 'AI detected a 14% drop in daily revenue starting October 12th compared to the previous 30-day moving average. This deviation is statistically significant (p < 0.01).',
    recommendation: 'Investigate potential payment gateway failures or recent pricing changes.',
    icon: TrendingDown,
    data: [
      { day: 1, val: 420 }, { day: 2, val: 450 }, { day: 3, val: 430 }, 
      { day: 4, val: 440 }, { day: 5, val: 460 }, { day: 6, val: 450 }, 
      { day: 7, val: 310 }, { day: 8, val: 290 }, { day: 9, val: 305 }
    ],
    chartType: 'line',
    color: '#ef4444' // red
  },
  {
    id: 'i2',
    type: 'customer_churn',
    severity: 'high',
    title: 'Customer Churn Risk Elevated',
    description: 'The churn prediction model indicates a 22% increase in high-value customer churn probability over the last week. 45 accounts show declining engagement signals.',
    recommendation: 'Trigger the "At-Risk Retention" email sequence for affected accounts.',
    icon: UserMinus,
    data: [
      { day: 1, val: 12 }, { day: 2, val: 14 }, { day: 3, val: 15 }, 
      { day: 4, val: 18 }, { day: 5, val: 24 }, { day: 6, val: 31 }, 
      { day: 7, val: 45 }
    ],
    chartType: 'bar',
    color: '#f97316' // orange
  },
  {
    id: 'i3',
    type: 'duplicate_invoices',
    severity: 'high',
    title: 'Data Quality: Duplicate Invoices',
    description: 'Found 12 instances of potentially duplicate invoices in the dataset. These share the same customer ID, amount, and date but have different internal sequence numbers.',
    recommendation: 'Review data ingestion pipeline for retry logic errors leading to double-inserts.',
    icon: Files,
    data: null,
    stat: '12',
    statLabel: 'Duplicates',
    color: '#f59e0b' // amber
  },
  {
    id: 'i4',
    type: 'inventory_shortage',
    severity: 'warning',
    title: 'Impending Inventory Shortage',
    description: 'Based on current sales velocity (145 units/day), SKU #8932 (Wireless Earbuds) will run out of stock in approximately 4 days. Current inventory is 580 units.',
    recommendation: 'Initiate expedited purchase order to supplier.',
    icon: PackageMinus,
    data: [
      { day: 1, val: 1200 }, { day: 2, val: 1050 }, { day: 3, val: 920 }, 
      { day: 4, val: 780 }, { day: 5, val: 580 }
    ],
    chartType: 'line',
    color: '#eab308' // yellow
  },
  {
    id: 'i5',
    type: 'sales_spike',
    severity: 'positive',
    title: 'Unusual Sales Spike',
    description: 'Product category "Home Office" saw a 310% anomalous spike in volume yesterday. Correlated with external mention on a major social media platform.',
    recommendation: 'Increase marketing spend on this category while momentum lasts.',
    icon: TrendingUp,
    data: [
      { day: 1, val: 120 }, { day: 2, val: 135 }, { day: 3, val: 110 }, 
      { day: 4, val: 125 }, { day: 5, val: 480 }, { day: 6, val: 510 }
    ],
    chartType: 'bar',
    color: '#22c55e' // green
  },
  {
    id: 'i6',
    type: 'seasonality',
    severity: 'info',
    title: 'Cyclical Seasonality Detected',
    description: 'Time-series analysis confirms strong weekly seasonality. Sales consistently peak on Thursdays and dip heavily on Sundays across all segments.',
    recommendation: 'Shift promotional email blasts to Wednesday evenings.',
    icon: CalendarClock,
    data: [
      { day: 1, val: 10 }, { day: 2, val: 20 }, { day: 3, val: 40 }, { day: 4, val: 80 }, { day: 5, val: 50 }, { day: 6, val: 30 }, { day: 7, val: 10 },
      { day: 8, val: 12 }, { day: 9, val: 22 }, { day: 10, val: 45 }, { day: 11, val: 85 }, { day: 12, val: 48 }, { day: 13, val: 28 }, { day: 14, val: 11 }
    ],
    chartType: 'line',
    color: '#3b82f6' // blue
  },
  {
    id: 'i7',
    type: 'trend_changes',
    severity: 'info',
    title: 'Macro Trend Shift: Mobile Checkout',
    description: 'The ratio of mobile to desktop checkouts has crossed the 60% threshold for the first time, establishing a new baseline macro trend.',
    recommendation: 'Prioritize mobile UI/UX improvements in the next sprint.',
    icon: Activity,
    data: [
      { day: 1, val: 45 }, { day: 2, val: 47 }, { day: 3, val: 51 }, 
      { day: 4, val: 54 }, { day: 5, val: 58 }, { day: 6, val: 62 }, { day: 7, val: 63 }
    ],
    chartType: 'line',
    color: '#8b5cf6' // purple
  },
];

const SEVERITY_CONFIG = {
  critical: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800/50', text: 'text-red-700 dark:text-red-400', icon: AlertTriangle },
  high: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800/50', text: 'text-orange-700 dark:text-orange-400', icon: AlertTriangle },
  warning: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800/50', text: 'text-yellow-700 dark:text-yellow-400', icon: AlertTriangle },
  positive: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800/50', text: 'text-green-700 dark:text-green-400', icon: CheckCircle2 },
  info: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800/50', text: 'text-blue-700 dark:text-blue-400', icon: Info },
};

const SEVERITY_ORDER = { critical: 1, high: 2, warning: 3, positive: 4, info: 5 };

export default function InsightsTab({ id }) {
  const sortedInsights = useMemo(() => {
    return [...MOCK_INSIGHTS].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="text-yellow-500" />
            AI Insights Center
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Automatically detected anomalies, trends, and business events in this dataset.
          </p>
        </div>
        <div className="text-sm font-medium px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-800/50">
          7 active insights
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedInsights.map(insight => {
          const ThemeIcon = insight.icon;
          const config = SEVERITY_CONFIG[insight.severity];
          const SevIcon = config.icon;

          return (
            <div key={insight.id} className={`flex flex-col rounded-2xl border ${config.border} bg-white dark:bg-gray-900 overflow-hidden shadow-sm transition-shadow hover:shadow-md`}>
              
              {/* Header */}
              <div className={`px-5 py-4 border-b ${config.border} ${config.bg} flex items-start justify-between gap-4`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white/60 dark:bg-black/20 ${config.text}`}>
                    <ThemeIcon size={20} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${config.text} flex items-center gap-2`}>
                      {insight.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5 opacity-80">
                      <SevIcon size={14} className={config.text} />
                      <span className={`text-xs font-semibold uppercase tracking-wider ${config.text}`}>
                        {insight.severity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {insight.description}
                </p>

                {/* Visual Evidence */}
                {insight.data ? (
                  <div className="h-24 w-full mt-auto mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                    <ResponsiveContainer width="100%" height="100%">
                      {insight.chartType === 'line' ? (
                        <LineChart data={insight.data}>
                          <YAxis domain={['auto', 'auto']} hide />
                          <Line type="monotone" dataKey="val" stroke={insight.color} strokeWidth={2.5} dot={false} isAnimationActive={false} />
                        </LineChart>
                      ) : (
                        <BarChart data={insight.data}>
                          <Bar dataKey="val" fill={insight.color} radius={[2, 2, 0, 0]} isAnimationActive={false} />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                ) : insight.stat ? (
                  <div className="mt-auto mb-6 flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="text-4xl font-black text-gray-900 dark:text-white">{insight.stat}</span>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">{insight.statLabel}</span>
                  </div>
                ) : null}

                {/* Recommendation */}
                <div className="mt-auto bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
                  <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Lightbulb size={14} /> AI Recommendation
                  </div>
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    {insight.recommendation}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
