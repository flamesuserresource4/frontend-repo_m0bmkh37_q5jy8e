import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

function downloadBlob(blob, filename){
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function PDFTools(){
  const [mergeFiles, setMergeFiles] = useState([])
  const [singleFile, setSingleFile] = useState(null)
  const [pageSpec, setPageSpec] = useState('1-3')
  const [orderSpec, setOrderSpec] = useState('1,2,3')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const parsePages = (spec, maxPages) => {
    // e.g., "1-3,5,7-8" -> [1,2,3,5,7,8]
    const pages = new Set()
    const parts = spec.split(',').map(s=>s.trim()).filter(Boolean)
    for(const part of parts){
      if(part.includes('-')){
        const [a,b] = part.split('-').map(n=>parseInt(n,10))
        if(Number.isFinite(a) && Number.isFinite(b)){
          const start = Math.max(1, Math.min(a,b))
          const end = Math.min(maxPages, Math.max(a,b))
          for(let i=start;i<=end;i++) pages.add(i)
        }
      } else {
        const n = parseInt(part,10)
        if(Number.isFinite(n) && n>=1 && n<=maxPages) pages.add(n)
      }
    }
    return Array.from(pages).sort((x,y)=>x-y)
  }

  const doMerge = async () => {
    if(!mergeFiles || mergeFiles.length === 0){ setMessage('Select two or more PDFs to merge.'); return }
    setBusy(true); setMessage('Merging...')
    try{
      const outPdf = await PDFDocument.create()
      for(const file of mergeFiles){
        const bytes = await readFileAsArrayBuffer(file)
        const srcPdf = await PDFDocument.load(bytes)
        const copiedPages = await outPdf.copyPages(srcPdf, srcPdf.getPageIndices())
        copiedPages.forEach(p=>outPdf.addPage(p))
      }
      const outBytes = await outPdf.save()
      downloadBlob(new Blob([outBytes], {type:'application/pdf'}), 'merged.pdf')
      setMessage('Merged PDF downloaded.')
    }catch(e){
      console.error(e); setMessage('Failed to merge PDFs.')
    }finally{ setBusy(false) }
  }

  const doExtractPages = async () => {
    if(!singleFile){ setMessage('Select a PDF first.'); return }
    setBusy(true); setMessage('Extracting pages...')
    try{
      const bytes = await readFileAsArrayBuffer(singleFile)
      const srcPdf = await PDFDocument.load(bytes)
      const total = srcPdf.getPageCount()
      const wanted = parsePages(pageSpec || '1', total)
      if(wanted.length===0){ setMessage('No valid pages specified.'); setBusy(false); return }
      const outPdf = await PDFDocument.create()
      const indices = wanted.map(n=>n-1)
      const copiedPages = await outPdf.copyPages(srcPdf, indices)
      copiedPages.forEach(p=>outPdf.addPage(p))
      const outBytes = await outPdf.save()
      downloadBlob(new Blob([outBytes], {type:'application/pdf'}), 'pages-extracted.pdf')
      setMessage('Extracted pages downloaded.')
    }catch(e){
      console.error(e); setMessage('Failed to extract pages.')
    }finally{ setBusy(false) }
  }

  const doReorder = async () => {
    if(!singleFile){ setMessage('Select a PDF first.'); return }
    setBusy(true); setMessage('Reordering pages...')
    try{
      const bytes = await readFileAsArrayBuffer(singleFile)
      const srcPdf = await PDFDocument.load(bytes)
      const total = srcPdf.getPageCount()
      const order = orderSpec.split(',').map(s=>parseInt(s.trim(),10)).filter(n=>Number.isFinite(n) && n>=1 && n<=total)
      if(order.length===0){ setMessage('Provide a valid order like 2,1,3'); setBusy(false); return }
      const outPdf = await PDFDocument.create()
      const indices = order.map(n=>n-1)
      const copiedPages = await outPdf.copyPages(srcPdf, indices)
      copiedPages.forEach(p=>outPdf.addPage(p))
      const outBytes = await outPdf.save()
      downloadBlob(new Blob([outBytes], {type:'application/pdf'}), 'reordered.pdf')
      setMessage('Reordered PDF downloaded.')
    }catch(e){
      console.error(e); setMessage('Failed to reorder pages.')
    }finally{ setBusy(false) }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 text-blue-100">
      <h2 className="text-2xl font-semibold text-white mb-4">PDF Utilities (Client-side)</h2>
      <p className="text-blue-300/80 text-sm mb-6">All actions run in your browser. Files never leave your device.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-5">
          <h3 className="font-semibold mb-2">Merge PDFs</h3>
          <input type="file" accept="application/pdf" multiple onChange={(e)=>setMergeFiles(Array.from(e.target.files||[]))} />
          <button onClick={doMerge} disabled={busy} className="mt-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/60 text-white rounded px-3 py-1.5">Merge</button>
        </div>
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-5">
          <h3 className="font-semibold mb-2">Extract Pages</h3>
          <input type="file" accept="application/pdf" onChange={(e)=>setSingleFile(e.target.files?.[0]||null)} />
          <div className="mt-2 text-sm">Pages (e.g., 1-3,5):</div>
          <input value={pageSpec} onChange={(e)=>setPageSpec(e.target.value)} className="mt-1 w-full bg-slate-900/60 border border-white/10 rounded px-2 py-1 text-sm" />
          <button onClick={doExtractPages} disabled={busy} className="mt-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/60 text-white rounded px-3 py-1.5">Extract</button>
        </div>
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-5">
          <h3 className="font-semibold mb-2">Reorder Pages</h3>
          <input type="file" accept="application/pdf" onChange={(e)=>setSingleFile(e.target.files?.[0]||null)} />
          <div className="mt-2 text-sm">Order (e.g., 2,1,3):</div>
          <input value={orderSpec} onChange={(e)=>setOrderSpec(e.target.value)} className="mt-1 w-full bg-slate-900/60 border border-white/10 rounded px-2 py-1 text-sm" />
          <button onClick={doReorder} disabled={busy} className="mt-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/60 text-white rounded px-3 py-1.5">Apply</button>
        </div>
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-5">
          <h3 className="font-semibold mb-2">Compress & Protect</h3>
          <p className="text-blue-300/80 text-sm">Basic compression and password protection are coming soon. Were exploring fully client-side approaches to keep your documents private.</p>
        </div>
      </div>

      {message && <p className="mt-4 text-sm text-blue-300">{message}</p>}
    </section>
  )
}
