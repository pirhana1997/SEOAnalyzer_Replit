import { Image } from "lucide-react";
import type { AnalyzedUrl } from "@shared/schema";

interface SocialPreviewsProps {
  analyzedUrl: AnalyzedUrl;
}

export function SocialPreviews({ analyzedUrl }: SocialPreviewsProps) {
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '').toUpperCase();
    } catch {
      return url.toUpperCase();
    }
  };

  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return null;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
      <div className="p-4 md:p-6 border-b dark:border-gray-700">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Social Media Previews</h3>
      </div>
      
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Facebook Preview */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center mb-3">
            <div className="w-4 h-4 mr-2 rounded bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">f</span>
            </div>
            Facebook
          </h4>
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden" data-testid="facebook-preview">
            <div className="h-28 md:h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
              {analyzedUrl.ogImage ? (
                <img
                  src={analyzedUrl.ogImage}
                  alt="Open Graph"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="text-center text-gray-500 dark:text-gray-400">
                        <div class="text-2xl mb-2">📷</div>
                        <p class="text-xs">Image not accessible</p>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Image className="mx-auto mb-2" size={20} />
                  <p className="text-xs">No og:image found</p>
                </div>
              )}
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase truncate" data-testid="text-facebook-domain">
                {getDomain(analyzedUrl.url)}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mt-1 break-words" data-testid="text-facebook-title">
                {truncateText(analyzedUrl.ogTitle || analyzedUrl.title, 60) || 'Untitled Page'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 break-words" data-testid="text-facebook-description">
                {truncateText(analyzedUrl.ogDescription || analyzedUrl.description, 80) || 'No description available.'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Twitter Preview */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center mb-3">
            <div className="w-4 h-4 mr-2 rounded bg-blue-400 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">𝕏</span>
            </div>
            Twitter/X
          </h4>
          <div className="border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden" data-testid="twitter-preview">
            <div className="h-28 md:h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
              {analyzedUrl.twitterImage || analyzedUrl.ogImage ? (
                <img
                  src={analyzedUrl.twitterImage || analyzedUrl.ogImage!}
                  alt="Twitter Card"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="text-center text-gray-500 dark:text-gray-400">
                        <div class="text-2xl mb-2">📷</div>
                        <p class="text-xs">Image not accessible</p>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Image className="mx-auto mb-2" size={20} />
                  <p className="text-xs">No Twitter image found</p>
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="text-sm font-medium text-gray-900 dark:text-white break-words" data-testid="text-twitter-title">
                {truncateText(analyzedUrl.twitterTitle || analyzedUrl.ogTitle || analyzedUrl.title, 50) || 'Untitled Page'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 break-words" data-testid="text-twitter-description">
                {truncateText(analyzedUrl.twitterDescription || analyzedUrl.ogDescription || analyzedUrl.description, 100) || 'No description available.'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate" data-testid="text-twitter-domain">
                {new URL(analyzedUrl.url).hostname.replace('www.', '')}
              </div>
            </div>
          </div>
        </div>
        
        {/* LinkedIn Preview */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center mb-3">
            <div className="w-4 h-4 mr-2 rounded bg-blue-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">in</span>
            </div>
            LinkedIn
          </h4>
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden" data-testid="linkedin-preview">
            <div className="h-28 md:h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
              {analyzedUrl.ogImage ? (
                <img
                  src={analyzedUrl.ogImage}
                  alt="LinkedIn"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="text-center text-gray-500 dark:text-gray-400">
                        <div class="text-2xl mb-2">📄</div>
                        <p class="text-xs">Using meta description</p>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="text-2xl mb-2">📄</div>
                  <p className="text-xs">Using meta description</p>
                </div>
              )}
            </div>
            <div className="p-3 bg-white dark:bg-gray-700">
              <div className="text-sm font-medium text-gray-900 dark:text-white break-words" data-testid="text-linkedin-title">
                {truncateText(analyzedUrl.title, 60) || 'Untitled Page'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate" data-testid="text-linkedin-domain">
                {new URL(analyzedUrl.url).hostname.replace('www.', '')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
