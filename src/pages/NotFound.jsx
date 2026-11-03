import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return <main className="lost-letter">
    <div className="lost-letter__stamp">RETURN TO SENDER</div>
    <p className="eyebrow">MISDIRECTED MAIL · 404</p>
    <h1>This page missed its stop.</h1>
    <p>The address may have changed, or this letter took a wrong turn.</p>
    <Link className="hero-button hero-button--primary" to="/home#doors"><ArrowLeft size={15} /> BACK TO THE DOORS</Link>
  </main>
}
