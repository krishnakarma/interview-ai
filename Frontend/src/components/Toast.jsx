import React, { useEffect, useRef } from 'react'
import './Toast.scss'

/**
 * Toast — lightweight notification system
 * Usage:
 *   import { useToast } from './Toast'
 *   const toast = useToast()
 *   toast.success('Plan generated!')
 *   toast.info('Loading...')
 */

// ── Context ──────────────────────────────────────────────────────────────────
const ToastContext = React.createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([])

  const add = (message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, leaving: false }])
    setTimeout(() => remove(id), duration)
  }

  const remove = (id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t))
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 380)
  }

  const toast = {
    success: (msg, dur) => add(msg, 'success', dur),
    info:    (msg, dur) => add(msg, 'info', dur),
    warning: (msg, dur) => add(msg, 'warning', dur),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast--${t.type} ${t.leaving ? 'toast--leave' : 'toast--enter'}`}>
            <span className="toast__icon">
              {t.type === 'success' && <CheckIcon />}
              {t.type === 'info'    && <InfoIcon />}
              {t.type === 'warning' && <WarnIcon />}
            </span>
            <span className="toast__message">{t.message}</span>
            <button className="toast__close" onClick={() => remove(t.id)} aria-label="Dismiss">
              <XIcon />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const WarnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)