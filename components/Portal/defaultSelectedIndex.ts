/**
 * Which package a portal rate card starts on.
 *
 * The middle one, not the first: with three tiers the middle is the one
 * being recommended, and landing there makes the cheapest option a
 * deliberate step down rather than the default. An even count has no true
 * middle, so this takes the lower of the two — nudging toward the
 * recommended tier is fine, auto-selecting the most expensive is not.
 */
export function defaultSelectedIndex(count: number): number {
  return Math.max(0, Math.floor((count - 1) / 2));
}
