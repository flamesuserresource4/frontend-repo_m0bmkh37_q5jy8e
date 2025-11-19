import TopNav from './components/TopNav'
import Extractor from './components/Extractor'
import AIHelpers from './components/AIHelpers'
import PDFTools from './components/PDFTools'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-blue-100">
      <TopNav />

      <section className="max-w-6xl mx-auto px-4 pt-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">DocuParse Pro</h1>
          <p className="mt-3 text-blue-200">Process, convert, edit, and analyze documents with a privacy-first toolkit.</p>
          <div className="mt-6 inline-flex gap-3">
            <a href="#tools" className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2">Start Converting</a>
            <a href="/test" className="bg-slate-700 hover:bg-slate-600 text-white rounded px-4 py-2">Check Backend</a>
          </div>
        </div>
      </section>

      <Extractor />
      <PDFTools />
      <AIHelpers />

      <footer className="max-w-6xl mx-auto px-4 py-12 text-sm text-blue-300/70">
        <p>Files are processed locally or sent ephemerally without permanent storage. No sign-in required.</p>
      </footer>
    </div>
  )
}

export default App
