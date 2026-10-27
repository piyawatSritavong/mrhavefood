import entries from '@/data/scheduled-articles.json';
import type { Article } from './article';

/** Owned content deployed with the site. No incoming credential or model call is required. */
export function repositoryArticles(): Article[] {
  return entries as Article[];
}
