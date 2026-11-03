import SkillChip from './SkillChip.jsx'

export default function SkillGroup({ group, selectedId, onSelect }) {
  return <section className="skill-group" id={`skill-group-${group.id}`} aria-labelledby={`skill-title-${group.id}`}>
    <div className="skill-group__heading"><span>{group.number}</span><div><h2 id={`skill-title-${group.id}`}>{group.name}</h2><p>{group.intro}</p></div></div>
    <div className="skill-group__chips">{group.tools.map((skill) => <SkillChip key={skill.name} skill={skill} selected={selectedId === `${group.id}:${skill.name}`} onClick={() => onSelect(group, skill)} />)}</div>
  </section>
}
