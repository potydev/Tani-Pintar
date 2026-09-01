import React from 'react'
import ReactDOM from 'react-dom/client'
import TaniPintarApp from '../landing-page'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <TaniPintarApp />
    </ErrorBoundary>
  </React.StrictMode>,
)

