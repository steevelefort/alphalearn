import { useEffect, useRef, useState } from 'react'
import backgroundImage from './assets/backgrounds/construction-site.jpg'
import bodyImage from './assets/bobi/body.png'
import foldedBackArmImage from './assets/bobi/back-arm-folded.png'
import bladeImage from './assets/bobi/blade.png'
import { BobiReaction, REACTION_DURATION_MS, REACTION_FACES } from './bobiReactions'
import { ChosenLetterResult } from './chosenLetterResult'
import { createCorrectAnswerLesson } from './correctAnswerLesson'
import CorrectAnswerPopup from './CorrectAnswerPopup'
import { readStoredDrawCounts, storeDrawCounts } from './drawCountsStorage'
import { createLetterRound } from './letterRound'
import { getAllBlocksLandedDelayMs } from './letterBlockTiming'
import LetterBlocks from './LetterBlocks'
import RepeatInstructionButton from './RepeatInstructionButton'
import ScoreBoard from './ScoreBoard'
import { playFailureSound, playSuccessSound } from './soundEffects'
import { speakFrenchText, stopSpeaking } from './speech'
import { useIdleMouthImage } from './useIdleMouthImage'
import { useLivelyEyesImage } from './useLivelyEyesImage'
import { useSpeakingMouthImage } from './useSpeakingMouthImage'
import { createWrongAnswerFeedback } from './wrongAnswerFeedback'
import './WorkshopScreen.css'

// Retourne la bouche à la verticale autour de son centre (y ≈ 503 dans le repère de Bobi)
const MOUTH_VERTICAL_FLIP_TRANSFORM = 'translate(0 1006) scale(1 -1)'

// Si la synthèse vocale ne signale pas la fin de la consigne, le bouton pour la répéter
// apparaît quand même au bout de ce délai (compté à partir du moment où Bobi commence)
const REPEAT_INSTRUCTION_FALLBACK_MS = 8000

// Bobi lit le texte ; sa bouche s'anime pendant toute la lecture
function speakAsBobi(text, setIsBobiSpeaking, { onEnd = () => {} } = {}) {
  speakFrenchText(text, {
    onStart: () => setIsBobiSpeaking(true),
    onEnd: () => {
      setIsBobiSpeaking(false)
      onEnd()
    },
  })
}

function WorkshopScreen({ firstName = '' }) {
  // Le premier tour reprend les compteurs du tirage équilibré gardés sur l'appareil
  const [round, setRound] = useState(() => createLetterRound(null, readStoredDrawCounts()))
  const [isBobiSpeaking, setIsBobiSpeaking] = useState(false)
  const [bobiReaction, setBobiReaction] = useState(null)
  // Compte les mauvaises réponses : chaque nouvelle erreur relance les 1,5 s de tristesse de Bobi
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0)
  const [correctAnswerLesson, setCorrectAnswerLesson] = useState(null)
  const [score, setScore] = useState({ successCount: 0, attemptCount: 0 })
  // Résultat des lettres touchées pendant le tour en cours, par symbole : leur bloc change de couleur
  const [chosenLetterResults, setChosenLetterResults] = useState({})
  // Le bouton pour répéter la consigne n'apparaît qu'une fois la consigne dite en entier
  const [isRepeatInstructionAvailable, setIsRepeatInstructionAvailable] = useState(false)
  // Pour ne pas répéter la même phrase d'erreur, ni le même encouragement, deux fois de suite
  const previousWrongAnswerTemplateIndex = useRef(null)
  const previousEncouragementIndex = useRef(null)
  const reactionFace = bobiReaction ? REACTION_FACES[bobiReaction] : null

  const speakingMouthImage = useSpeakingMouthImage(isBobiSpeaking, { isHappy: bobiReaction === BobiReaction.SUCCESS })
  const idleMouthImage = useIdleMouthImage()
  const eyesImage = useLivelyEyesImage(reactionFace ? reactionFace.eyesImage : null)
  const mouthImage = getCurrentMouthImage()

  function getCurrentMouthImage() {
    if (isBobiSpeaking) return speakingMouthImage
    if (reactionFace) return reactionFace.mouthImage
    return idleMouthImage
  }

  // À chaque tour, Bobi donne la consigne une fois que tous les blocs sont posés,
  // puis le bouton pour la répéter apparaît
  useEffect(() => {
    const allBlocksLandedDelay = getAllBlocksLandedDelayMs(round.letters.length)
    const showRepeatInstructionButton = () => setIsRepeatInstructionAvailable(true)
    const instructionTimer = setTimeout(
      () => speakAsBobi(round.instructionText, setIsBobiSpeaking, { onEnd: showRepeatInstructionButton }),
      allBlocksLandedDelay,
    )
    const fallbackTimer = setTimeout(showRepeatInstructionButton, allBlocksLandedDelay + REPEAT_INSTRUCTION_FALLBACK_MS)
    return () => {
      clearTimeout(instructionTimer)
      clearTimeout(fallbackTimer)
    }
  }, [round])

  // Après une mauvaise réponse, Bobi reprend son air habituel : les mêmes lettres restent
  // jusqu'à ce que l'enfant trouve, et il peut réessayer tout de suite.
  // (Après une bonne réponse, « Continuer » lance le tour suivant.)
  useEffect(() => {
    if (bobiReaction !== BobiReaction.FAILURE) return
    const timer = setTimeout(() => setBobiReaction(null), REACTION_DURATION_MS)
    return () => clearTimeout(timer)
  }, [bobiReaction, wrongAnswerCount])

  // Les compteurs du tirage sont gardés sur l'appareil à chaque nouveau tour
  useEffect(() => storeDrawCounts(round.drawCounts), [round])

  // En quittant l'écran, Bobi se tait
  useEffect(() => stopSpeaking, [])

  function repeatInstruction() {
    speakAsBobi(round.instructionText, setIsBobiSpeaking)
  }

  // Chaque lettre touchée compte comme un essai ; une bonne réponse compte aussi comme une réussite
  function countAttempt(isCorrect) {
    setScore((previousScore) => ({
      successCount: previousScore.successCount + (isCorrect ? 1 : 0),
      attemptCount: previousScore.attemptCount + 1,
    }))
  }

  // Mauvaise lettre : contrebasse qui descend, Bobi a l'air triste et dit quel son fait la lettre touchée
  // (« Non, ça c'est reu ! »)
  function reactToWrongLetter(chosenLetter) {
    playFailureSound()
    setBobiReaction(BobiReaction.FAILURE)
    setWrongAnswerCount((count) => count + 1)
    const feedback = createWrongAnswerFeedback(chosenLetter, previousWrongAnswerTemplateIndex.current)
    previousWrongAnswerTemplateIndex.current = feedback.templateIndex
    speakAsBobi(feedback.text, setIsBobiSpeaking)
  }

  // Bonne lettre : carillon magique, Bobi est émerveillé, sourit, et la fenêtre de bonne réponse s'ouvre
  function reactToCorrectLetter(chosenLetter) {
    playSuccessSound()
    setBobiReaction(BobiReaction.SUCCESS)
    const lesson = createCorrectAnswerLesson(chosenLetter, {
      previousEncouragementIndex: previousEncouragementIndex.current,
      firstName,
    })
    previousEncouragementIndex.current = lesson.encouragementIndex
    setCorrectAnswerLesson(lesson)
  }

  function rememberChosenLetterResult(chosenLetter, isCorrect) {
    const result = isCorrect ? ChosenLetterResult.CORRECT : ChosenLetterResult.WRONG
    setChosenLetterResults((previousResults) => ({ ...previousResults, [chosenLetter.symbol]: result }))
  }

  function reactToChosenLetter(chosenLetter) {
    const isCorrect = chosenLetter === round.targetLetter
    stopSpeaking()
    setIsBobiSpeaking(false)
    // Si l'enfant a coupé la consigne en touchant une lettre, il doit pouvoir la réécouter
    setIsRepeatInstructionAvailable(true)
    countAttempt(isCorrect)
    rememberChosenLetterResult(chosenLetter, isCorrect)
    if (isCorrect) {
      reactToCorrectLetter(chosenLetter)
    } else {
      reactToWrongLetter(chosenLetter)
    }
  }

  function closeLessonAndStartNextRound() {
    stopSpeaking()
    setIsBobiSpeaking(false)
    setCorrectAnswerLesson(null)
    setBobiReaction(null)
    setChosenLetterResults({})
    setIsRepeatInstructionAvailable(false)
    setRound((previousRound) => createLetterRound(previousRound))
  }

  return (
    <div className="workshop-screen" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Coordonnées reprises de la maquette animation.html (repère de Bobi).
          Le viewBox est cadré au plus près de Bobi : de la pelle du bras arrière au bas de la lame. */}
      <svg className="workshop-bobi" viewBox="166 60 944 684" role="img" aria-label="Bobi">
        <ellipse cx="710" cy="750" rx="350" ry="25" fill="#d2c39b" opacity="0.24" />
        <g className="workshop-back-arm">
          <image href={foldedBackArmImage} x="128.5" y="82.8" width="435" height="435" />
        </g>
        <image href={bodyImage} x="290" y="240" width="760" height="506.67" />
        <g className="workshop-blade">
          <image href={bladeImage} x="680" y="380" width="430" height="430" />
        </g>
        <image href={eyesImage} x="655" y="275" width="225" height="225" />
        <image
          href={mouthImage}
          x="733"
          y="395"
          width="205"
          height="205"
          transform={reactionFace && reactionFace.isMouthFlipped ? MOUTH_VERTICAL_FLIP_TRANSFORM : undefined}
        />
      </svg>

      <RepeatInstructionButton isAvailable={isRepeatInstructionAvailable} onPress={repeatInstruction} />
      <ScoreBoard successCount={score.successCount} attemptCount={score.attemptCount} />
      <LetterBlocks
        roundId={round.id}
        letters={round.letters}
        fontClassName={round.letterFont.className}
        chosenLetterResults={chosenLetterResults}
        areLettersDisabled={correctAnswerLesson !== null}
        onLetterPress={reactToChosenLetter}
      />
      {correctAnswerLesson && (
        <CorrectAnswerPopup
          lesson={correctAnswerLesson}
          onBobiSpeakingChange={setIsBobiSpeaking}
          onContinue={closeLessonAndStartNextRound}
        />
      )}
    </div>
  )
}

export default WorkshopScreen
