const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5080'

/**
 * Eget feltyp så att anropande kod kan skilja på ett fel vi själva kastat
 * (med ett meddelande avsett för användaren) och ett oväntat programfel.
 */
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Plockar ut ett läsbart felmeddelande ur svaret. ASP.NET Core svarar antingen
 * med vårt egna { message } eller med ett ProblemDetails-objekt vid
 * valideringsfel - båda hanteras här så att komponenterna slipper.
 */
async function readErrorMessage(response) {
  try {
    const body = await response.json()

    if (body?.message) return body.message

    if (body?.errors) {
      const first = Object.values(body.errors).flat()[0]
      if (first) return first
    }

    if (body?.title) return body.title
  } catch {
    // Svaret var inte JSON - fall tillbaka på statuskoden nedan.
  }

  if (response.status === 404) return 'Övningen kunde inte hittas.'
  if (response.status >= 500) return 'Servern svarade med ett fel. Försök igen om en stund.'
  return `Något gick fel (HTTP ${response.status}).`
}

/**
 * All fetch-logik och all felhantering ligger här. Komponenterna får antingen
 * data eller ett ApiError med en färdig text - de behöver aldrig känna till
 * HTTP-statuskoder.
 */
async function request(path, options = {}) {
  let response

  try {
    response = await fetch(`${BASE_URL}${path}`, options)
  } catch {
    // fetch kastar bara vid nätverksfel, inte vid 4xx/5xx. Det är alltså här
    // vi hamnar när API:et inte är igång - det vanligaste felet i utveckling.
    throw new ApiError(
      'Kunde inte nå API:et. Kontrollera att backend är igång på ' + BASE_URL + '.'
    )
  }

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status)
  }

  if (response.status === 204) return null
  return response.json()
}

export const getExercises = () => request('/api/exercises')

export const getExercise = (id) => request(`/api/exercises/${id}`)

export const createExercise = (exercise) =>
  request('/api/exercises', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exercise)
  })

export const updateExercise = (id, exercise) =>
  request(`/api/exercises/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exercise)
  })

export const uploadImage = (id, file) => {
  const formData = new FormData()
  formData.append('file', file)

  // Ingen Content-Type-header här: webbläsaren sätter multipart-gränsen själv,
  // och en handskriven header skulle göra att servern inte kan tolka kroppen.
  return request(`/api/exercises/${id}/upload`, { method: 'POST', body: formData })
}

/** Gör om API:ets relativa bildsökväg till en full URL. */
export const imageUrl = (imagePath) => (imagePath ? `${BASE_URL}${imagePath}` : null)
