import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { applyLangToDocument, detectLang } from './lib/i18n.tsx'
import './index.css'

// Settle the language before the first paint. index.html ships as ar/rtl, so an
// English visitor would otherwise see one frame laid out right-to-left.
applyLangToDocument(detectLang())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
