import { ArrowUpRight, Download, Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { contact } from '../data/contact.js'

export default function PostalSlip() {
  return <aside className="postal-slip" aria-labelledby="postal-slip-title">
    <div className="postal-slip__heading"><span>RECIPIENT</span><strong>JOSIN JOSEPH</strong><div className="postal-slip__postmark">POST<br />OFFICE</div></div>
    <h2 id="postal-slip-title">Where to find me.</h2>
    <dl>
      <div><dt><MapPin size={14} aria-hidden="true" /> LOCATION</dt><dd>{contact.location}</dd></div>
      <div><dt><Mail size={14} aria-hidden="true" /> EMAIL</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>
    </dl>
    <nav className="postal-slip__links" aria-label="Contact links">
      <a href={contact.github} target="_blank" rel="noopener noreferrer"><Github size={16} aria-hidden="true" /> GITHUB <ArrowUpRight size={13} aria-hidden="true" /></a>
      <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={16} aria-hidden="true" /> LINKEDIN <ArrowUpRight size={13} aria-hidden="true" /></a>
      <a href={contact.resume} download><Download size={15} aria-hidden="true" /> DOWNLOAD RESUME <ArrowUpRight size={13} aria-hidden="true" /></a>
    </nav>
    <p className="postal-slip__privacy">{contact.form.privacyNote}</p>
  </aside>
}
