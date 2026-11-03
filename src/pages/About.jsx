import { ArrowLeft, ArrowUpRight, Download, Github, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'
import ValueCard from '../components/ValueCard.jsx'
import StudioDesk from '../three/StudioDesk.jsx'
import { about } from '../data/about.js'

const links = {
  resume: '/Josin-Joseph-Resume.pdf',
  github: 'https://github.com/josin-joseph',
  linkedin: 'https://www.linkedin.com/in/josinjoseph01',
}

export default function About() {
  return <main className="about-page">
    <header className="about-topline">
      <Link className="back-to-doors" to="/home#doors"><ArrowLeft size={15} aria-hidden="true" /> BACK TO THE DOORS</Link>
      <span>THE STUDIO · A PERSONAL NOTEBOOK</span>
    </header>

    <section className="about-opening">
      <div className="about-opening__copy">
        <p className="eyebrow">HELLO, I’M JOSIN</p>
        <h1>A curious builder, learning by making.</h1>
        <p className="about-opening__intro">{about.intro}</p>
        <p className="about-location"><span aria-hidden="true">✳</span> Kasaragod, Kerala, India</p>
        <div className="about-actions">
          <a className="hero-button hero-button--primary" href={links.resume} download><Download size={15} aria-hidden="true" /> DOWNLOAD RESUME</a>
          <Link className="about-text-link" to="/contact">LET’S CONNECT <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
      <figure className="about-portrait">
        <div className="about-portrait__frame"><img src="/portrait.jpg" alt="Josin Joseph seated in a vintage leather armchair" /></div>
        <figcaption>FIG. 02 · THE PERSON BEHIND THE PROJECTS</figcaption>
      </figure>
    </section>

    <section className="about-story" aria-labelledby="about-story-title">
      <div className="about-section-marker"><span>01</span><span>THE STORY</span></div>
      <div className="about-story__body">
        <h2 id="about-story-title">Small questions. Working ideas.</h2>
        {about.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <blockquote>“Small, useful work over vague claims.”</blockquote>
      </div>
    </section>

    <section className="about-values" aria-labelledby="about-values-title">
      <div className="about-section-marker"><span>02</span><span>WHAT I VALUE</span></div>
      <div className="about-section-main"><h2 id="about-values-title">Principles I try to build by.</h2>
        <div className="about-values__grid">{about.values.map((value, index) => <ValueCard value={value} index={index} key={value.title} />)}</div>
      </div>
    </section>

    <section className="about-looking" aria-labelledby="about-looking-title">
      <div className="about-section-marker"><span>03</span><span>NEXT CHAPTER</span></div>
      <div><p className="eyebrow">OPEN TO OPPORTUNITY</p><h2 id="about-looking-title">What I’m looking for.</h2><p>{about.lookingFor}</p></div>
    </section>

    <section className="about-bottom-grid">
      <article className="education-card">
        <div className="about-section-marker"><span>04</span><span>EDUCATION</span></div>
        <p className="eyebrow">CURRENTLY STUDYING</p><h2>{about.education.degree}</h2><p>{about.education.college}</p><span className="education-card__year">EXPECTED GRADUATION · {about.education.year}</span>
      </article>
      <article className="beyond-card">
        <div className="about-section-marker"><span>05</span><span>BEYOND THE CODE</span></div>
        <h2>A little more still to come.</h2><p>{about.beyondCode}</p>
      </article>
    </section>

    <StudioDesk hotspots={about.hotspots} />

    <footer className="about-footer">
      <div><p className="eyebrow">THE STORY CONTINUES</p><h2>Find me around the web.</h2></div>
      <nav aria-label="More about Josin">
        <a href={links.github} target="_blank" rel="noopener noreferrer"><Github size={16} aria-hidden="true" /> GITHUB</a>
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={16} aria-hidden="true" /> LINKEDIN</a>
        <Link to="/contact"><ArrowUpRight size={15} aria-hidden="true" /> POST OFFICE</Link>
        <Link to="/home#doors"><ArrowLeft size={15} aria-hidden="true" /> BACK TO THE DOORS</Link>
      </nav>
    </footer>
  </main>
}
