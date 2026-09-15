import { imageUrl } from '../services/api'
import { categoryLabel, difficultyLabel, statusLabel } from '../constants/exercise'
import ImageUploader from './ImageUploader'

/** Ett kort i listan. Presenterande komponent - all data och alla callbacks kommer via props. */
export default function ExerciseCard({ exercise, onEdit, onToggleStatus, onUpload, busy }) {
  const src = imageUrl(exercise.imagePath)
  const isDone = exercise.status === 'Genomford'

  return (
    <article className="card exercise">
      <div className="exercise__media">
        {src ? (
          <img
            className="exercise__image"
            src={src}
            alt={`Skiss för övningen ${exercise.title}`}
            loading="lazy"
          />
        ) : (
          // Fallback när ingen bild laddats upp - kortet ska ha samma höjd
          // med och utan bild så att rutnätet inte hoppar.
          <div className="exercise__placeholder" aria-hidden="true">Ingen skiss uppladdad</div>
        )}
      </div>

      <div className="exercise__body">
        <div className="exercise__tags">
          <span className={`tag tag--${exercise.category.toLowerCase()}`}>
            {categoryLabel(exercise.category)}
          </span>
          <span className="tag tag--plain">{difficultyLabel(exercise.difficulty)}</span>
          <span className={`tag ${isDone ? 'tag--done' : 'tag--planned'}`}>
            {statusLabel(exercise.status)}
          </span>
        </div>

        <h3 className="exercise__title">{exercise.title}</h3>
        <p className="exercise__description">{exercise.description}</p>

        <div className="exercise__actions">
          <button type="button" className="button button--small" onClick={() => onEdit(exercise)}>
            Redigera
          </button>
          <button
            type="button"
            className="button button--small"
            onClick={() => onToggleStatus(exercise)}
            disabled={busy}
          >
            {isDone ? 'Markera som planerad' : 'Markera som genomförd'}
          </button>
          <ImageUploader
            exerciseId={exercise.id}
            onUpload={onUpload}
            hasImage={Boolean(exercise.imagePath)}
          />
        </div>
      </div>
    </article>
  )
}
