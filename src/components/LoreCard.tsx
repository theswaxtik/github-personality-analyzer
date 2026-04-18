import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ScrollText, RefreshCw } from 'lucide-react'
import type { GitHubUser, GitHubRepo, LanguageStat } from '../types/github'
import { generateLore } from '../utils/generateLore'

interface Props {
  user: GitHubUser
  repos: GitHubRepo[]
  langStats: LanguageStat[]
}

function TypewriterLine({ text, delay }: { text: string; delay: number }) {
  const [shown, setShown] = useState('')
  const [active, setActive] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setActive(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!active) return
    let i = 0
    const id = setInterval(() => {
      if (i < text.length) {
        setShown(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(id)
      }
    }, 18)
    return () => clearInterval(id)
  }, [active, text])

  return (
    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)', minHeight: '1.5rem' }}>
      <span style={{ color: 'var(--blue)', marginRight: 8 }}>·</span>
      {shown}
      {active && shown.length < text.length && (
        <span
          className="inline-block w-1 h-3.5 align-middle ml-0.5 animate-pulse"
          style={{ background: 'var(--blue)' }}
        />
      )}
    </p>
  )
}

export default function LoreCard({ user, repos, langStats }: Props) {
  const [lore, setLore] = useState(() => generateLore(user, repos, langStats))
  const [key, setKey] = useState(0)

  const refresh = () => {
    setLore(generateLore(user, repos, langStats))
    setKey(k => k + 1)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ScrollText size={13} style={{ color: 'var(--purple)' }} />
            <span className="section-label">GitHub Lore</span>
          </div>
          <button onClick={refresh} className="btn-ghost text-xs gap-1.5">
            <RefreshCw size={11} />New lore
          </button>
        </div>
        <div key={key} className="space-y-3">
          {lore.map((line, i) => (
            <TypewriterLine key={`${key}-${i}`} text={line} delay={i * 900} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
