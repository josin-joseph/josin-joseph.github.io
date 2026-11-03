import { ArrowUpRight, Github, Linkedin, MapPin, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { contact } from '../data/contact.js'

export default function PostOfficeSection() {
  return <section className="post-office-section" id="post-office" aria-labelledby="post-office-title">
    <div className="post-office-counter-art" aria-hidden="true">
      <div className="post-office-counter-art__wall"><div className="post-office-counter-art__slots"><i /><i /><i /><i /><i /><i /></div><div className="post-office-counter-art__clock">10:10</div></div>
      <div className="post-office-counter-art__sign"><strong>POST OFFICE</strong><small>WRITE TO ME</small></div>
      <div className="post-office-counter-art__counter"><span>J.J.</span><b>MAIL SLOT</b></div>
      <div className="post-office-counter-art__stamp">POSTED</div>
    </div>
    <div className="post-office-section__copy">
      <p className="eyebrow">THE LAST STOP · THE POST OFFICE</p>
      <h2 id="post-office-title">Good work starts with a note.</h2>
      <p>For AI/ML opportunities, collaboration or a thoughtful question, send a letter and I’ll get back to you as soon as I can.</p>
      <div className="post-office-section__links">
        <a href={`mailto:${contact.email}`}><Mail size={15} aria-hidden="true" /> {contact.email}</a>
        <span><MapPin size={15} aria-hidden="true" /> {contact.location}</span>
        <a href={contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><Github size={16} /> GITHUB</a>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"><Linkedin size={16} /> LINKEDIN</a>
      </div>
      <Link className="post-office-button" to="/contact">WRITE A LETTER <ArrowUpRight size={16} aria-hidden="true" /></Link>
    </div>
  </section>
}
