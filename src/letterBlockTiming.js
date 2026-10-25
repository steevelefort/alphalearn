// Durées de la chute des blocs de lettres (utilisées par LetterBlocks et WorkshopScreen)
export const BLOCK_FALL_DURATION_MS = 600
export const BLOCK_FALL_INTERVAL_MS = 250

// Temps total avant que le dernier bloc soit posé
export function getAllBlocksLandedDelayMs(blockCount) {
  return (blockCount - 1) * BLOCK_FALL_INTERVAL_MS + BLOCK_FALL_DURATION_MS
}
