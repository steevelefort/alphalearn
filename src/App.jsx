import { useState } from 'react'
import WelcomeScreen from './WelcomeScreen'
import WorkshopScreen from './WorkshopScreen'
import RotateDeviceScreen from './RotateDeviceScreen'

const Screen = Object.freeze({
  WELCOME: 'welcome',
  WORKSHOP: 'workshop',
})

function App() {
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

export default App
