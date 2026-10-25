import backgroundImage from './assets/backgrounds/construction-site.jpg'
import Bobi from './Bobi'
import { RotateIcon } from './InlineIcons'
import './RotateDeviceScreen.css'

// Affiché uniquement en mode portrait (voir RotateDeviceScreen.css)
function RotateDeviceScreen() {
  return (
    <div className="rotate-device-screen" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <p className="rotate-device-bubble">
        Tourne ton écran pour jouer avec moi&nbsp;!&nbsp;<RotateIcon />
      </p>
      <Bobi className="rotate-device-bobi" />
    </div>
  )
}

export default RotateDeviceScreen
