import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projects.js'

function ArchitectureSheet({ project }) {
  return (
    <figure className={`architecture-sheet architecture-sheet--${project.slug}`}>
      <figcaption>ARCHITECTURE SKETCH · {project.number}</figcaption>
      <div className="architecture-flow">
        {project.architecture.map((node, index) => (
          <div className="architecture-node" key={node.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{node.title}</strong>
            <small>{node.detail}</small>
          </div>
        ))}
      </div>
      <div className="architecture-line" aria-hidden="true" />
      <p>Illustrative system map based on the supplied project summary.</p>
    </figure>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const index = projects.findIndex((project) => project.slug === slug)
  const project = projects[index]
  if (!project) {
    return <main className="case-study case-study--missing">
      <p className="eyebrow">WORK ORDER NOT FOUND</p>
      <h1>This report isn’t in the filing cabinet.</h1>
      <Link className="report-back" to="/projects"><ArrowLeft size={15} /> RETURN TO THE GARAGE</Link>
    </main>
  }
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const sections = [
    ['problem', 'The problem'],
    ['data', 'The data'],
    ['approach', 'The approach'],
    ['results', 'Results'],
    ['next', 'What comes next'],
  ]

  return (
    <main className="case-study">
      <header className="report-topline">
        <Link className="back-to-doors" to="/projects"><ArrowLeft size={15} aria-hidden="true" /> BACK TO THE GARAGE</Link>
        <span>WORK ORDER · {project.number}</span>
      </header>
      <section className="report-heading" id="report-heading">
        <p className="eyebrow">{project.category} · {project.number} / {String(projects.length).padStart(2, '0')}</p>
        <h1>{project.title}</h1>
        <p className="report-summary">{project.summary}</p>
        <div className="project-card__tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </section>
      <section className="report-layout">
        <aside className="report-sidebar">
          <div className="report-metric"><span>{project.metric.label}</span><strong>{project.metric.value}</strong><small>{project.metric.detail}</small></div>
          <div className="report-stack"><h2>TOOLS &amp; MATERIALS</h2><ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul></div>
          {project.links.github && <a className="report-link" href={project.links.github} target="_blank" rel="noopener noreferrer">SOURCE REPOSITORY <ExternalLink size={14} aria-hidden="true" /></a>}
        </aside>
        <article className="report-body">
          <ArchitectureSheet project={project} />
          {sections.map(([key, title]) => (
            <section className="report-section" key={key}>
              <p className="report-section__number">{String(sections.findIndex(([sectionKey]) => sectionKey === key) + 1).padStart(2, '0')}</p>
              <div><h2>{title}</h2><p>{project.sections[key]}</p></div>
            </section>
          ))}
          <p className="report-note">Descriptions and reported metrics follow the project summaries and repository README. Add evaluation protocols and measured outcomes where available.</p>
        </article>
      </section>
      <nav className="report-pagination" aria-label="Other project reports">
        <Link to={`/projects/${previous.slug}`}><span>← PREVIOUS REPORT</span><strong>{previous.title}</strong></Link>
        <Link to={`/projects/${next.slug}`}><span>NEXT REPORT →</span><strong>{next.title}</strong></Link>
      </nav>
    </main>
  )
}
