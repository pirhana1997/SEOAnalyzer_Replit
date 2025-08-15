import { Shield, AlertTriangle, XCircle, CheckCircle, Lock, Globe } from "lucide-react";
import type { SeoAnalysis } from "@shared/schema";

interface CvssOverviewProps {
  analysis: SeoAnalysis;
}

export function CvssOverview({ analysis }: CvssOverviewProps) {
  const getCvssColor = (score: number) => {
    if (score >= 7.0) return "text-red-600";
    if (score >= 4.0) return "text-orange-500";
    if (score >= 0.1) return "text-yellow-500";
    return "text-green-600";
  };

  const getCvssBgColor = (score: number) => {
    if (score >= 7.0) return "bg-red-600";
    if (score >= 4.0) return "bg-orange-500";
    if (score >= 0.1) return "bg-yellow-500";
    return "bg-green-600";
  };

  const getCvssSeverity = (score: number) => {
    if (score >= 9.0) return { label: "Critical", icon: XCircle };
    if (score >= 7.0) return { label: "High", icon: AlertTriangle };
    if (score >= 4.0) return { label: "Medium", icon: AlertTriangle };
    if (score >= 0.1) return { label: "Low", icon: Shield };
    return { label: "None", icon: CheckCircle };
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="text-red-600" size={16} />;
      case 'high':
        return <AlertTriangle className="text-red-500" size={16} />;
      case 'medium':
        return <AlertTriangle className="text-orange-500" size={16} />;
      case 'low':
        return <Shield className="text-yellow-500" size={16} />;
      default:
        return <CheckCircle className="text-green-500" size={16} />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical':
        return "bg-red-50 border-red-200";
      case 'high':
        return "bg-red-50 border-red-200";
      case 'medium':
        return "bg-orange-50 border-orange-200";
      case 'low':
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-green-50 border-green-200";
    }
  };

  const severityData = getCvssSeverity(analysis.cvssScore);
  const SeverityIcon = severityData.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
      <div className="p-4 md:p-6 border-b dark:border-gray-700">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Assessment (CVSS)</h3>
        
        {/* CVSS Score Display */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Security Score Circle */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200 dark:text-gray-600"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.cvssScore / 10)}`}
                  className={`transition-all duration-1000 ease-out ${getCvssColor(analysis.cvssScore)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-base md:text-lg font-bold ${getCvssColor(analysis.cvssScore)}`} data-testid="text-cvss-score">
                  {analysis.cvssScore}
                </span>
              </div>
            </div>
            
            {/* Security Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <SeverityIcon className={getCvssColor(analysis.cvssScore)} size={18} />
                <span className={`text-lg md:text-xl font-bold ${getCvssColor(analysis.cvssScore)} truncate`}>
                  {severityData.label}
                </span>
              </div>
              <p className={`text-sm font-medium ${getCvssColor(analysis.cvssScore)}`}>
                Security Risk Level
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                CVSS Score: {analysis.cvssScore}/10.0
              </p>
            </div>
          </div>
          
          {/* Security Icons */}
          <div className="hidden lg:flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
              <Lock size={16} className="text-gray-400 dark:text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe size={16} className="text-gray-400 dark:text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Web Safety</span>
            </div>
          </div>
        </div>

        {/* Risk Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300">Vulnerabilities Found:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{analysis.vulnerabilities.length}</span>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4">
            {['critical', 'high', 'medium', 'low'].map(severity => {
              const count = analysis.vulnerabilities.filter(v => v.severity === severity).length;
              if (count === 0) return null;
              return (
                <div key={severity} className="flex items-center space-x-1">
                  {getSeverityIcon(severity)}
                  <span className="text-xs text-gray-600 dark:text-gray-300 capitalize">{severity}: {count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Vulnerabilities List */}
      <div className="p-4 md:p-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 md:mb-4">Security Vulnerabilities</h4>
        {analysis.vulnerabilities.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle className="text-green-500 mx-auto mb-2" size={32} />
            <p className="text-sm text-gray-600 dark:text-gray-300">No security vulnerabilities detected</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {analysis.vulnerabilities.map((vuln, index) => (
              <div
                key={index}
                className={`p-3 md:p-4 rounded-lg border ${getSeverityBg(vuln.severity)}`}
                data-testid={`vulnerability-${index}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getSeverityIcon(vuln.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm">{vuln.description}</h5>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          <strong>Impact:</strong> {vuln.impact}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 break-all">
                          <strong>Vector:</strong> {vuln.vector}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          <strong>Fix:</strong> {vuln.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start sm:text-right">
                    <div className={`text-sm font-bold ${getCvssColor(vuln.score)}`}>
                      {vuln.score}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">CVSS</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}