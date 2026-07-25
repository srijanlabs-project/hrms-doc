export type Band = "Low" | "Medium" | "High";

/** Buckets the 1-5 performance rating into the 3 bands needed for a 9-box grid column. */
export function performanceBand(rating: number): Band {
  if (rating <= 2) return "Low";
  if (rating === 3) return "Medium";
  return "High";
}

export const POTENTIAL_ROWS: Band[] = ["High", "Medium", "Low"];
export const PERFORMANCE_COLUMNS: Band[] = ["Low", "Medium", "High"];
