/**
 *
 * @param min (inclusive)
 * @param max (inclusive)
 * @returns number
 */
export function getRandomNumBetween(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
