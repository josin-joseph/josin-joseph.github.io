export default function ServiceCard({ service, index }) {
  return <article className="service-card">
    <span>{String(index + 1).padStart(2, '0')} · WHAT I CAN CONTRIBUTE</span>
    <h3>{service.title}</h3>
    <p>{service.line}</p>
    <div>{service.examples.map((example) => <small key={example}>{example}</small>)}</div>
  </article>
}
