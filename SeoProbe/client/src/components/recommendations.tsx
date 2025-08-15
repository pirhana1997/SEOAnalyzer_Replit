import { AlertTriangle, Info, Lightbulb, Copy, CheckCircle, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { SeoAnalysis } from "@shared/schema";

interface RecommendationsProps {
  recommendations: SeoAnalysis['recommendations'];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="text-error mt-1" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-warning mt-1" size={16} />;
      case 'info':
        return <Lightbulb className="text-success mt-1" size={16} />;
      default:
        return <Info className="text-primary mt-1" size={16} />;
    }
  };

  const getPriorityInfo = (type: string) => {
    switch (type) {
      case 'error':
        return { priority: 'High Priority', icon: Zap, color: 'text-error' };
      case 'warning':
        return { priority: 'Medium Priority', icon: Clock, color: 'text-warning' };
      case 'info':
        return { priority: 'Low Priority', icon: Info, color: 'text-success' };
      default:
        return { priority: 'Info', icon: Info, color: 'text-primary' };
    }
  };

  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "Code Copied",
        description: "HTML code copied to clipboard successfully.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-error';
      case 'warning':
        return 'border-warning';
      case 'info':
        return 'border-success';
      default:
        return 'border-primary';
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'info':
        return 'bg-green-50';
      default:
        return 'bg-blue-50';
    }
  };

  // Group recommendations by priority
  const errorRecs = recommendations.filter(rec => rec.type === 'error');
  const warningRecs = recommendations.filter(rec => rec.type === 'warning');
  const infoRecs = recommendations.filter(rec => rec.type === 'info');

  const groupedRecs = [
    { type: 'error', title: 'Critical Issues', recs: errorRecs, count: errorRecs.length },
    { type: 'warning', title: 'Important Improvements', recs: warningRecs, count: warningRecs.length },
    { type: 'info', title: 'Best Practice Suggestions', recs: infoRecs, count: infoRecs.length },
  ].filter(group => group.count > 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
      <div className="p-4 md:p-6 border-b dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">SEO Recommendations</h3>
          <div className="flex flex-wrap items-center gap-1 md:gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
              {errorRecs.length} Critical
            </span>
            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">
              {warningRecs.length} Important
            </span>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
              {infoRecs.length} Suggestions
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6">
        {recommendations.length === 0 ? (
          <div className="text-center py-6 md:py-8">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <CheckCircle className="text-success" size={28} />
            </div>
            <h4 className="text-base md:text-lg font-medium text-gray-900 dark:text-white mb-2">
              Perfect SEO Implementation!
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base max-w-md mx-auto">
              Your page has all the essential SEO elements properly configured. Consider adding structured data for even better results.
            </p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {groupedRecs.map((group, groupIndex) => {
              const priorityInfo = getPriorityInfo(group.type);
              const PriorityIcon = priorityInfo.icon;
              
              return (
                <div key={groupIndex}>
                  <div className="flex items-center space-x-2 mb-3 md:mb-4">
                    <PriorityIcon className={priorityInfo.color} size={16} />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{group.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${priorityInfo.color} bg-opacity-10 dark:bg-opacity-20`}>
                      {group.count} item{group.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="space-y-3 md:space-y-4">
                    {group.recs.map((rec, index) => (
                      <div
                        key={index}
                        className={`p-4 ${getBackgroundColor(rec.type)} rounded-lg border border-l-4 ${getBorderColor(rec.type)}`}
                        data-testid={`recommendation-${groupIndex}-${index}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {getIcon(rec.type)}
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{rec.title}</h5>
                              <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                              
                              {rec.code && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-gray-700">Implementation Code:</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(rec.code!, groupIndex * 1000 + index)}
                                      className="h-6 px-2 text-xs"
                                      data-testid={`button-copy-${groupIndex}-${index}`}
                                    >
                                      {copiedIndex === groupIndex * 1000 + index ? (
                                        <CheckCircle size={12} className="text-success" />
                                      ) : (
                                        <Copy size={12} />
                                      )}
                                    </Button>
                                  </div>
                                  <code 
                                    className="text-xs bg-gray-900 text-gray-100 px-3 py-2 rounded block whitespace-pre-wrap overflow-x-auto"
                                    data-testid={`code-${groupIndex}-${index}`}
                                  >
                                    {rec.code}
                                  </code>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
