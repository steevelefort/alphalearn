import { ChosenLetterResult } from './chosenLetterResult'
import { BLOCK_FALL_DURATION_MS, BLOCK_FALL_INTERVAL_MS } from './letterBlockTiming'
import { createPressHandlers } from './pressHandlers'
import './LetterBlocks.css'

const RESULT_CLASS_NAMES = {
  [ChosenLetterResult.WRONG]: 'is-wrong',
  [ChosenLetterResult.CORRECT]: 'is-correct',
}

// Les blocs tombent du haut de l'écran l'un après l'autre, puis se posent au milieu.
// `roundId` fait partie de la clé : à chaque nouveau tour, les blocs sont recréés et retombent.
// `areLettersDisabled` empêche de toucher les blocs (pendant la fenêtre de bonne réponse).
// `fontClassName` donne la police des lettres (voir letterFonts.js).
// `chosenLetterResults` : résultat des lettres déjà touchées, par symbole (rouge si fausse, vert si juste).
function LetterBlocks({ roundId, letters, fontClassName, chosenLetterResults = {}, areLettersDisabled = false, onLetterPress }) {
  return (
    <div className="letter-blocks">
      {letters.map((letter, index) => (
        <button
          key={`${roundId}-${letter.symbol}`}
          type="button"
          className={['letter-block', fontClassName, RESULT_CLASS_NAMES[chosenLetterResults[letter.symbol]]]
            .filter(Boolean)
            .join(' ')}
          disabled={areLettersDisabled}
          style={{
            animationDuration: `${BLOCK_FALL_DURATION_MS}ms`,
            animationDelay: `${index * BLOCK_FALL_INTERVAL_MS}ms`,
          }}
          {...createPressHandlers(() => onLetterPress(letter), { isDisabled: areLettersDisabled })}
        >
          {letter.symbol}
        </button>
      ))}
    </div>
  )
}

export default LetterBlocks
