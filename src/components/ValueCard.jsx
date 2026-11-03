export default function ValueCard({ value, index }) {
  return <article className="value-card">
    <span className="value-card__number">{String(index + 1).padStart(2, '0')}</span>
    <h3>{value.title}</h3>
    <p>{value.line}</p>
    <small>{value.proof}</small>
  </article>
}
