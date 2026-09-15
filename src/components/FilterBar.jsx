import { CATEGORIES } from '../constants/exercise'

/**
 * Filtrering på kategori. Filtreringen sker i klienten eftersom hela listan
 * ändå hämtas i ett anrop - en filterparameter i API:et hade gett ett extra
 * anrop per knapptryck utan vinst vid den här datamängden.
 */
export default function FilterBar({ active, onChange, counts }) {
  const options = [{ value: 'Alla', label: 'Alla' }, ...CATEGORIES]

  return (
    <nav className="filterbar" aria-label="Filtrera på kategori">
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={`chip ${active === value ? 'chip--active' : ''}`}
          onClick={() => onChange(value)}
          aria-pressed={active === value}
        >
          {label}
          <span className="chip__count">{counts[value] ?? 0}</span>
        </button>
      ))}
    </nav>
  )
}
