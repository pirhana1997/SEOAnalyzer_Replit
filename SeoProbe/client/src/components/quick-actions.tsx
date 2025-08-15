import { Download, Code, Share, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { AnalyzedUrl } from "@shared/schema";

interface QuickActionsProps {
  analyzedUrl: AnalyzedUrl;
}

export function QuickActions({ analyzedUrl }: QuickActionsProps) {
  const { toast } = useToast();

  const handleExportPDF = () => {
    toast({
      title: "Export Feature",
      description: "PDF export functionality would be implemented here.",
    });
  };

  const handleViewSource = () => {
    window.open(`view-source:${analyzedUrl.url}`, '_blank');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'SEO Analysis Results',
        text: `SEO analysis for ${analyzedUrl.url}`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Analysis link copied to clipboard.",
        });
      } catch {
        toast({
          title: "Share Error",
          description: "Could not share or copy link.",
          variant: "destructive",
        });
      }
    }
  };

  const handleVisitSite = () => {
    window.open(analyzedUrl.url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      </div>
      
      <div className="p-6 space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-start p-4 h-auto bg-gray-50 hover:bg-gray-100"
          onClick={handleExportPDF}
          data-testid="button-export-pdf"
        >
          <Download className="text-primary mr-3" size={20} />
          <div className="text-left">
            <div className="font-medium text-gray-900">Export PDF Report</div>
            <div className="text-sm text-gray-600">Detailed analysis with recommendations</div>
          </div>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start p-4 h-auto bg-gray-50 hover:bg-gray-100"
          onClick={handleViewSource}
          data-testid="button-view-source"
        >
          <Code className="text-primary mr-3" size={20} />
          <div className="text-left">
            <div className="font-medium text-gray-900">View Page Source</div>
            <div className="text-sm text-gray-600">See raw HTML and meta tags</div>
          </div>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start p-4 h-auto bg-gray-50 hover:bg-gray-100"
          onClick={handleShare}
          data-testid="button-share-results"
        >
          <Share className="text-primary mr-3" size={20} />
          <div className="text-left">
            <div className="font-medium text-gray-900">Share Results</div>
            <div className="text-sm text-gray-600">Get shareable analysis link</div>
          </div>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start p-4 h-auto bg-gray-50 hover:bg-gray-100"
          onClick={handleVisitSite}
          data-testid="button-visit-site"
        >
          <ExternalLink className="text-primary mr-3" size={20} />
          <div className="text-left">
            <div className="font-medium text-gray-900">Visit Website</div>
            <div className="text-sm text-gray-600">Open analyzed site in new tab</div>
          </div>
        </Button>
      </div>
    </div>
  );
}
