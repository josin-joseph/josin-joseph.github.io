import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { skills, services } from '../data/skills.js'
import { projects } from '../data/projects.js'
import SkillGroup from '../components/SkillGroup.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import ToolWall from '../three/ToolWall.jsx'

const projectBySlug = new Map(projects.map((project) => [project.slug, project]))
if (import.meta.env.DEV) {
  skills.flatMap((group) => group.tools).flatMap((tool) => tool.projects).forEach((slug) => {
    if (!projectBySlug.has(slug)) console.warn(`Unknown project slug in skills data: ${slug}`)
  })
}

const groups = skills.map((group, index) => ({ ...group, number: String(index + 1).padStart(2, '0') }))

export default function Skills() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(() => ({ group: groups[0], skill: groups[0].tools[0] }))
  const visibleGroups = useMemo(() => filter === 'all' ? groups : groups.filter((group) => group.id === filter), [filter])
  const linkedProjects = selected?.skill.projects.map((slug) => projectBySlug.get(slug)).filter(Boolean) ?? []

  const selectGroup = (id) => {
    setFilter(id)
    const group = groups.find((item) => item.id === id)
    if (group) setSelected({ group, skill: group.tools[0] })
  }

  return <main className="skills-page">
    <header className="skills-topline"><Link className="back-to-doors" to="/home#doors"><ArrowLeft size={15} aria-hidden="true" /> BACK TO THE DOORS</Link><span>THE WORKSHOP · TOOLS &amp; PRACTICE</span></header>
    <section className="skills-intro">
      <p className="eyebrow">A WORKING TOOLKIT · EVIDENCE OVER PERCENTAGES</p>
      <h1>Useful things, learned by making.</h1>
      <p>Tools are grouped by the kind of work they support. “Project use” points to a project in the Garage; “Learning” marks items without a project example in this archive.</p>
    </section>

    <section className="workshop-layout" aria-label="Skills and project evidence">
      <div className="workshop-main">
        <nav className="skill-filters" aria-label="Filter skill groups">
          <button type="button" className={filter === 'all' ? 'is-active' : ''} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>ALL GROUPS</button>
          {groups.map((group) => <button type="button" key={group.id} className={filter === group.id ? 'is-active' : ''} aria-pressed={filter === group.id} onClick={() => selectGroup(group.id)}>{group.name}</button>)}
        </nav>
        <div className="skill-groups">
          {visibleGroups.map((group) => <SkillGroup key={group.id} group={group} selectedId={selected && `${selected.group.id}:${selected.skill.name}`} onSelect={(chosenGroup, skill) => setSelected({ group: chosenGroup, skill })} />)}
        </div>
      </div>
      <aside className="skill-evidence" aria-live="polite">
        {selected ? <>
          <p className="eyebrow">SELECTED TOOL · {selected.group.name.toUpperCase()}</p>
          <h2>{selected.skill.name}</h2>
          <span className="skill-evidence__level">{selected.skill.level}</span>
          <h3>PROJECT EVIDENCE</h3>
          {linkedProjects.length
            ? <ul>{linkedProjects.map((project) => <li key={project.slug}><Link to={`/projects/${project.slug}`}>{project.title}<ArrowUpRight size={14} aria-hidden="true" /></Link></li>)}</ul>
            : <p className="skill-evidence__empty">No project example is listed in this archive yet.</p>}
          {selected.skill.evidence && <p className="skill-evidence__note">{selected.skill.evidence}</p>}
        </> : <p>Select a skill to see its project evidence.</p>}
        <Link className="skill-evidence__all" to="/projects">VIEW ALL GARAGE PROJECTS <ExternalLink size={13} aria-hidden="true" /></Link>
      </aside>
    </section>

    <section className="tool-wall-section" aria-labelledby="tool-wall-title">
      <div><p className="eyebrow">THE PEGBOARD</p><h2 id="tool-wall-title">Pick a tool group.</h2><p>Choose a hanging tool to filter the written list. The buttons work the same way without 3D.</p></div>
      <ToolWall groups={groups} activeId={filter === 'all' ? '' : filter} onSelect={selectGroup} />
      <div className="tool-wall__controls" role="group" aria-label="Choose a tool group">
        {groups.map((group) => <button type="button" key={group.id} aria-pressed={filter === group.id} onClick={() => selectGroup(group.id)}>{group.name}</button>)}
      </div>
    </section>

    <section className="services-section" aria-labelledby="services-title">
      <div className="services-section__heading"><p className="eyebrow">WHAT I CAN CONTRIBUTE</p><h2 id="services-title">Useful work, with room to learn.</h2><p>Areas I’m interested in contributing to on a team or internship.</p></div>
      <div className="services-grid">{services.map((service, index) => <ServiceCard key={service.title} service={service} index={index} />)}</div>
    </section>

    <footer className="skills-footer"><span>JOSIN JOSEPH · THE WORKSHOP</span><span>{groups.reduce((count, group) => count + group.tools.length, 0)} TOOLS &amp; PRACTICES</span></footer>
  </main>
}
