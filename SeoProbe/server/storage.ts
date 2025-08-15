import { type AnalyzedUrl, type InsertAnalyzedUrl } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAnalyzedUrl(id: string): Promise<AnalyzedUrl | undefined>;
  getAnalyzedUrlByUrl(url: string): Promise<AnalyzedUrl | undefined>;
  createAnalyzedUrl(data: InsertAnalyzedUrl): Promise<AnalyzedUrl>;
  getAllAnalyzedUrls(): Promise<AnalyzedUrl[]>;
}

export class MemStorage implements IStorage {
  private analyzedUrls: Map<string, AnalyzedUrl>;

  constructor() {
    this.analyzedUrls = new Map();
  }

  async getAnalyzedUrl(id: string): Promise<AnalyzedUrl | undefined> {
    return this.analyzedUrls.get(id);
  }

  async getAnalyzedUrlByUrl(url: string): Promise<AnalyzedUrl | undefined> {
    return Array.from(this.analyzedUrls.values()).find(
      (item) => item.url === url,
    );
  }

  async createAnalyzedUrl(insertData: InsertAnalyzedUrl): Promise<AnalyzedUrl> {
    const id = randomUUID();
    const analyzedUrl: AnalyzedUrl = {
      ...insertData,
      id,
      analyzedAt: new Date(),
    };
    this.analyzedUrls.set(id, analyzedUrl);
    return analyzedUrl;
  }

  async getAllAnalyzedUrls(): Promise<AnalyzedUrl[]> {
    return Array.from(this.analyzedUrls.values());
  }
}

export const storage = new MemStorage();
