import { useEffect, useState } from 'react'
import closedMouthImage from './assets/mouths/speech/mouth-closed.png'
import mouthAImage from './assets/mouths/speech/mouth-a.png'
import mouthOImage from './assets/mouths/speech/mouth-o.png'
import openSmileMouthImage from './assets/mouths/expressions/mouth-03-open.png'
import smallSmileMouthImage from './assets/mouths/expressions/mouth-02-small.png'
import wellDoneMouthImage from './assets/mouths/expressions/mouth-07-well-done.png'

// Bouches enchaînées pendant que Bobi parle
const SPEAKING_MOUTH_SEQUENCE = [mouthAImage, closedMouthImage, mouthOImage, closedMouthImage]
// Quand il est heureux (bonne réponse), il parle en alternant des sourires
const HAPPY_SPEAKING_MOUTH_SEQUENCE = [openSmileMouthImage, wellDoneMouthImage, smallSmileMouthImage, wellDoneMouthImage]
const SPEAKING_MOUTH_DURATION_MS = 150

// Charge les sourires à l'avance pour éviter un trou au premier changement sur iPad
HAPPY_SPEAKING_MOUTH_SEQUENCE.forEach((imageUrl) => {
  new Image().src = imageUrl
})

// Image de la bouche de Bobi : fermée au repos, animée pendant qu'il parle (en souriant s'il est heureux)
export function useSpeakingMouthImage(isSpeaking, { isHappy = false } = {}) {
  const [sequenceStep, setSequenceStep] = useState(0)

  useEffect(() => {
    if (!isSpeaking) return
    const timer = setInterval(() => setSequenceStep((step) => step + 1), SPEAKING_MOUTH_DURATION_MS)
    return () => clearInterval(timer)
  }, [isSpeaking])

  if (!isSpeaking) return closedMouthImage
  const sequence = isHappy ? HAPPY_SPEAKING_MOUTH_SEQUENCE : SPEAKING_MOUTH_SEQUENCE
  return sequence[sequenceStep % sequence.length]
}
