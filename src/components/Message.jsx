/**
 * Ett meddelande till användaren. Används för både fel och bekräftelser så att
 * de får samma placering och samma utseende genom hela appen.
 */
export default function Message({ kind = 'error', children, onDismiss }) {
  if (!children) return null

  return (
    <div className={`message message--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <span>{children}</span>
      {onDismiss && (
        <button type="button" className="message__close" onClick={onDismiss} aria-label="Stäng meddelandet">
          ×
        </button>
      )}
    </div>
  )
}
