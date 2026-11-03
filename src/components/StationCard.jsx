const typeLabels = { education: 'EDUCATION', experience: 'EXPERIENCE', leadership: 'LEADERSHIP', certificates: 'CERTIFICATE / AWARD' }

export default function StationCard({ station, index, active }) {
  return <article className={`station-card station-card--${index % 2 ? 'right' : 'left'}${active ? ' is-current' : ''}`} id={`station-${station.id}`}>
    <span className="station-card__marker" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    <div className="station-card__board">
      <div className="station-card__topline"><span>{typeLabels[station.type]}</span><span>{station.dateLabel}</span></div>
      <h2>{station.title}</h2>
      <p className="station-card__org">{station.org}{station.place ? ` · ${station.place}` : ''}</p>
      <p className="station-card__summary">{station.summary}</p>
      {station.highlights?.length > 0 && <ul>{station.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
      <span className="station-card__platform">STATION {String(index + 1).padStart(2, '0')}</span>
    </div>
  </article>
}
