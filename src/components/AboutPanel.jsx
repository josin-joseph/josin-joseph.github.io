export default function AboutPanel({ panel }) {
  if (!panel) return <p className="studio-desk__hint">Choose an object or use the buttons to open a note.</p>
  return <aside className="about-panel" aria-live="polite">
    <p className="eyebrow">A NOTE FROM THE STUDIO</p>
    <h3>{panel.label}</h3>
    <p>{panel.body}</p>
  </aside>
}
