export default function TagFilter({ tags, selected, onSelect }) {
  return (
    <nav className="tag-filter" aria-label="Filter projects by discipline">
      {tags.map((tag) => (
        <button
          type="button"
          key={tag}
          className={`tag-filter__button${selected === tag ? ' is-selected' : ''}`}
          aria-pressed={selected === tag}
          onClick={() => onSelect(tag)}
        >
          {tag}
        </button>
      ))}
    </nav>
  )
}
