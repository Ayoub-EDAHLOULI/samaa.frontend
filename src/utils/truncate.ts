/**
 * Truncate a string to a maximum length and append ellipsis if needed
 */
export function truncate(
  value: string | null | undefined,
  maxLength: number,
): string {
  if (!value) return "—";

  if (value.length <= maxLength) {
    return value;
  }

  return value.slice(0, maxLength).trimEnd() + "…";
}
