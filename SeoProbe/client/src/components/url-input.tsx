import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Link, Loader2 } from "lucide-react";
import type { SeoAnalysis, AnalyzedUrl } from "@shared/schema";

interface UrlInputProps {
  onAnalysisComplete: (data: { analysis: SeoAnalysis; analyzedUrl: AnalyzedUrl }) => void;
}

export function UrlInput({ onAnalysisComplete }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json();
    },
    onSuccess: (data) => {
      onAnalysisComplete(data);
      toast({
        title: "Analysis Complete",
        description: "SEO analysis has been completed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze the URL. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    analyzeMutation.mutate(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 md:p-6 mb-6 md:mb-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          Analyze Your Website's SEO
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4 md:mb-6">
          Enter a URL to check meta tags, social previews, and SEO optimization
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-4 pr-10 py-2.5 md:py-3 h-10 md:h-12 text-sm md:text-base"
              data-testid="input-url"
              disabled={analyzeMutation.isPending}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Link className="text-gray-400 dark:text-gray-500" size={16} />
            </div>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={analyzeMutation.isPending}
            className="px-6 md:px-8 py-2.5 md:py-3 h-10 md:h-12 min-w-[100px] md:min-w-[120px] bg-primary hover:bg-primary/90 text-sm md:text-base"
            data-testid="button-analyze"
          >
            {analyzeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                <span className="hidden sm:inline">Analyzing...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <Search className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
