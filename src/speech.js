// Synthèse vocale en français.
// On garde une référence aux phrases en cours : sinon Safari peut les libérer
// en pleine lecture et ne jamais déclencher `onend`.
let currentUtterances = []

// Après avoir coupé une lecture en cours, Chrome et Safari ignorent parfois la phrase
// lancée juste derrière. On attend donc un court instant avant de reparler.
const DELAY_AFTER_INTERRUPTION_MS = 250
let lastInterruptionTime = 0
let delayedSpeechTimer = null

function createFrenchUtterance(text) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'fr-FR'
  return utterance
}

function interruptCurrentSpeech() {
  clearTimeout(delayedSpeechTimer)
  if (speechSynthesis.speaking || speechSynthesis.pending) {
    lastInterruptionTime = Date.now()
  }
  speechSynthesis.cancel()
}

function getRemainingDelayAfterInterruption() {
  const elapsedSinceInterruption = Date.now() - lastInterruptionTime
  return Math.max(0, DELAY_AFTER_INTERRUPTION_MS - elapsedSinceInterruption)
}

// Lit plusieurs phrases à la suite.
// - onSentenceStart(index) : au début de chaque phrase (pour afficher ce qu'elle annonce)
// - onStart / onEnd : au début de la lecture, à la fin de la dernière phrase
// Des phrases interrompues par une nouvelle lecture ne déclenchent plus rien.
// onStart part de la première phrase qui commence, pas forcément la première de la liste :
// si une phrase est quand même ignorée par le navigateur, la bouche de Bobi bouge pour les suivantes.
export function speakFrenchSentences(sentences, { onSentenceStart = () => {}, onStart = () => {}, onEnd = () => {} } = {}) {
  interruptCurrentSpeech()

  const utterances = sentences.map(createFrenchUtterance)
  const isStillCurrent = () => currentUtterances === utterances
  let hasReadingStarted = false

  utterances.forEach((utterance, index) => {
    const isLastSentence = index === utterances.length - 1
    utterance.onstart = () => {
      if (!isStillCurrent()) return
      if (!hasReadingStarted) {
        hasReadingStarted = true
        onStart()
      }
      onSentenceStart(index)
    }
    utterance.onend = () => isStillCurrent() && isLastSentence && onEnd()
    utterance.onerror = () => isStillCurrent() && onEnd()
  })

  currentUtterances = utterances
  const speakAllSentences = () => utterances.forEach((utterance) => speechSynthesis.speak(utterance))

  const remainingDelay = getRemainingDelayAfterInterruption()
  if (remainingDelay > 0) {
    delayedSpeechTimer = setTimeout(speakAllSentences, remainingDelay)
  } else {
    speakAllSentences()
  }
}

export function speakFrenchText(text, { onStart = () => {}, onEnd = () => {} } = {}) {
  speakFrenchSentences([text], { onStart, onEnd })
}

export function stopSpeaking() {
  currentUtterances = []
  interruptCurrentSpeech()
}
