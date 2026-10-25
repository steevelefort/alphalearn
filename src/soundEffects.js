// Petits sons joués quand l'enfant touche une lettre.
// Pour essayer un autre son, il suffit de changer l'import (les candidats sont dans assets/sounds,
// voir les crédits dans le README). Vite n'inclut dans le site que les sons importés ici.
import successSoundUrl from './assets/sounds/success-magic-chime.mp3'
import failureSoundUrl from './assets/sounds/failure-double-bass-descending.mp3'

function createSoundEffect(soundUrl) {
  const audio = new Audio(soundUrl)
  audio.preload = 'auto'
  return audio
}

const successSound = createSoundEffect(successSoundUrl)
const failureSound = createSoundEffect(failureSoundUrl)

// Rejoue le son depuis le début, même s'il était déjà en train de jouer.
// Sur iPad, un son ne peut partir que suite à un toucher : c'est le cas ici.
// Si le navigateur refuse quand même, le jeu continue sans le son.
function playSoundEffect(audio) {
  audio.currentTime = 0
  const playback = audio.play()
  if (playback) playback.catch(() => {})
}

export function playSuccessSound() {
  playSoundEffect(successSound)
}

export function playFailureSound() {
  playSoundEffect(failureSound)
}
