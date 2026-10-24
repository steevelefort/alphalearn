import decor from './assets/decors/chantier.png'
import Bobi from './Bobi'
import './Portrait.css'

// Affiché uniquement en mode portrait (voir Portrait.css)
function Portrait() {
  return (
    <div className="portrait" style={{ backgroundImage: `url(${decor})` }}>
      <p className="portrait-bulle">Tourne ton écran pour jouer avec moi&nbsp;!&nbsp;↻</p>
      <Bobi className="portrait-bobi" />
    </div>
  )
}

export default Portrait
