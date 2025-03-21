
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { taskVersionsMap } from './components/Workspace'

// Make taskVersionsMap globally accessible for the CenterPanel
;(window as any).taskVersionsMap = taskVersionsMap;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
