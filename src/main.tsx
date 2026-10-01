import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import { applyLangToDocument, INITIAL_LANG } from './lib/i18n.tsx'
import './index.css'

// Settle the language before the first paint, whatever the page around it
// shipped with: the site always opens in Arabic, right to left.
applyLangToDocument(INITIAL_LANG)

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// On the live site the container is empty and React builds the page. The
// annotation copy ships the same markup pre-rendered, and React adopts those
// nodes instead of replacing them — which is what keeps a comment anchored to
// the element it was placed on.
if (container.firstElementChild) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
