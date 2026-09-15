/** Sidhuvud. Tar emot antalet övningar så att rubriken speglar innehållet. */
export default function Header({ total, done }) {
  return (
    <header className="header">
      <div className="header__inner">
        <p className="header__eyebrow">Träningsplanering</p>
        <h1 className="header__title">Övningsbanken</h1>
        <p className="header__summary">
          {total === 0
            ? 'Inga övningar ännu — lägg till din första nedan.'
            : `${total} ${total === 1 ? 'övning' : 'övningar'} i banken, ` +
              `varav ${done} ${done === 1 ? 'genomförd' : 'genomförda'}.`}
        </p>
      </div>
    </header>
  )
}
