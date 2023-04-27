import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.module.scss'



export const URL = process.env.REACT_APP_API_URL || `http://localhost:3000`

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
