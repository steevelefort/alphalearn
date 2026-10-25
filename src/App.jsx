import { useState } from 'react'
import WelcomeScreen from './WelcomeScreen'
import WorkshopScreen from './WorkshopScreen'
import RotateDeviceScreen from './RotateDeviceScreen'
import SoundCheckScreen from './SoundCheckScreen'

const Screen = Object.freeze({
  WELCOME: 'welcome',
  WORKSHOP: 'workshop',
})

// Écran caché d'écoute des sons, pour les tests sur appareil : adresse du jeu suivie de « ?sons »
const IS_SOUND_CHECK_REQUESTED = new URLSearchParams(window.location.search).has('sons')

function Game() {
  const [currentScreen, setCurrentScreen] = useState(Screen.WELCOME)
  const [firstName, setFirstName] = useState('')

  function startGame(enteredFirstName) {
    setFirstName(enteredFirstName)
    setCurrentScreen(Screen.WORKSHOP)
  }

  return (
    <>
      {currentScreen === Screen.WELCOME && (
        <WelcomeScreen onTransitionToGameEnd={startGame} />
      )}
      {currentScreen === Screen.WORKSHOP && <WorkshopScreen firstName={firstName} />}
      <RotateDeviceScreen />
    </>
  )
}

function App() {
  return IS_SOUND_CHECK_REQUESTED ? <SoundCheckScreen /> : <Game />
}

export default App
