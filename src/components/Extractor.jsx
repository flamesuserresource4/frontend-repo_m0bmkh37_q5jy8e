import { useState } from 'react'

const tools = [
  { id: 'bank_statement', label: 'Bank Statement' },
  { id: 'credit_card', label: 'Credit Card' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'receipt', label: 'Receipt' },
  { id: 'salary_slip', label: 'Salary Slip' },
  { id: 'table_extract', label: 'Table Extract' },
]

export default function Extractor() {
  const [jobType, setJobType] = useState('bank_statement')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) { setError('Please select a file'); return }
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${backend}/api/extract/${jobType}`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Extraction failed')
      const json = await res.json()
      setResult(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="tools" className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold text-white mb-4">Financial Data Extraction</h2>
      <form onSubmit={onSubmit} className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-6 text-blue-100">
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <select value={jobType} onChange={(e)=>setJobType(e.target.value)} className="bg-slate-900/60 border border-white/10 rounded px-3 py-2">
            {tools.map(t=> <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <input type="file" accept="application/pdf,image/*" onChange={(e)=>setFile(e.target.files?.[0]||null)} className="text-sm" />
          <button disabled={loading} className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/60 text-white rounded px-4 py-2">
            {loading ? 'Processing...' : 'Convert to JSON'}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        {result && (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="bg-black/30 rounded p-3 overflow-auto text-xs">
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            </div>
            <div className="bg-black/30 rounded p-3 text-sm">
              <p className="mb-2"><span className="font-semibold">Summary:</span> {result.summary}</p>
              <a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(result.data))}`} download={`docuparse-${jobType}.json`} className="underline text-blue-300">Download JSON</a>
            </div>
          </div>
        )}
      </form>
    </section>
  )
}
