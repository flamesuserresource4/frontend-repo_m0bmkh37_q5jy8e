import { useState } from 'react'

export default function AIHelpers(){
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [question, setQuestion] = useState('What does this document say about totals?')
  const [answer, setAnswer] = useState('')
  const [text, setText] = useState('DocuParse Pro is a fast, privacy-first PDF toolkit for finance documents.')
  const [summary, setSummary] = useState('')
  const [translation, setTranslation] = useState('')

  const ask = async () => {
    const res = await fetch(`${backend}/api/ai/chat`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({question})})
    const json = await res.json(); setAnswer(json.answer)
  }
  const summarize = async () => {
    const res = await fetch(`${backend}/api/ai/summarize`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({text, max_sentences: 2})})
    const json = await res.json(); setSummary(json.summary)
  }
  const translate = async () => {
    const res = await fetch(`${backend}/api/ai/translate`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({text, target_lang: 'es'})})
    const json = await res.json(); setTranslation(json.translated)
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 text-blue-100">
      <h2 className="text-2xl font-semibold text-white mb-4">Generative AI Tools (Demo)</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
          <h3 className="font-semibold mb-2">Chat with PDF</h3>
          <textarea value={question} onChange={(e)=>setQuestion(e.target.value)} className="w-full h-24 bg-slate-900/60 border border-white/10 rounded p-2 text-sm" />
          <button onClick={ask} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1.5">Ask</button>
          {answer && <pre className="mt-2 text-xs bg-black/30 p-2 rounded whitespace-pre-wrap">{answer}</pre>}
        </div>
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
          <h3 className="font-semibold mb-2">Summarizer</h3>
          <textarea value={text} onChange={(e)=>setText(e.target.value)} className="w-full h-24 bg-slate-900/60 border border-white/10 rounded p-2 text-sm" />
          <button onClick={summarize} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1.5">Summarize</button>
          {summary && <pre className="mt-2 text-xs bg-black/30 p-2 rounded whitespace-pre-wrap">{summary}</pre>}
        </div>
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
          <h3 className="font-semibold mb-2">Translator</h3>
          <textarea value={text} onChange={(e)=>setText(e.target.value)} className="w-full h-24 bg-slate-900/60 border border-white/10 rounded p-2 text-sm" />
          <button onClick={translate} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1.5">Translate to Spanish</button>
          {translation && <pre className="mt-2 text-xs bg-black/30 p-2 rounded whitespace-pre-wrap">{translation}</pre>}
        </div>
      </div>
    </section>
  )
}
