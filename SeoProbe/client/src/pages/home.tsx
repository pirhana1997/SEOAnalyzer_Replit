import { useState } from "react";
import { UrlInput } from "@/components/url-input";
import { SeoOverview } from "@/components/seo-overview";
import { CvssOverview } from "@/components/cvss-overview";
import { MetaTagsDetail } from "@/components/meta-tags-detail";
import { Recommendations } from "@/components/recommendations";
import { GooglePreview } from "@/components/google-preview";
import { SocialPreviews } from "@/components/social-previews";
import { QuickActions } from "@/components/quick-actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search, Download, HelpCircle } from "lucide-react";
import type { SeoAnalysis, AnalyzedUrl } from "@shared/schema";

export default function Home() {
  const [analysisData, setAnalysisData] = useState<{
    analysis: SeoAnalysis;
    analyzedUrl: AnalyzedUrl;
  } | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Search className="text-white" size={16} />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">SEO Analyzer</h1>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Meta Tag & SEO Checker</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-3">
              <button 
                className="hidden lg:flex text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors items-center space-x-2 px-3 py-2 rounded-md text-sm"
                data-testid="button-export-report"
              >
                <Download size={16} />
                <span>Export Report</span>
              </button>
              <button 
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors p-2 rounded-md"
                data-testid="button-help"
              >
                <HelpCircle size={18} />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        
        {/* URL Input */}
        <UrlInput onAnalysisComplete={setAnalysisData} />

        {/* Analysis Results */}
        {analysisData && (
          <div className="space-y-6 md:space-y-8">
            {/* Top Row: Score Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              <SeoOverview analysis={analysisData.analysis} />
              <CvssOverview analysis={analysisData.analysis} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              
              {/* Left Column: SEO Analysis */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                <MetaTagsDetail analyzedUrl={analysisData.analyzedUrl} />
                <Recommendations recommendations={analysisData.analysis.recommendations} />
              </div>

              {/* Right Column: Previews */}
              <div className="space-y-4 md:space-y-6">
                <GooglePreview analyzedUrl={analysisData.analyzedUrl} />
                <SocialPreviews analyzedUrl={analysisData.analyzedUrl} />
                <QuickActions analyzedUrl={analysisData.analyzedUrl} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 SEO Analyzer. Built for developers and marketers.</p>
            <div className="mt-2 space-x-4">
              <a href="#" className="hover:text-primary transition-colors">API Docs</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
