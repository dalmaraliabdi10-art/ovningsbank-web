// API:et använder ASCII-namn i sina enums (Uppvarmning, Latt, Genomford).
// Här översatts de till svenska etiketter för gränssnittet. Kartan ligger på
// ett ställe så att en ny kategori bara behöver läggas till här och i API:et.

export const CATEGORIES = [
  { value: 'Uppvarmning', label: 'Uppvärmning' },
  { value: 'Passningsspel', label: 'Passningsspel' },
  { value: 'Avslut', label: 'Avslut' },
  { value: 'Taktik', label: 'Taktik' }
]

export const DIFFICULTIES = [
  { value: 'Latt', label: 'Lätt' },
  { value: 'Medel', label: 'Medel' },
  { value: 'Svar', label: 'Svår' }
]

export const STATUSES = [
  { value: 'Planerad', label: 'Planerad' },
  { value: 'Genomford', label: 'Genomförd' }
]

const toLabel = (list) => (value) =>
  list.find((item) => item.value === value)?.label ?? value

export const categoryLabel = toLabel(CATEGORIES)
export const difficultyLabel = toLabel(DIFFICULTIES)
export const statusLabel = toLabel(STATUSES)
