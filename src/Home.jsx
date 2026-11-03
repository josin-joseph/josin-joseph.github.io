import Hero from './pages/Hero.jsx'
import DoorsPlaceholder from './components/DoorsPlaceholder.jsx'
import PostOfficeSection from './components/PostOfficeSection.jsx'

export default function Home({ animate = true }) {
  return (
    <main className="home-page">
      <Hero animate={animate} />
      <DoorsPlaceholder />
      <PostOfficeSection />
      <footer className="home-footer">
        <span>JOSIN JOSEPH · PERSONAL ARCHIVE</span>
        <span>THE STORY CONTINUES</span>
      </footer>
    </main>
  )
}
