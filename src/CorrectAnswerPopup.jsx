import { useCallback, useEffect, useMemo, useState } from 'react'
import { createLessonSentences } from './correctAnswerLesson'
import { PlayIcon } from './InlineIcons'
import { createPressHandlers } from './pressHandlers'
import SpeakerIcon from './SpeakerIcon'
import { speakFrenchSentences } from './speech'
import { SyllablePartRole } from './syllables'
import './CorrectAnswerPopup.css'

// Si la synthèse vocale ne signale pas le début et la fin des phrases (ou ne marche pas),
// tout s'affiche quand même au bout de ce délai, bouton « Continuer » compris
const REVEAL_EVERYTHING_FALLBACK_MS = 8000

// Classe CSS de chaque rôle : lettre trouvée, lettre ajoutée, lettre qui aide (le u de « qu »)
function getPartClassName(role) {
  return `lesson-part lesson-part-${role}`
}

function ColoredSyllable({ syllable }) {
  return (
    <>
      {syllable.parts.map((part, index) => (
        <span key={index} className={getPartClassName(part.role)}>
          {part.text}
        </span>
      ))}
    </>
  )
}

// Rôle de chaque lettre du mot : celles des syllabes à mettre en évidence, null pour les autres
function getRoleOfEachWordLetter(word, syllableOccurrences) {
  const roles = Array(word.length).fill(null)
  syllableOccurrences.forEach((occurrence) => {
    let letterIndex = occurrence.start
    occurrence.parts.forEach((part) => {
      for (let partLetter = 0; partLetter < part.text.length; partLetter++) {
        roles[letterIndex] = part.role
        letterIndex++
      }
    })
  })
  return roles
}

function HighlightedWord({ word, syllableOccurrences }) {
  const roles = getRoleOfEachWordLetter(word, syllableOccurrences)
  return (
    <>
      {[...word].map((wordLetter, index) => (
        <span key={index} className={roles[index] ? getPartClassName(roles[index]) : undefined}>
          {wordLetter}
        </span>
      ))}
    </>
  )
}

// Fenêtre de bonne réponse : la lettre, une syllabe, puis un mot, qui apparaissent au fil de la voix de Bobi.
// Les boutons « Réécouter » et « Continuer » n'apparaissent qu'une fois toute l'explication donnée.
// Tout est toujours dans la page (invisible avant son tour) pour que rien ne bouge.
function CorrectAnswerPopup({ lesson, onBobiSpeakingChange, onContinue }) {
  const sentences = useMemo(() => createLessonSentences(lesson), [lesson])
  const [revealedItemCount, setRevealedItemCount] = useState(0)
  const [isExplanationFinished, setIsExplanationFinished] = useState(false)

  const lessonItems = [
    { key: 'letter', className: 'lesson-letter', content: <span className={getPartClassName(SyllablePartRole.FOUND_LETTER)}>{lesson.letter.symbol}</span> },
    lesson.syllable && { key: 'syllable', className: 'lesson-syllable', content: <ColoredSyllable syllable={lesson.syllable} /> },
    { key: 'word', className: 'lesson-word', content: <HighlightedWord word={lesson.word} syllableOccurrences={lesson.syllableOccurrences} /> },
  ].filter(Boolean)

  const speakLesson = useCallback(() => {
    speakFrenchSentences(sentences, {
      // Chaque phrase annonce l'élément de même rang : il apparaît quand Bobi commence à en parler
      onSentenceStart: (sentenceIndex) => setRevealedItemCount((count) => Math.max(count, sentenceIndex + 1)),
      onStart: () => onBobiSpeakingChange(true),
      // Fin de la lecture (ou échec de la synthèse vocale) : tout s'affiche, bouton « Continuer » compris
      onEnd: () => {
        onBobiSpeakingChange(false)
        setRevealedItemCount(sentences.length)
        setIsExplanationFinished(true)
      },
    })
  }, [sentences, onBobiSpeakingChange])

  // À l'ouverture, Bobi lit la leçon (la leçon ne change pas tant que la fenêtre est ouverte)
  useEffect(() => {
    speakLesson()
    const fallbackTimer = setTimeout(() => {
      setRevealedItemCount(sentences.length)
      setIsExplanationFinished(true)
    }, REVEAL_EVERYTHING_FALLBACK_MS)
    return () => clearTimeout(fallbackTimer)
  }, [speakLesson, sentences.length])

  return (
    <div className="correct-answer-overlay">
      <div className="correct-answer-popup" role="dialog" aria-label="Bonne réponse">
        {lessonItems.map((item, index) => (
          <p key={item.key} className={`lesson-item ${item.className} ${index < revealedItemCount ? 'is-revealed' : ''}`}>
            {item.content}
          </p>
        ))}

        <div className="correct-answer-actions">
          <button
            type="button"
            className={`correct-answer-replay-button ${isExplanationFinished ? 'is-revealed' : ''}`}
            aria-label="Réécouter"
            disabled={!isExplanationFinished}
            {...createPressHandlers(speakLesson, { isDisabled: !isExplanationFinished })}
          >
            <SpeakerIcon />
          </button>
          <button
            type="button"
            className={`correct-answer-continue-button ${isExplanationFinished ? 'is-revealed' : ''}`}
            disabled={!isExplanationFinished}
            {...createPressHandlers(onContinue, { isDisabled: !isExplanationFinished })}
          >
            Continuer <PlayIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CorrectAnswerPopup
