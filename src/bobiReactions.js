import amazedEyesImage from './assets/eyes/eyes-amazed.png'
// Pas encore d'image d'yeux tristes : « eyes-07-happy », aux sourcils relevés au milieu,
// donne plutôt un air inquiet. On s'en sert pour la tristesse en attendant.
import worriedEyesImage from './assets/eyes/eyes-07-happy.png'
import wellDoneMouthImage from './assets/mouths/expressions/mouth-07-well-done.png'
import closedMouthImage from './assets/mouths/speech/mouth-closed.png'

// Durée pendant laquelle Bobi montre sa réaction, avant le tour suivant
export const REACTION_DURATION_MS = 1500

export const BobiReaction = Object.freeze({
  SUCCESS: 'success',
  FAILURE: 'failure',
})

// Pas encore d'image de bouche triste : la bouche fermée, retournée à la verticale, fait une moue
export const REACTION_FACES = {
  [BobiReaction.SUCCESS]: { eyesImage: amazedEyesImage, mouthImage: wellDoneMouthImage, isMouthFlipped: false },
  [BobiReaction.FAILURE]: { eyesImage: worriedEyesImage, mouthImage: closedMouthImage, isMouthFlipped: true },
}

// Charge les images à l'avance pour que la réaction s'affiche tout de suite sur iPad
;[amazedEyesImage, worriedEyesImage, wellDoneMouthImage].forEach((imageUrl) => {
  new Image().src = imageUrl
})
