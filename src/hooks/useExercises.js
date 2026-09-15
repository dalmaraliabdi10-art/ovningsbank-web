import { useCallback, useEffect, useState } from 'react'
import * as api from '../services/api'

/**
 * Samlar övningarnas data, laddningsläge och fel på ett ställe.
 * En egen hook istället för Redux eller Context: appen har en enda datadomän
 * och ett grunt komponentträd, så ett globalt state-bibliotek hade tillfört
 * konfiguration utan att lösa något problem vi faktiskt har.
 */
export function useExercises() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setExercises(await api.getExercises())
    } catch (err) {
      setError(err.message)
    } finally {
      // finally, så att spinnern alltid slocknar - även när anropet misslyckas.
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const create = async (exercise) => {
    const created = await api.createExercise(exercise)
    setExercises((current) => [created, ...current])
    return created
  }

  const update = async (id, exercise) => {
    const updated = await api.updateExercise(id, exercise)
    replace(updated)
    return updated
  }

  const upload = async (id, file) => {
    const updated = await api.uploadImage(id, file)
    replace(updated)
    return updated
  }

  // Upload- och PUT-endpointen returnerar hela den uppdaterade övningen,
  // så listan kan uppdateras direkt utan ett extra GET-anrop.
  const replace = (updated) =>
    setExercises((current) => current.map((e) => (e.id === updated.id ? updated : e)))

  return { exercises, loading, error, setError, reload: load, create, update, upload }
}
