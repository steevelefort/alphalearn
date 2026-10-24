import decor from './assets/decors/chantier.png'
import corps from './assets/bobi/corps.png'
import brasArriere from './assets/bobi/bras-arriere-replie.png'
import lame from './assets/bobi/lame.png'
import yeux from './assets/yeux/yeux-01-neutres.png'
import bouche from './assets/bouches/parole/bouche-fermee.png'
import './Atelier.css'

// Coordonnées reprises de la maquette animation.html (repère de Bobi).
// Le viewBox est cadré au plus près de Bobi : de la pelle du bras arrière au bas de la lame.
function Atelier() {
  return (
    <div className="atelier" style={{ backgroundImage: `url(${decor})` }}>
      <svg className="atelier-bobi" viewBox="166 60 944 684" role="img" aria-label="Bobi">
        <ellipse cx="710" cy="750" rx="350" ry="25" fill="#d2c39b" opacity="0.24" />
        <g className="atelier-bras">
          <image href={brasArriere} x="128.5" y="82.8" width="435" height="435" />
        </g>
        <image href={corps} x="290" y="240" width="760" height="506.67" />
        <g className="atelier-lame">
          <image href={lame} x="680" y="380" width="430" height="430" />
        </g>
        <image href={yeux} x="655" y="275" width="225" height="225" />
        <image href={bouche} x="733" y="395" width="205" height="205" />
      </svg>
    </div>
  )
}

export default Atelier
