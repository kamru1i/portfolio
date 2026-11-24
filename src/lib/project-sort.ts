/**
 * Deterministic sorting comparator for portfolio projects:
 * 1. Published projects with explicit manual priority in ascending order (1, 2, 3...)
 * 2. Published projects with no priority ordered by newest publication date (published_at DESC, fallback created_at DESC)
 * 3. Stable tie-breaker: created_at DESC, id ASC.
 */
export function compareProjectsByPriorityAndRecency<T extends {
  id: string;
  manual_priority?: number | null;
  manualPriority?: number | null;
  sort_order?: number;
  order?: number;
  published_at?: string | null;
  publishedAt?: string;
  created_at?: string;
  createdAt?: string;
}>(a: T, b: T): number {
  const aPri = a.manual_priority !== undefined ? a.manual_priority : a.manualPriority;
  const bPri = b.manual_priority !== undefined ? b.manual_priority : b.manualPriority;

  const hasAPri = aPri !== null && aPri !== undefined && Number(aPri) > 0;
  const hasBPri = bPri !== null && bPri !== undefined && Number(bPri) > 0;

  if (hasAPri && hasBPri) {
    if (Number(aPri) !== Number(bPri)) return Number(aPri) - Number(bPri);
  } else if (hasAPri) {
    return -1; // a comes first
  } else if (hasBPri) {
    return 1; // b comes first
  }

  // Fallback to published_at DESC, fallback created_at DESC
  const aPub = a.published_at || a.publishedAt;
  const bPub = b.published_at || b.publishedAt;
  const aDate = aPub
    ? new Date(aPub).getTime()
    : a.created_at || a.createdAt
    ? new Date(a.created_at || a.createdAt!).getTime()
    : 0;
  const bDate = bPub
    ? new Date(bPub).getTime()
    : b.created_at || b.createdAt
    ? new Date(b.created_at || b.createdAt!).getTime()
    : 0;

  if (bDate !== aDate) return bDate - aDate;

  // Tie breaker 1: created_at DESC
  const aCreated = a.created_at || a.createdAt ? new Date(a.created_at || a.createdAt!).getTime() : 0;
  const bCreated = b.created_at || b.createdAt ? new Date(b.created_at || b.createdAt!).getTime() : 0;
  if (bCreated !== aCreated) return bCreated - aCreated;

  // Tie breaker 2: id ASC
  return (a.id || "").localeCompare(b.id || "");
}
