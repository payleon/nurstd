/**
 * Utility functions for text formatting
 */

/**
 * Removes variant markers from question titles
 * e.g. "[Variant 3] Cardiac Assessment" -> "Cardiac Assessment"
 */
export function cleanQuestionTitle(title: string): string {
  return title ? title.replace(/\[Variant \d+\]\s*/g, '') : "Question";
}
