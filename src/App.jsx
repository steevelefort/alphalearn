import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import Accueil from './Accueil'
import Atelier from './Atelier'
import Portrait from './Portrait'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [ecran, setEcran] = useState('accueil')

  return (
    <>
      {ecran === 'accueil' && (
        <Accueil
          onStart={() => setCount((count) => count + 1)}
          onEnd={() => setEcran('atelier')}
        />
      )}
      {ecran === 'atelier' && <Atelier />}
      <Portrait />
    </>
  )
}

export default App
