import { useEffect, useState } from 'react'
import closedMouthImage from './assets/mouths/speech/mouth-closed.png'
import gentleMouthImage from './assets/mouths/expressions/mouth-08-gentle.png'
import smallSmileMouthImage from './assets/mouths/expressions/mouth-02-small.png'

// Bouche fermée entre deux expressions
const MIN_CLOSED_PAUSE_MS = 3000
const MAX_CLOSED_PAUSE_MS = 7000
// Durée d'une expression
const MIN_EXPRESSION_MS = 1500
const MAX_EXPRESSION_MS = 3000

// Expressions calmes, qui ne donnent pas l'impression que Bobi parle
const IDLE_EXPRESSION_IMAGES = [gentleMouthImage, smallSmileMouthImage]

// Charge les images à l'avance pour éviter un trou au premier changement sur iPad
IDLE_EXPRESSION_IMAGES.forEach((imageUrl) => {
  new Image().src = imageUrl
})

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function pickRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)]
}

// Bouche de Bobi pendant qu'il attend : fermée, avec de temps en temps un sourire.
// Avec `isActive` à false, elle reste fermée.
export function useIdleMouthImage(isActive = true) {
  const [idleMouthImage, setIdleMouthImage] = useState(closedMouthImage)

  useEffect(() => {
    if (!isActive) return
    let timer
    function waitThenShowRandomExpression() {
      timer = setTimeout(() => {
        setIdleMouthImage(pickRandomItem(IDLE_EXPRESSION_IMAGES))
        timer = setTimeout(() => {
          setIdleMouthImage(closedMouthImage)
          waitThenShowRandomExpression()
        }, randomBetween(MIN_EXPRESSION_MS, MAX_EXPRESSION_MS))
      }, randomBetween(MIN_CLOSED_PAUSE_MS, MAX_CLOSED_PAUSE_MS))
    }

    waitThenShowRandomExpression()
    return () => {
      clearTimeout(timer)
      setIdleMouthImage(closedMouthImage)
    }
  }, [isActive])

  return isActive ? idleMouthImage : closedMouthImage
}
