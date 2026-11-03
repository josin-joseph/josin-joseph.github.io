export default function TypeFilter({ types, selected, onSelect }) {
  return <nav className="journey-filters" aria-label="Filter journey stations">
    {types.map((type) => <button key={type.id} type="button" aria-pressed={selected === type.id} className={selected === type.id ? 'is-active' : ''} onClick={() => onSelect(type.id)}>{type.label}</button>)}
  </nav>
}
