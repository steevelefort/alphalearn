// Gestion des appuis sur les boutons du jeu.
// On réagit dès que le doigt touche l'écran (touchstart), sans attendre qu'il se lève :
// sur iPad, un « click » est annulé si le doigt glisse un peu ou reste appuyé longtemps,
// ce qui arrive souvent avec un enfant. Il fallait alors toucher plusieurs fois.
// Safari 12 (iPad Mini 2) n'a pas les Pointer Events : on combine
// touchstart (écran tactile), mousedown (souris) et click (clavier : Entrée ou Espace).

// Après un toucher, le navigateur envoie aussi de faux événements souris (mousedown, click)
// au même endroit : on les ignore pendant ce délai, pour qu'un toucher ne compte qu'une fois.
// Sinon, toucher « Continuer » pourrait aussi choisir la lettre qui se trouve dessous.
const SIMULATED_MOUSE_EVENTS_DELAY_MS = 1000
let lastTouchTime = 0

function wasJustTouched() {
  return Date.now() - lastTouchTime < SIMULATED_MOUSE_EVENTS_DELAY_MS
}

// Propriétés à donner à un <button> : `onPress` est appelé une seule fois par appui.
// `isDisabled` doit suivre l'attribut disabled du bouton : React ne bloque pas
// les événements tactiles sur un bouton désactivé.
export function createPressHandlers(onPress, { isDisabled = false } = {}) {
  return {
    onTouchStart: () => {
      lastTouchTime = Date.now()
      if (!isDisabled) onPress()
    },
    onMouseDown: (event) => {
      const isMainMouseButton = event.button === 0
      if (isMainMouseButton && !wasJustTouched() && !isDisabled) onPress()
    },
    onClick: (event) => {
      // Un click déclenché au clavier a un `detail` à 0 ; ceux de la souris et du doigt sont déjà traités
      const isKeyboardActivation = event.detail === 0
      if (isKeyboardActivation && !wasJustTouched() && !isDisabled) onPress()
    },
  }
}
