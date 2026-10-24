import { useEffect, useState } from 'react'
import corps from './assets/bobi/bobi-face.png'
import yeuxNeutres from './assets/yeux/yeux-01-neutres.png'
import yeuxEmerveilles from './assets/yeux/yeux-emerveilles.png'
import boucheFermee from './assets/bouches/parole/bouche-fermee.png'
import boucheA from './assets/bouches/parole/bouche-a.png'
import boucheO from './assets/bouches/parole/bouche-o.png'
import './Bobi.css'

// Bouches enchaînées pendant que Bobi parle
const paroles = [boucheA, boucheFermee, boucheO, boucheFermee]

function Bobi({ content = false, parle = false, className = '' }) {
  const [etape, setEtape] = useState(0)

  useEffect(() => {
    if (!parle) return
    const timer = setInterval(() => setEtape((etape) => etape + 1), 150)
    return () => clearInterval(timer)
  }, [parle])

  return (
    <div className={`bobi ${className}`}>
      <img src={corps} alt="Bobi de face" />
      <img src={content ? yeuxEmerveilles : yeuxNeutres} className="bobi-yeux" alt="" />
      <img src={parle ? paroles[etape % paroles.length] : boucheFermee} className="bobi-bouche" alt="" />
    </div>
  )
}

export default Bobi
