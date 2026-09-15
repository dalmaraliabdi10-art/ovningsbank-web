import { useRef, useState } from 'react'

/**
 * Filuppladdning för en enskild övning.
 * Den dolda input-elementet med en knapp framför ger ett konsekvent utseende -
 * webbläsarens egna filväljare går inte att formge.
 */
export default function ImageUploader({ exerciseId, onUpload, hasImage }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)

  const handleChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setBusy(true)
    await onUpload(exerciseId, file)
    setBusy(false)

    // Nollställ så att samma fil kan väljas igen om uppladdningen misslyckades.
    event.target.value = ''
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        className="button button--small"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
      >
        {busy ? 'Laddar upp…' : hasImage ? 'Byt bild' : 'Ladda upp bild'}
      </button>
    </>
  )
}
