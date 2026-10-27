/** A scheduled article must stay private until its publication instant. */
export function isPublicationDue(article: { status: string; published_at: string }, now = Date.now()): boolean {
  const timestamp = Date.parse(article.published_at);
  return article.status === 'published' && Number.isFinite(timestamp) && timestamp <= now;
}
