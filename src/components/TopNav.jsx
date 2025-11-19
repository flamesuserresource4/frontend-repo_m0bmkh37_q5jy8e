import { Menu, FileText, Wand2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TopNav() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur border-b border-white/10 bg-slate-900/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <span className="text-white font-semibold">DocuParse Pro</span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link className="text-blue-200 hover:text-white transition" to="/">Home</Link>
          <Link className="text-blue-200 hover:text-white transition" to="/test">Backend Test</Link>
          <a className="text-blue-200 hover:text-white transition" href="#tools">Tools</a>
        </nav>
      </div>
    </header>
  )
}
