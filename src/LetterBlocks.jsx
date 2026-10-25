import { BLOCK_FALL_DURATION_MS, BLOCK_FALL_INTERVAL_MS } from './letterBlockTiming'
import './LetterBlocks.css'

// Les blocs tombent du haut de l'écran l'un après l'autre, puis se posent au milieu.
// `roundId` fait partie de la clé : à chaque nouveau tour, les blocs sont recréés et retombent.
// `areLettersDisabled` empêche de toucher les blocs, par exemple pendant que Bobi réagit.
function LetterBlocks({ roundId, letters, areLettersDisabled = false, onLetterPress }) {
  return (
    <div className="letter-blocks">
      {letters.map((letter, index) => (
        <button
          key={`${roundId}-${letter.symbol}`}
          type="button"
          className="letter-block"
          disabled={areLettersDisabled}
          style={{
            animationDuration: `${BLOCK_FALL_DURATION_MS}ms`,
            animationDelay: `${index * BLOCK_FALL_INTERVAL_MS}ms`,
          }}
          onClick={() => onLetterPress(letter)}
        >
          {letter.symbol}
        </button>
      ))}
    </div>
  )
}

export default LetterBlocks
