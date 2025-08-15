import { Globe } from "lucide-react";
import type { AnalyzedUrl } from "@shared/schema";

interface GooglePreviewProps {
  analyzedUrl: AnalyzedUrl;
}

export function GooglePreview({ analyzedUrl }: GooglePreviewProps) {
  const getDisplayUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}${urlObj.pathname !== '/' ? ` › ${urlObj.pathname.split('/').filter(Boolean).join(' › ')}` : ''}`;
    } catch {
      return url;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
      <div className="p-4 md:p-6 border-b dark:border-gray-700">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <div className="w-4 h-4 md:w-5 md:h-5 mr-2 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span className="truncate">Google Preview</span>
        </h3>
      </div>
      
      <div className="p-4 md:p-6" data-testid="google-preview">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Globe className="text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" size={14} />
            <span className="text-green-700 dark:text-green-400 truncate" data-testid="text-display-url">
              {getDisplayUrl(analyzedUrl.url)}
            </span>
          </div>
          <h4 className="text-base md:text-lg text-blue-600 dark:text-blue-400 hover:underline cursor-pointer leading-snug" data-testid="text-google-title">
            {analyzedUrl.title || 'Untitled Page'}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-5 break-words" data-testid="text-google-description">
            {analyzedUrl.description || 'No meta description available for this page.'}
          </p>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>
              {new Date(analyzedUrl.analyzedAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
