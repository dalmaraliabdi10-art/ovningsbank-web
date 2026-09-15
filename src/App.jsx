import { useMemo, useState } from 'react'
import Header from './components/Header'
import Message from './components/Message'
import FilterBar from './components/FilterBar'
import ExerciseForm from './components/ExerciseForm'
import ExerciseList from './components/ExerciseList'
import { useExercises } from './hooks/useExercises'
import { CATEGORIES } from './constants/exercise'

export default function App() {
  const { exercises, loading, error, setError, reload, create, update, upload } = useExercises()

  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('Alla')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null)

  const counts = useMemo(() => {
    const result = { Alla: exercises.length }
    for (const { value } of CATEGORIES) {
      result[value] = exercises.filter((e) => e.category === value).length
    }
    return result
  }, [exercises])

  const visible = useMemo(
    () => (filter === 'Alla' ? exercises : exercises.filter((e) => e.category === filter)),
    [exercises, filter]
  )

  const doneCount = exercises.filter((e) => e.status === 'Genomford').length

  /**
   * Alla skrivande anrop går genom den här wrappern. Den är enda stället med
   * try/catch för skrivningar, vilket gör att inget anrop kan lämna appen i ett
   * läge där den fryser eller kraschar - felet hamnar alltid i banderollen.
   */
  const run = async (action, successMessage) => {
    setSaving(true)
    setError(null)
    setNotice(null)

    try {
      const result = await action()
      if (successMessage) setNotice(successMessage)
      return result
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = (values) =>
    editing
      ? run(async () => {
          const saved = await update(editing.id, values)
          setEditing(null)
          return saved
        }, 'Övningen uppdaterades.')
      : run(() => create(values), 'Övningen lades till.')

  const handleToggleStatus = (exercise) =>
    run(
      () =>
        update(exercise.id, {
          ...exercise,
          status: exercise.status === 'Genomford' ? 'Planerad' : 'Genomford'
        }),
      'Status uppdaterades.'
    )

  const handleUpload = (id, file) => run(() => upload(id, file), 'Bilden laddades upp.')

  return (
    <div className="page">
      <Header total={exercises.length} done={doneCount} />

      <main className="main">
        <Message kind="error" onDismiss={() => setError(null)}>
          {error}
        </Message>
        <Message kind="success" onDismiss={() => setNotice(null)}>
          {notice}
        </Message>

        {/* När listan inte kunde hämtas är ett omförsök det enda vettiga nästa
            steget. Knappen är neutral, inte primär: en grön CTA bredvid en röd
            felbanner skaver tonalt. Den är inte heller röd - röd kant signalerar
            destruktiv handling, och ett omförsök är motsatsen. */}
        {error && !loading && exercises.length === 0 && (
          <button type="button" className="button" onClick={reload}>
            Försök igen
          </button>
        )}

        <div className="layout">
          <section className="layout__aside" aria-label="Lägg till eller redigera övning">
            <ExerciseForm
              initial={editing}
              onSubmit={handleSubmit}
              onCancel={() => setEditing(null)}
              saving={saving}
            />
          </section>

          <section className="layout__main" aria-label="Övningar">
            <FilterBar active={filter} onChange={setFilter} counts={counts} />
            <ExerciseList
              exercises={visible}
              loading={loading}
              busy={saving}
              onEdit={setEditing}
              onToggleStatus={handleToggleStatus}
              onUpload={handleUpload}
            />
          </section>
        </div>
      </main>
    </div>
  )
}
