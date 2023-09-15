import React from 'react'
import ReactDOM from 'react-dom/client'
import Demo1 from './Demo1.tsx'
import Demo2 from './Demo2.tsx'

import './main.css'
import styles from  './demo.module.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className={styles.PageWrapper}>
      <Demo1 />
      <Demo2 />
    </div>
  </React.StrictMode>,
)
