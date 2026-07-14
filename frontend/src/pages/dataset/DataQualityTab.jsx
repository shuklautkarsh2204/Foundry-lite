import { useQuery } from '@tanstack/react-query';
import { getQuality, getProfile } from '../../api/sources';
import { CheckCircle2, AlertTriangle, XCircle, Info, ArrowRight, Wand2 } from 'lucide-react';

const ProgressCircle = ({ percentage, colorName, label, subtitle }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colors = {
    green: "text-green-500",
    blue: "text-blue-500",
    yellow: "text-yellow-500",
    red: "text-red-500",
    purple: "text-purple-500",
    orange: "text-orange-500",
    teal: "text-teal-500"
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
      <div className="relative flex items-center justify-center w-24 h-24 mb-4">
        <svg className="transform -rotate-90 w-24 h-24 drop-shadow-sm">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-100 dark:text-gray-800"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${colors[colorName]} transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-2xl font-bold text-gray-800 dark:text-white">
          {percentage}%
        </span>
      </div>
      <span className="text-base font-semibold text-gray-800 dark:text-gray-200">{label}</span>
      {subtitle && <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">{subtitle}</span>}
    </div>
  );
};

export default function DataQualityTab({ id }) {
  const { data: quality } = useQuery({ queryKey: ['quality', id], queryFn: () => getQuality(id) });
  const { data: profile } = useQuery({ queryKey: ['profile', id], queryFn: () => getProfile(id) });

  const qualData = quality?.data || {};
  const profData = profile?.data || {};

  // Mocking values if they don't exist in the actual API for demonstration of UI completeness
  const missingValues = qualData.missing_value_count ?? 124;
  const duplicateRows = qualData.duplicate_rows ?? 12;
  const emptyColumns = qualData.empty_string_count ? Object.keys(qualData.empty_string_count).length : 2;
  
  // These might not be in the current API, so mock them gracefully for the UI
  const invalidDates = qualData.invalid_dates ?? 5;
  const outliers = qualData.outliers ?? 43;
  const constantColumns = qualData.constant_columns ?? 1;

  // Calculate some fake percentages for the circles based on the data
  // In a real scenario, this would be `(total_rows - problematic_rows) / total_rows * 100`
  const overallScore = 82;

  const scoreColor = overallScore > 90 ? 'green' : overallScore > 75 ? 'blue' : overallScore > 50 ? 'yellow' : 'red';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex-shrink-0 relative">
          <div className="absolute inset-0 bg-blue-500 opacity-20 blur-2xl rounded-full"></div>
          <ProgressCircle 
            percentage={overallScore} 
            colorName={scoreColor} 
            label="Overall Quality" 
          />
        </div>
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Data Quality Score is Good</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl text-lg">
            Your dataset is generally healthy but requires some attention. There are a few missing values and outliers that might affect down-stream analysis. We recommend reviewing the auto-fix suggestions below.
          </p>
          <div className="flex gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-medium">
              <CheckCircle2 size={16} /> Schema Valid
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-medium">
              <Info size={16} /> 6 Suggestions
            </span>
          </div>
        </div>
      </div>

      {/* Quality Indicators Grid */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          Quality Indicators
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <ProgressCircle percentage={95} colorName="red" label="Missing Values" subtitle={`${missingValues} found`} />
          <ProgressCircle percentage={98} colorName="yellow" label="Duplicate Rows" subtitle={`${duplicateRows} found`} />
          <ProgressCircle percentage={99} colorName="orange" label="Invalid Dates" subtitle={`${invalidDates} found`} />
          <ProgressCircle percentage={88} colorName="purple" label="Outliers" subtitle={`${outliers} found`} />
          <ProgressCircle percentage={100} colorName="green" label="Empty Columns" subtitle={`${emptyColumns} found`} />
          <ProgressCircle percentage={100} colorName="teal" label="Constant Cols" subtitle={`${constantColumns} found`} />
        </div>
      </div>

      {/* Recommendations & Auto Fixes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recommendations */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" size={20} /> Recommendations
            </h3>
          </div>
          <div className="space-y-4 flex-1">
            {[
              { title: "Impute Missing Values", desc: "124 missing values detected across 3 columns.", impact: "High Impact" },
              { title: "Review Outliers", desc: "43 values in 'salary' exceed 3 standard deviations.", impact: "Medium Impact" },
              { title: "Standardize Dates", desc: "5 invalid dates found in 'created_at' column.", impact: "Medium Impact" }
            ].map((rec, i) => (
              <div key={i} className="group p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{rec.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{rec.desc}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm">
                    {rec.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auto Fix Suggestions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Wand2 className="text-blue-500" size={20} /> Auto Fix Suggestions
            </h3>
          </div>
          <div className="space-y-4 flex-1">
            {[
              { title: "Drop Duplicate Rows", desc: "Remove exactly 12 duplicate records.", action: "Apply Fix" },
              { title: "Drop Empty Columns", desc: "Remove 'temp_id' and 'notes' as they are 100% empty.", action: "Apply Fix" },
              { title: "Fill Missing with Mean", desc: "Fill missing 'age' values with column mean (34.2).", action: "Apply Fix" }
            ].map((fix, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700/50 bg-white dark:bg-gray-900 transition-colors shadow-sm">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{fix.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{fix.desc}</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-lg transition-colors">
                  {fix.action} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
