import ExerciseCard from './ExerciseCard'

/**
 * Listan hanterar de tre lägena: laddar, tomt och data.
 * Att samla dem här gör att App.jsx bara behöver skicka in state, och att
 * inget läge kan glömmas bort när listan används på fler ställen.
 */
export default function ExerciseList({ exercises, loading, ...cardProps }) {
  if (loading) {
    return (
      <div className="state" role="status">
        <span className="spinner" aria-hidden="true" />
        Hämtar övningar…
      </div>
    )
  }

  if (exercises.length === 0) {
    return <p className="state">Inga övningar matchar filtret.</p>
  }

  return (
    <div className="grid">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} {...cardProps} />
      ))}
    </div>
  )
}
