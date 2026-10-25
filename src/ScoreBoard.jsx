import './ScoreBoard.css'

// Score en haut à droite : bonnes réponses / essais
function ScoreBoard({ successCount, attemptCount }) {
  return (
    <p className="score-board" aria-label={`${successCount} bonnes réponses sur ${attemptCount} essais`}>
      <span className="score-board-star" aria-hidden="true">★</span>
      {successCount}
      <span className="score-board-separator"> / </span>
      {attemptCount}
    </p>
  )
}

export default ScoreBoard
