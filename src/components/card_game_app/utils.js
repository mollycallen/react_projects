/**
 * Calculates the score of a hand of cards.
 * @param {Array<{value: string}>} cards - An array of card objects, each with a 'value' property.
 * @returns {number} The total score of the hand.
 *
 * @example
 * const hand = [{ value: 'A' }, { value: 'K' }, { value: '5' }];
 * const score = calculateScore(hand);
 * console.log(score); // Outputs: 16
 */
export function calculateScore (cards) {
  let total = 0
  let aceCount = 0

  // First, calculate the total assuming all Aces are 1
  for (let card of cards) {
    let value = card.value
    if (value === 'A') {
      aceCount++
      total += 1
    } else if (['J', 'Q', 'K'].includes(value)) {
      total += 10
    } else {
      total += parseInt(value)
    }
  }

  // Then, try to optimize Aces
  for (let i = 0; i < aceCount; i++) {
    if (total + 10 <= 21) {
      total += 10
    } else {
      break
    }
  }

  return total
}
