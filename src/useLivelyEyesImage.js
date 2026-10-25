import { useEffect, useState } from 'react'
import neutralEyesImage from './assets/eyes/eyes-01-neutral.png'
import leftEyesImage from './assets/eyes/eyes-02-left.png'
import rightEyesImage from './assets/eyes/eyes-03-right.png'
import halfClosedEyesImage from './assets/eyes/eyes-05-half-closed.png'
import closedEyesImage from './assets/eyes/eyes-06-closed.png'

// Pause regard neutre entre deux mouvements
const MIN_NEUTRAL_PAUSE_MS = 1500
const MAX_NEUTRAL_PAUSE_MS = 4000
// Durée d'un regard sur le côté
const MIN_SIDE_GLANCE_MS = 700
const MAX_SIDE_GLANCE_MS = 1600

// Charge les images à l'avance : sinon, sur iPad, le premier clignement
// ou le premier regard peut afficher un trou le temps que l'image arrive.
;[leftEyesImage, rightEyesImage, halfClosedEyesImage, closedEyesImage].forEach((imageUrl) => {
  new Image().src = imageUrl
})

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

// Un mouvement = une suite d'images, chacune affichée pendant une durée donnée
function createBlinkFrames() {
  return [
    { image: halfClosedEyesImage, durationMs: 60 },
    { image: closedEyesImage, durationMs: 110 },
    { image: halfClosedEyesImage, durationMs: 60 },
  ]
}

function createSideGlanceFrames(sideEyesImage) {
  return [{ image: sideEyesImage, durationMs: randomBetween(MIN_SIDE_GLANCE_MS, MAX_SIDE_GLANCE_MS) }]
}

// Cligner est deux fois plus fréquent que regarder d'un côté ou de l'autre
function pickRandomEyeMovementFrames() {
  const draw = Math.random()
  if (draw < 0.5) return createBlinkFrames()
  if (draw < 0.75) return createSideGlanceFrames(leftEyesImage)
  return createSideGlanceFrames(rightEyesImage)
}

// Image des yeux de Bobi : il regarde à gauche, à droite et cligne des yeux au hasard.
// `expressionEyesImage` impose un regard (émerveillé après une réussite, par exemple) :
// tant qu'il est fourni, les mouvements au hasard s'arrêtent, puis reprennent ensuite.
export function useLivelyEyesImage(expressionEyesImage = null) {
  const [idleEyesImage, setIdleEyesImage] = useState(neutralEyesImage)
  const isExpressionShown = expressionEyesImage !== null

  useEffect(() => {
    if (isExpressionShown) return

    let timer
    function playFrames(frames, onFramesEnd) {
      if (frames.length === 0) {
        onFramesEnd()
        return
      }
      const [currentFrame, ...remainingFrames] = frames
      setIdleEyesImage(currentFrame.image)
      timer = setTimeout(() => playFrames(remainingFrames, onFramesEnd), currentFrame.durationMs)
    }

    function waitThenPlayRandomMovement() {
      timer = setTimeout(() => {
        playFrames(pickRandomEyeMovementFrames(), () => {
          setIdleEyesImage(neutralEyesImage)
          waitThenPlayRandomMovement()
        })
      }, randomBetween(MIN_NEUTRAL_PAUSE_MS, MAX_NEUTRAL_PAUSE_MS))
    }

    waitThenPlayRandomMovement()
    return () => {
      clearTimeout(timer)
      // Après un regard imposé, Bobi repart d'un regard neutre
      setIdleEyesImage(neutralEyesImage)
    }
  }, [isExpressionShown])

  return isExpressionShown ? expressionEyesImage : idleEyesImage
}
