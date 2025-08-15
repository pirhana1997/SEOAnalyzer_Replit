import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { seoAnalysisSchema, insertAnalyzedUrlSchema } from "@shared/schema";
import { z } from "zod";
import * as cheerio from "cheerio";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Analyze URL endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = z.object({ url: z.string().url() }).parse(req.body);
      
      // Fetch HTML content
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Analyzer/1.0)',
        },
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Extract meta tags
      const title = $('title').text() || null;
      const description = $('meta[name="description"]').attr('content') || null;
      const keywords = $('meta[name="keywords"]').attr('content') || null;
      const h1 = $('h1').first().text() || null;
      const ogTitle = $('meta[property="og:title"]').attr('content') || null;
      const ogDescription = $('meta[property="og:description"]').attr('content') || null;
      const ogImage = $('meta[property="og:image"]').attr('content') || null;
      const ogUrl = $('meta[property="og:url"]').attr('content') || null;
      const twitterCard = $('meta[name="twitter:card"]').attr('content') || null;
      const twitterTitle = $('meta[name="twitter:title"]').attr('content') || null;
      const twitterDescription = $('meta[name="twitter:description"]').attr('content') || null;
      const twitterImage = $('meta[name="twitter:image"]').attr('content') || null;
      const canonicalUrl = $('link[rel="canonical"]').attr('href') || null;
      const lang = $('html').attr('lang') || null;
      const viewport = $('meta[name="viewport"]').attr('content') || null;
      const robots = $('meta[name="robots"]').attr('content') || null;

      // Store analyzed data
      const analyzedUrl = await storage.createAnalyzedUrl({
        url,
        title,
        description,
        keywords,
        h1,
        ogTitle,
        ogDescription,
        ogImage,
        ogUrl,
        twitterCard,
        twitterTitle,
        twitterDescription,
        twitterImage,
        canonicalUrl,
        lang,
        viewport,
        robots,
      });

      // Generate SEO analysis
      const metrics = [];
      const recommendations = [];
      const vulnerabilities = [];
      let score = 0; // Score out of 100 points total
      let cvssScore = 0; // CVSS security score

      // Title analysis (15 points)
      if (title) {
        const titleLength = title.length;
        if (titleLength >= 30 && titleLength <= 60) {
          metrics.push({
            name: 'Title Tag',
            status: 'good' as const,
            value: `${titleLength} characters`,
            message: 'Title length is optimal',
            recommendation: null,
          });
          score += 15;
        } else if (titleLength > 0) {
          metrics.push({
            name: 'Title Tag',
            status: 'warning' as const,
            value: `${titleLength} characters`,
            message: titleLength < 30 ? 'Title is too short' : 'Title is too long',
            recommendation: 'Keep title between 30-60 characters for optimal display in search results',
          });
          score += 8;
          recommendations.push({
            type: 'warning' as const,
            title: 'Optimize Title Length',
            description: `Your title is ${titleLength} characters. Aim for 30-60 characters for better search result display.`,
          });
        }
      } else {
        metrics.push({
          name: 'Title Tag',
          status: 'error' as const,
          value: null,
          message: 'Missing title tag',
          recommendation: 'Add a descriptive title tag to your page',
        });
        recommendations.push({
          type: 'error' as const,
          title: 'Missing Title Tag',
          description: 'Add a unique, descriptive title tag to help search engines understand your page content.',
          code: '<title>Your Page Title Here</title>',
        });
      }

      // Description analysis (15 points)
      if (description) {
        const descLength = description.length;
        if (descLength >= 120 && descLength <= 160) {
          metrics.push({
            name: 'Meta Description',
            status: 'good' as const,
            value: `${descLength} characters`,
            message: 'Description length is optimal',
            recommendation: null,
          });
          score += 15;
        } else if (descLength > 0) {
          metrics.push({
            name: 'Meta Description',
            status: 'warning' as const,
            value: `${descLength} characters`,
            message: descLength < 120 ? 'Description is too short' : 'Description is too long',
            recommendation: 'Keep description between 120-160 characters',
          });
          score += 8;
          recommendations.push({
            type: 'warning' as const,
            title: 'Optimize Description Length',
            description: `Your description is ${descLength} characters. Aim for 120-160 characters for optimal display.`,
          });
        }
      } else {
        metrics.push({
          name: 'Meta Description',
          status: 'error' as const,
          value: null,
          message: 'Missing meta description',
          recommendation: 'Add a compelling meta description',
        });
        recommendations.push({
          type: 'error' as const,
          title: 'Missing Meta Description',
          description: 'Add a meta description to provide a summary of your page content for search engines.',
          code: '<meta name="description" content="Your page description here">',
        });
      }

      // H1 analysis (10 points)
      if (h1) {
        metrics.push({
          name: 'H1 Tag',
          status: 'good' as const,
          value: h1.substring(0, 50) + (h1.length > 50 ? '...' : ''),
          message: 'H1 tag found',
          recommendation: null,
        });
        score += 10;
      } else {
        metrics.push({
          name: 'H1 Tag',
          status: 'warning' as const,
          value: null,
          message: 'Missing H1 tag',
          recommendation: 'Add an H1 tag as the main heading',
        });
        recommendations.push({
          type: 'warning' as const,
          title: 'Missing H1 Tag',
          description: 'Add an H1 tag to define the main heading of your page content.',
          code: '<h1>Your Main Heading</h1>',
        });
      }

      // Open Graph analysis (20 points)
      const ogScore = [ogTitle, ogDescription, ogImage, ogUrl].filter(Boolean).length;
      if (ogScore === 4) {
        metrics.push({
          name: 'Open Graph Tags',
          status: 'good' as const,
          value: '4/4 tags',
          message: 'All essential OG tags present',
          recommendation: null,
        });
        score += 20;
      } else if (ogScore > 0) {
        metrics.push({
          name: 'Open Graph Tags',
          status: 'warning' as const,
          value: `${ogScore}/4 tags`,
          message: 'Some OG tags missing',
          recommendation: 'Add missing Open Graph tags for better social sharing',
        });
        score += ogScore * 5; // 5 points per tag
        if (!ogImage) {
          recommendations.push({
            type: 'warning' as const,
            title: 'Add Open Graph Image',
            description: 'Include an og:image meta tag to improve social media sharing appearance.',
            code: '<meta property="og:image" content="https://example.com/image.jpg">',
          });
        }
      } else {
        metrics.push({
          name: 'Open Graph Tags',
          status: 'error' as const,
          value: '0/4 tags',
          message: 'No Open Graph tags found',
          recommendation: 'Add Open Graph tags for social media optimization',
        });
        recommendations.push({
          type: 'error' as const,
          title: 'Add Open Graph Tags',
          description: 'Add Open Graph meta tags to control how your page appears when shared on social media.',
          code: '<meta property="og:title" content="Page Title">\n<meta property="og:description" content="Page description">\n<meta property="og:image" content="https://example.com/image.jpg">\n<meta property="og:url" content="https://example.com/page">',
        });
      }

      // Twitter Card analysis (10 points)
      if (twitterCard) {
        metrics.push({
          name: 'Twitter Cards',
          status: 'good' as const,
          value: twitterCard,
          message: 'Twitter Card found',
          recommendation: null,
        });
        score += 10;
      } else {
        metrics.push({
          name: 'Twitter Cards',
          status: 'warning' as const,
          value: null,
          message: 'No Twitter Card found',
          recommendation: 'Add Twitter Card meta tags',
        });
        recommendations.push({
          type: 'info' as const,
          title: 'Add Twitter Card Tags',
          description: 'Enhance Twitter sharing with Twitter Card meta tags.',
          code: '<meta name="twitter:card" content="summary_large_image">',
        });
      }

      // Viewport analysis (15 points)
      if (viewport) {
        metrics.push({
          name: 'Viewport Meta',
          status: 'good' as const,
          value: 'Present',
          message: 'Viewport meta tag found',
          recommendation: null,
        });
        score += 15;
      } else {
        metrics.push({
          name: 'Viewport Meta',
          status: 'error' as const,
          value: null,
          message: 'Missing viewport meta tag',
          recommendation: 'Add viewport meta tag for mobile optimization',
        });
        recommendations.push({
          type: 'error' as const,
          title: 'Missing Viewport Meta Tag',
          description: 'Add viewport meta tag for proper mobile display.',
          code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        });
      }

      // Canonical URL analysis (15 points)
      if (canonicalUrl) {
        metrics.push({
          name: 'Canonical URL',
          status: 'good' as const,
          value: 'Present',
          message: 'Canonical URL found',
          recommendation: null,
        });
        score += 15;
      } else {
        recommendations.push({
          type: 'info' as const,
          title: 'Consider Adding Canonical URL',
          description: 'Add a canonical URL to help search engines understand the preferred version of your page.',
          code: '<link rel="canonical" href="https://example.com/page">',
        });
      }

      // Additional SEO recommendations based on missing elements
      
      // Language recommendations
      if (!lang) {
        recommendations.push({
          type: 'warning' as const,
          title: 'Add Language Declaration',
          description: 'Specify the page language to help search engines and screen readers.',
          code: '<html lang="en">',
        });
      }

      // Robots meta recommendations
      if (!robots) {
        recommendations.push({
          type: 'info' as const,
          title: 'Consider Robots Meta Tag',
          description: 'Add robots meta tag to control how search engines crawl and index your page.',
          code: '<meta name="robots" content="index, follow">',
        });
      }

      // Keywords meta (discourage if present)
      if (keywords) {
        recommendations.push({
          type: 'warning' as const,
          title: 'Remove Keywords Meta Tag',
          description: 'The keywords meta tag is ignored by search engines and may be seen as spam. Focus on quality content instead.',
        });
      }

      // Title and description alignment
      if (title && description && ogTitle && title !== ogTitle) {
        recommendations.push({
          type: 'info' as const,
          title: 'Align Title Tags',
          description: 'Consider making your page title and Open Graph title consistent for better branding.',
        });
      }

      // Image optimization
      if (ogImage) {
        recommendations.push({
          type: 'info' as const,
          title: 'Optimize Social Images',
          description: 'Ensure your Open Graph image is 1200x630 pixels for optimal social media display.',
        });
      }

      // Performance suggestions
      recommendations.push({
        type: 'info' as const,
        title: 'Monitor Page Speed',
        description: 'Page loading speed is a ranking factor. Use tools like Google PageSpeed Insights to optimize performance.',
      });

      // Content quality suggestions
      if (title && title.length < 30) {
        recommendations.push({
          type: 'info' as const,
          title: 'Enhance Title Descriptiveness',
          description: 'Consider making your title more descriptive to better match user search intent.',
        });
      }

      // Advanced SEO recommendations for high-scoring pages
      if (score >= 80) {
        recommendations.push({
          type: 'info' as const,
          title: 'Add Structured Data',
          description: 'Implement JSON-LD structured data markup to help search engines understand your content better.',
          code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${title || 'Page Title'}",
  "description": "${description || 'Page description'}"
}
</script>`,
        });

        recommendations.push({
          type: 'info' as const,
          title: 'Consider SSL Certificate',
          description: 'Ensure your site uses HTTPS for better security and SEO rankings.',
        });

        recommendations.push({
          type: 'info' as const,
          title: 'Create XML Sitemap',
          description: 'Generate and submit an XML sitemap to help search engines discover all your pages.',
        });
      }

      // CVSS Security Analysis
      const urlObj = new URL(url);
      
      // Check for HTTPS (Security vulnerability if missing)
      if (urlObj.protocol !== 'https:') {
        vulnerabilities.push({
          id: 'CVE-HTTP-001',
          severity: 'medium' as const,
          score: 5.3,
          vector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N',
          description: 'Website not using HTTPS encryption',
          impact: 'Data transmitted between user and server is not encrypted, potentially exposing sensitive information',
          recommendation: 'Implement SSL/TLS certificate and redirect all HTTP traffic to HTTPS',
        });
        cvssScore = Math.max(cvssScore, 5.3);
      }

      // Check for missing security headers (based on common vulnerabilities)
      if (!viewport) {
        vulnerabilities.push({
          id: 'CVE-VIEWPORT-001',
          severity: 'low' as const,
          score: 2.1,
          vector: 'AV:N/AC:H/PR:N/UI:R/S:U/C:N/I:L/A:N',
          description: 'Missing viewport meta tag affects mobile security',
          impact: 'Potential for clickjacking attacks on mobile devices due to improper scaling',
          recommendation: 'Add viewport meta tag with proper scaling controls',
        });
        cvssScore = Math.max(cvssScore, 2.1);
      }

      // Content Security Policy check (inferred from meta tags)
      const hasCSP = html.includes('Content-Security-Policy') || html.includes('csp-nonce');
      if (!hasCSP) {
        vulnerabilities.push({
          id: 'CVE-CSP-001',
          severity: 'high' as const,
          score: 7.5,
          vector: 'AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N',
          description: 'Missing Content Security Policy',
          impact: 'Vulnerable to XSS attacks, data injection, and malicious script execution',
          recommendation: 'Implement Content-Security-Policy header to prevent XSS attacks',
        });
        cvssScore = Math.max(cvssScore, 7.5);
      }

      // X-Frame-Options check
      const hasFrameProtection = html.includes('X-Frame-Options') || html.includes('frame-ancestors');
      if (!hasFrameProtection) {
        vulnerabilities.push({
          id: 'CVE-FRAME-001',
          severity: 'medium' as const,
          score: 4.3,
          vector: 'AV:N/AC:L/PR:N/UI:R/S:C/C:N/I:L/A:N',
          description: 'Missing clickjacking protection',
          impact: 'Page can be embedded in malicious frames, potentially leading to clickjacking attacks',
          recommendation: 'Add X-Frame-Options header or frame-ancestors CSP directive',
        });
        cvssScore = Math.max(cvssScore, 4.3);
      }

      // Mixed content vulnerability (if HTTPS site loads HTTP resources)
      if (urlObj.protocol === 'https:') {
        const hasMixedContent = html.match(/src\s*=\s*["']http:\/\//i) || html.match(/href\s*=\s*["']http:\/\//i);
        if (hasMixedContent) {
          vulnerabilities.push({
            id: 'CVE-MIXED-001',
            severity: 'medium' as const,
            score: 5.0,
            vector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N',
            description: 'Mixed content vulnerability detected',
            impact: 'Loading HTTP resources on HTTPS page creates security warnings and potential attack vectors',
            recommendation: 'Ensure all resources (images, scripts, stylesheets) are loaded over HTTPS',
          });
          cvssScore = Math.max(cvssScore, 5.0);
        }
      }

      // Inline JavaScript vulnerability
      const hasInlineJS = html.includes('javascript:') || /<script[^>]*>[^<]+<\/script>/i.test(html);
      if (hasInlineJS) {
        vulnerabilities.push({
          id: 'CVE-INLINE-001',
          severity: 'medium' as const,
          score: 4.7,
          vector: 'AV:N/AC:L/PR:L/UI:R/S:U/C:L/I:L/A:L',
          description: 'Inline JavaScript detected',
          impact: 'Inline scripts can be exploited for XSS attacks and make CSP implementation difficult',
          recommendation: 'Move JavaScript to external files and implement proper CSP with nonce or hash',
        });
        cvssScore = Math.max(cvssScore, 4.7);
      }

      // Default to low risk if no vulnerabilities found
      if (vulnerabilities.length === 0) {
        cvssScore = 0.1; // Very low baseline risk
      }

      const analysis = {
        url,
        metrics,
        score: Math.round(score), // Score is already calculated out of 100
        cvssScore: Math.round(cvssScore * 10) / 10, // Round to 1 decimal place
        vulnerabilities,
        recommendations,
      };

      res.json({ analysis, analyzedUrl });

    } catch (error) {
      console.error('Analysis error:', error);
      if (axios.isAxiosError(error)) {
        return res.status(400).json({ 
          message: `Failed to fetch URL: ${error.message}`,
          error: 'FETCH_ERROR'
        });
      }
      res.status(500).json({ 
        message: 'Failed to analyze URL',
        error: 'ANALYSIS_ERROR'
      });
    }
  });

  // Get analysis history
  app.get("/api/history", async (req, res) => {
    try {
      const history = await storage.getAllAnalyzedUrls();
      res.json(history.slice(-10)); // Return last 10 analyses
    } catch (error) {
      console.error('History error:', error);
      res.status(500).json({ message: 'Failed to get analysis history' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
