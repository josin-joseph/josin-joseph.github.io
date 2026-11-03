export default function SkillChip({ skill, selected, onClick }) {
  return <button className={`skill-chip${selected ? ' is-selected' : ''}`} type="button" aria-pressed={selected} onClick={onClick}>
    <span>{skill.name}</span><small>{skill.level}</small>
  </button>
}
