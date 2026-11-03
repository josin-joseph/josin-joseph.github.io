import { projects } from '../data/projects.js'
import { skills } from '../data/skills.js'
import { journey } from '../data/journey.js'
import { about } from '../data/about.js'
import { contact } from '../data/contact.js'

export function buildIndex() {
  const records = []
  for (const project of projects) records.push({
    id: `project:${project.slug}`, type: 'Project', room: 'Garage', title: project.title,
    text: `${project.category} ${project.summary} ${project.tags.join(' ')} ${project.stack.join(' ')} ${Object.values(project.sections).join(' ')}`,
    route: `/projects/${project.slug}#report-heading`,
  })
  for (const group of skills) records.push({
    id: `skill:${group.id}`, type: 'Skill group', room: 'Workshop', title: group.name,
    text: `${group.intro} ${group.tools.map((tool) => `${tool.name} ${tool.level}`).join(' ')}`,
    route: `/skills#skill-group-${group.id}`,
  })
  for (const entry of journey) records.push({
    id: `journey:${entry.id}`, type: entry.type, room: 'Railway', title: entry.title,
    text: `${entry.org} ${entry.place} ${entry.dateLabel} ${entry.summary} ${entry.highlights.join(' ')}`,
    route: `/journey#station-${entry.id}`,
  })
  records.push(
    { id: 'about:story', type: 'Story', room: 'Studio', title: 'My story', text: `${about.intro} ${about.story.join(' ')}`, route: '/about#about-story-title' },
    { id: 'about:values', type: 'Values', room: 'Studio', title: 'Principles I build by', text: about.values.map((item) => `${item.title} ${item.line} ${item.proof}`).join(' '), route: '/about#about-values-title' },
    { id: 'about:looking', type: 'Opportunity', room: 'Studio', title: 'What I’m looking for', text: about.lookingFor, route: '/about#about-looking-title' },
    { id: 'contact:email', type: 'Contact', room: 'Post Office', title: 'Write Josin a letter', text: `${contact.intro} ${contact.email} ${contact.location} email contact`, route: '/contact#contact-intro' },
  )
  return records
}

export const searchIndex = buildIndex()
