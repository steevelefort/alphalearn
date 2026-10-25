import frontViewImage from './assets/bobi/front-view.png'
import neutralEyesImage from './assets/eyes/eyes-01-neutral.png'
import amazedEyesImage from './assets/eyes/eyes-amazed.png'
import { useSpeakingMouthImage } from './useSpeakingMouthImage'
import './Bobi.css'

function Bobi({ isAmazed = false, isSpeaking = false, className = '' }) {
  const mouthImage = useSpeakingMouthImage(isSpeaking)

  return (
    <div className={`bobi ${className}`}>
      <img src={frontViewImage} alt="Bobi de face" />
      <img src={isAmazed ? amazedEyesImage : neutralEyesImage} className="bobi-eyes" alt="" />
      <img src={mouthImage} className="bobi-mouth" alt="" />
    </div>
  )
}

export default Bobi
