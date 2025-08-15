import { z } from "zod";

export const analyzedUrlSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  keywords: z.string().nullable(),
  h1: z.string().nullable(),
  ogTitle: z.string().nullable(),
  ogDescription: z.string().nullable(),
  ogImage: z.string().nullable(),
  ogUrl: z.string().nullable(),
  twitterCard: z.string().nullable(),
  twitterTitle: z.string().nullable(),
  twitterDescription: z.string().nullable(),
  twitterImage: z.string().nullable(),
  canonicalUrl: z.string().nullable(),
  lang: z.string().nullable(),
  viewport: z.string().nullable(),
  robots: z.string().nullable(),
  analyzedAt: z.date(),
});

export const seoMetricSchema = z.object({
  name: z.string(),
  status: z.enum(['good', 'warning', 'error']),
  value: z.string().nullable(),
  message: z.string(),
  recommendation: z.string().nullable(),
});

export const cvssVulnerabilitySchema = z.object({
  id: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low', 'none']),
  score: z.number().min(0).max(10),
  vector: z.string(),
  description: z.string(),
  impact: z.string(),
  recommendation: z.string(),
});

export const seoAnalysisSchema = z.object({
  url: z.string().url(),
  metrics: z.array(seoMetricSchema),
  score: z.number().min(0).max(100),
  cvssScore: z.number().min(0).max(10),
  vulnerabilities: z.array(cvssVulnerabilitySchema),
  recommendations: z.array(z.object({
    type: z.enum(['error', 'warning', 'info']),
    title: z.string(),
    description: z.string(),
    code: z.string().optional(),
  })),
});

export const insertAnalyzedUrlSchema = analyzedUrlSchema.omit({ id: true, analyzedAt: true });

export type AnalyzedUrl = z.infer<typeof analyzedUrlSchema>;
export type InsertAnalyzedUrl = z.infer<typeof insertAnalyzedUrlSchema>;
export type SeoMetric = z.infer<typeof seoMetricSchema>;
export type CvssVulnerability = z.infer<typeof cvssVulnerabilitySchema>;
export type SeoAnalysis = z.infer<typeof seoAnalysisSchema>;
