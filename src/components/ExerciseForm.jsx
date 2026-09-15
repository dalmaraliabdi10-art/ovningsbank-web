import { useEffect, useState } from 'react'
import { CATEGORIES, DIFFICULTIES, STATUSES } from '../constants/exercise'

const EMPTY = {
  title: '',
  description: '',
  category: 'Passningsspel',
  difficulty: 'Medel',
  status: 'Planerad'
}

/**
 * Samma formulär används för att skapa och för att redigera. En separat
 * redigeringskomponent hade duplicerat validering och fält; skillnaden är
 * liten nog att en "mode"-prop räcker.
 */
export default function ExerciseForm({ initial, onSubmit, onCancel, saving }) {
  const isEdit = Boolean(initial)
  const [values, setValues] = useState(initial ?? EMPTY)
  const [touched, setTouched] = useState(false)

  // När en annan övning väljs för redigering ska fälten fyllas om.
  useEffect(() => {
    setValues(initial ?? EMPTY)
    setTouched(false)
  }, [initial])

  const change = (field) => (event) =>
    setValues((current) => ({ ...current, [field]: event.target.value }))

  const titleError = touched && !values.title.trim() ? 'Titel måste anges.' : null
  const descriptionError = touched && !values.description.trim() ? 'Beskrivning måste anges.' : null

  const handleSubmit = async (event) => {
    event.preventDefault()
    setTouched(true)

    // Klientvalidering föregriper serverns - servern validerar ändå, men
    // användaren slipper vänta på ett anrop för att få veta att ett fält saknas.
    if (!values.title.trim() || !values.description.trim()) return

    const saved = await onSubmit(values)
    if (saved && !isEdit) {
      setValues(EMPTY)
      setTouched(false)
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2 className="form__title">{isEdit ? `Redigera: ${initial.title}` : 'Ny övning'}</h2>

      <label className="field">
        <span className="field__label">Titel</span>
        <input
          className={`field__input ${titleError ? 'field__input--invalid' : ''}`}
          type="text"
          value={values.title}
          onChange={change('title')}
          placeholder="t.ex. Rondo 5 mot 2"
          maxLength={120}
        />
        {titleError && <span className="field__error">{titleError}</span>}
      </label>

      <label className="field">
        <span className="field__label">Beskrivning</span>
        <textarea
          className={`field__input field__input--area ${descriptionError ? 'field__input--invalid' : ''}`}
          value={values.description}
          onChange={change('description')}
          rows={4}
          placeholder="Upplägg, antal spelare, ytans storlek, regler och tid."
        />
        {descriptionError && <span className="field__error">{descriptionError}</span>}
      </label>

      <div className="form__row">
        <label className="field">
          <span className="field__label">Kategori</span>
          <select className="field__input" value={values.category} onChange={change('category')}>
            {CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Svårighetsgrad</span>
          <select className="field__input" value={values.difficulty} onChange={change('difficulty')}>
            {DIFFICULTIES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        {isEdit && (
          <label className="field">
            <span className="field__label">Status</span>
            <select className="field__input" value={values.status} onChange={change('status')}>
              {STATUSES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="form__actions">
        <button type="submit" className="button button--primary" disabled={saving}>
          {saving ? 'Sparar…' : isEdit ? 'Spara ändringar' : 'Lägg till övning'}
        </button>
        {isEdit && (
          <button type="button" className="button" onClick={onCancel} disabled={saving}>
            Avbryt
          </button>
        )}
      </div>
    </form>
  )
}
