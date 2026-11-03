import { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard.jsx'
import TagFilter from '../components/TagFilter.jsx'
import { projects, projectTags } from '../data/projects.js'

export default function Projects() {
  const [selectedTag, setSelectedTag] = useState('All')
  const visibleProjects = useMemo(() => selectedTag === 'All'
    ? projects
    : projects.filter((project) => project.tags.includes(selectedTag)), [selectedTag])

  return (
    <main className="projects-page">
      <header className="garage-header">
        <Link className="back-to-doors" to="/home#doors"><ArrowLeft size={15} aria-hidden="true" /> BACK TO THE DOORS</Link>
        <div className="garage-sign">
          <span>JOSIN JOSEPH · PERSONAL ARCHIVE</span>
          <h1>THE GARAGE</h1>
          <p>PROJECTS &amp; CASE STUDIES</p>
        </div>
        <div className="garage-header__meta"><span>WORK ORDERS 001—{String(projects.length).padStart(3, '0')}</span><span>FIELD NOTES · 2026</span></div>
      </header>
      <section className="projects-intro" aria-labelledby="projects-title">
        <p className="eyebrow">SELECTED WORK · BUILT WITH CURIOSITY</p>
        <h2 id="projects-title">A few things from the workshop.</h2>
        <p>Each project starts with a question. Open a report for the approach, the results and what comes next.</p>
      </section>
      <TagFilter tags={projectTags} selected={selectedTag} onSelect={setSelectedTag} />
      {visibleProjects.length > 0
        ? <section className="projects-grid" aria-live="polite" aria-label={`${visibleProjects.length} selected projects`}>
          {visibleProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </section>
        : <p className="projects-empty">No work orders match that filter yet.</p>}
      <footer className="projects-footer"><span>JOSIN JOSEPH · THE GARAGE</span><span>{visibleProjects.length} WORK ORDER{visibleProjects.length === 1 ? '' : 'S'}</span></footer>
    </main>
  )
}
