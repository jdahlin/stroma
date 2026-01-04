import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

// Import UX styles from package
import '@repo/ux/styles/index.css'
import '@repo/editor/styles'
import './styles/base.css'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
