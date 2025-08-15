import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { AnalyzedUrl } from "@shared/schema";

interface MetaTagsDetailProps {
  analyzedUrl: AnalyzedUrl;
}

export function MetaTagsDetail({ analyzedUrl }: MetaTagsDetailProps) {
  const getStatusIcon = (hasValue: boolean, isOptional = false) => {
    if (hasValue) {
      return <CheckCircle className="text-success mr-2" size={16} />;
    }
    if (isOptional) {
      return <AlertTriangle className="text-warning mr-2" size={16} />;
    }
    return <XCircle className="text-error mr-2" size={16} />;
  };

  const getCharacterCount = (text: string | null, optimal: { min: number; max: number }) => {
    if (!text) return null;
    const length = text.length;
    let status = 'good';
    let message = 'Optimal length';

    if (length < optimal.min) {
      status = 'warning';
      message = 'Too short';
    } else if (length > optimal.max) {
      status = 'warning';
      message = 'Too long';
    }

    return (
      <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 dark:text-gray-400">
        <span className={`px-2 py-1 rounded text-xs inline-block ${
          status === 'good' 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
        }`}>
          {length} characters
        </span>
        <span className="mt-1 sm:mt-0 sm:ml-2">{message}</span>
      </div>
    );
  };

  const ogTags = [
    { name: 'og:title', value: analyzedUrl.ogTitle },
    { name: 'og:description', value: analyzedUrl.ogDescription },
    { name: 'og:image', value: analyzedUrl.ogImage },
    { name: 'og:url', value: analyzedUrl.ogUrl },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
      <div className="p-4 md:p-6 border-b dark:border-gray-700">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Meta Tags Analysis</h3>
      </div>
      
      <div className="divide-y dark:divide-gray-700">
        {/* Title Tag */}
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center" data-testid="title-tag-header">
                {getStatusIcon(!!analyzedUrl.title)}
                Title Tag
              </h4>
              {analyzedUrl.title ? (
                <>
                  <p className="text-gray-600 dark:text-gray-300 mt-1 break-words" data-testid="text-title-content">
                    {analyzedUrl.title}
                  </p>
                  {getCharacterCount(analyzedUrl.title, { min: 30, max: 60 })}
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 mt-1 italic">No title tag found</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Meta Description */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 flex items-center" data-testid="description-tag-header">
                {getStatusIcon(!!analyzedUrl.description)}
                Meta Description
              </h4>
              {analyzedUrl.description ? (
                <>
                  <p className="text-gray-600 mt-1" data-testid="text-description-content">
                    {analyzedUrl.description}
                  </p>
                  {getCharacterCount(analyzedUrl.description, { min: 120, max: 160 })}
                </>
              ) : (
                <p className="text-gray-500 mt-1 italic">No meta description found</p>
              )}
            </div>
          </div>
        </div>

        {/* H1 Tag */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 flex items-center" data-testid="h1-tag-header">
                {getStatusIcon(!!analyzedUrl.h1)}
                H1 Tag
              </h4>
              {analyzedUrl.h1 ? (
                <p className="text-gray-600 mt-1" data-testid="text-h1-content">
                  {analyzedUrl.h1}
                </p>
              ) : (
                <p className="text-gray-500 mt-1 italic">No H1 tag found</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Open Graph Tags */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 flex items-center" data-testid="og-tags-header">
                {getStatusIcon(ogTags.some(tag => tag.value), true)}
                Open Graph Tags
              </h4>
              <div className="mt-2 space-y-2">
                {ogTags.map((tag, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{tag.name}</span>
                    {tag.value ? (
                      <CheckCircle className="text-success" size={16} />
                    ) : (
                      <XCircle className="text-error" size={16} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Meta Tags */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 flex items-center" data-testid="additional-tags-header">
                Additional Meta Tags
              </h4>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Viewport</span>
                  {analyzedUrl.viewport ? (
                    <CheckCircle className="text-success" size={16} />
                  ) : (
                    <XCircle className="text-error" size={16} />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Canonical URL</span>
                  {analyzedUrl.canonicalUrl ? (
                    <CheckCircle className="text-success" size={16} />
                  ) : (
                    <AlertTriangle className="text-warning" size={16} />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Language</span>
                  {analyzedUrl.lang ? (
                    <CheckCircle className="text-success" size={16} />
                  ) : (
                    <AlertTriangle className="text-warning" size={16} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
