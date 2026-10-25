import { createPressHandlers } from './pressHandlers'
import SpeakerIcon from './SpeakerIcon'
import './RepeatInstructionButton.css'

// Gros bouton haut-parleur : Bobi répète la consigne.
// `isAvailable` : tant qu'il vaut false, le bouton est invisible (mais garde sa place) et inactif.
function RepeatInstructionButton({ isAvailable, onPress }) {
  return (
    <button
      type="button"
      className={`repeat-instruction-button ${isAvailable ? 'is-revealed' : ''}`}
      aria-label="Répéter la consigne"
      disabled={!isAvailable}
      {...createPressHandlers(onPress, { isDisabled: !isAvailable })}
    >
      <SpeakerIcon />
    </button>
  )
}

export default RepeatInstructionButton
