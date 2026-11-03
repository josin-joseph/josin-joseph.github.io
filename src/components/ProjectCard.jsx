import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className={`project-art project-art--${project.slug}`} aria-hidden="true">
        <span className="project-art__serial">WORK ORDER · {project.number}</span>
        <div className="project-art__flow">
          {project.architecture.map((node, index) => (
            <div className="project-art__node" key={node.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{node.title}</strong>
              <small>{node.detail}</small>
            </div>
          ))}
        </div>
        <span className="project-art__stamp">FIELD NOTES</span>
      </div>
      <div className="project-card__body">
        <p className="project-card__category">{project.category}</p>
        <h2>{project.title}</h2>
        <p className="project-card__summary">{project.summary}</p>
        <div className="project-card__tags" aria-label="Project tags">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="project-card__footer">
          <div className="project-metric"><span>{project.metric.label}</span><strong>{project.metric.value}</strong></div>
          <Link className="project-card__link" to={`/projects/${project.slug}`} aria-label={`View case study: ${project.title}`}>
            READ REPORT <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
