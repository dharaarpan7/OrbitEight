/**
 * Editorial formatting helpers — shared by the discovery cards so the
 * feed and the featured spread render metadata identically.
 */

/** "Aug 28, 2026" — human date for editorial metadata. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
