import React, { useEffect, useState } from 'react'
import './LoadingScreen.scss'

const MESSAGES = [
  'Analyzing job requirements…',
  'Matching your skill profile…',
  'Crafting technical questions…',
  'Building your roadmap…',
  'Identifying skill gaps…',
  'Finalizing your strategy…',
]

const LoadingScreen = ({ message }) => {
  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(8)

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length)
    }, 2200)

    const progTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 92) return p
        return p + Math.random() * 7
      })
    }, 1800)

    return () => {
      clearInterval(msgTimer)
      clearInterval(progTimer)
    }
  }, [])

  return (
    <div className="loading-screen">
      <div className="loading-screen__card">
        {/* Animated orb */}
        <div className="loading-orb">
          <div className="loading-orb__ring loading-orb__ring--1" />
          <div className="loading-orb__ring loading-orb__ring--2" />
          <div className="loading-orb__ring loading-orb__ring--3" />
          <div className="loading-orb__core">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
            </svg>
          </div>
        </div>

        <h2 className="loading-screen__title">
          {message || 'Crafting your interview plan'}
        </h2>

        <p className="loading-screen__sub" key={msgIndex}>
          {MESSAGES[msgIndex]}
        </p>

        {/* Progress bar */}
        <div className="loading-progress">
          <div
            className="loading-progress__bar"
            style={{ width: `${Math.min(progress, 94)}%` }}
          />
        </div>

        <p className="loading-screen__eta">This usually takes about 30 seconds</p>
      </div>
    </div>
  )
}

export default LoadingScreen