import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import ProjectViewer from './components/ProjectViewer'
import './App.css'

function HomePage() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-inner">
          <div className="nav-brand">
            <img src="/logo.png" alt="SiteSnap" className="nav-logo" />
            <span className="nav-name">SiteSnap</span>
          </div>
          <a className="nav-cta" href="#download">
            Download
          </a>
        </div>
      </nav>

      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:token" element={<ProjectViewer />} />
      </Routes>
    </BrowserRouter>
  )
}