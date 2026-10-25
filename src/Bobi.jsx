import frontViewImage from './assets/bobi/front-view.png'
import neutralEyesImage from './assets/eyes/eyes-01-neutral.png'
import amazedEyesImage from './assets/eyes/eyes-amazed.png'
import { useIdleMouthImage } from './useIdleMouthImage'
import { useLivelyEyesImage } from './useLivelyEyesImage'
import { useSpeakingMouthImage } from './useSpeakingMouthImage'
import './Bobi.css'

// Regard imposé : émerveillé, ou neutre et immobile si Bobi n'est pas animé
function getImposedEyesImage(isAmazed, isLively) {
  if (isAmazed) return amazedEyesImage
  return isLively ? null : neutralEyesImage
}

// Bobi de face, par calques (corps, yeux, bouche).
// `isLively` : en attente, il cligne des yeux, regarde à gauche et à droite, et sourit de temps en temps.
function Bobi({ isAmazed = false, isSpeaking = false, isLively = false, className = '' }) {
  const speakingMouthImage = useSpeakingMouthImage(isSpeaking)
  const idleMouthImage = useIdleMouthImage(isLively)
  const eyesImage = useLivelyEyesImage(getImposedEyesImage(isAmazed, isLively))
  const mouthImage = isSpeaking ? speakingMouthImage : idleMouthImage

  return (
    <div className={`bobi ${className}`}>
      <img src={frontViewImage} alt="Bobi de face" />
      <img src={eyesImage} className="bobi-eyes" alt="" />
      <img src={mouthImage} className="bobi-mouth" alt="" />
    </div>
  )
}

export default Bobi
