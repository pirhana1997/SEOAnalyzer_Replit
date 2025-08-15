import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Target, Award } from "lucide-react";
import type { SeoAnalysis } from "@shared/schema";

interface SeoOverviewProps {
  analysis: SeoAnalysis;
}

export function SeoOverview({ analysis }: SeoOverviewProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-error";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-error";
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', label: 'Excellent', icon: Award };
    if (score >= 80) return { grade: 'A', label: 'Very Good', icon: Award };
    if (score >= 70) return { grade: 'B', label: 'Good', icon: TrendingUp };
    if (score >= 60) return { grade: 'C', label: 'Fair', icon: Target };
    if (score >= 50) return { grade: 'D', label: 'Poor', icon: Target };
    return { grade: 'F', label: 'Failing', icon: Target };
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "from-green-400 to-green-600";
    if (score >= 60) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  const getMetricIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="text-success" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-warning" size={16} />;
      case 'error':
        return <XCircle className="text-error" size={16} />;
      default:
        return null;
    }
  };

  const getMetricBorderColor = (status: string) => {
    switch (status) {
      case 'good':
        return "border-success";
      case 'warning':
        return "border-warning";
      case 'error':
        return "border-error";
      default:
        return "border-gray-200";
    }
  };

  const getMetricBackground = (status: string) => {
    switch (status) {
      case 'good':
        return "bg-green-50";
      case 'warning':
        return "bg-yellow-50";
      case 'error':
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  };

  const scoreData = getScoreGrade(analysis.score);
  const IconComponent = scoreData.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
      <div className="p-4 md:p-6 border-b dark:border-gray-700">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO Overview</h3>
        
        {/* Score Display */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Circular Progress */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200 dark:text-gray-600"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.score / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" className={`stop-color-current ${getScoreColor(analysis.score)}`} />
                    <stop offset="100%" className={`stop-color-current ${getScoreColor(analysis.score)}`} />
                  </linearGradient>
                </defs>
              </svg>
              {/* Score text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg md:text-2xl font-bold ${getScoreColor(analysis.score)}`} data-testid="text-seo-score">
                  {analysis.score}
                </span>
              </div>
            </div>
            
            {/* Score Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <IconComponent className={`${getScoreColor(analysis.score)}`} size={18} />
                <span className={`text-lg md:text-xl font-bold ${getScoreColor(analysis.score)} truncate`}>
                  {scoreData.grade}
                </span>
              </div>
              <p className={`text-sm font-medium ${getScoreColor(analysis.score)}`}>
                {scoreData.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SEO Score: {analysis.score}/100
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="hidden lg:block w-32">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 text-right">Progress</div>
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getProgressColor(analysis.score)} transition-all duration-1000 ease-out`}
                style={{ width: `${analysis.score}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">{analysis.score}%</div>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 md:mb-4">SEO Metrics Breakdown</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {analysis.metrics.map((metric, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 ${getMetricBackground(metric.status)} dark:bg-gray-700 rounded-lg border-l-4 ${getMetricBorderColor(metric.status)}`}
              data-testid={`metric-${metric.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{metric.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 break-words">
                  {metric.value || metric.message}
                </p>
              </div>
              <div className="flex-shrink-0">
                {getMetricIcon(metric.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
