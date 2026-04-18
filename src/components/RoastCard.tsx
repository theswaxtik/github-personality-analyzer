import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Flame } from 'lucide-react'
import type { GitHubUser, GitHubRepo, LanguageStat } from '../types/github'
import { generateRoast } from '../utils/roastGenerator'

interface Props {
  user: GitHubUser
  repos: GitHubRepo[]
  langStats: LanguageStat[]
}

export default function RoastCard({ user, repos, langStats }: Props) {
  const [roast, setRoast] = useState(() => generateRoast({ user, repos, langStats }))
  const [key, setKey] = useState(0)

  const refresh = () => {
    setRoast(generateRoast({ user, repos, langStats }))
    setKey(k => k + 1)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame size={14} style={{ color: 'var(--orange)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Roast Mode</span>
          </div>
          <button onClick={refresh} className="btn-ghost text-xs gap-1.5">
            <RefreshCw size={11} />Refresh
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={key}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text)' }}
          >
            {roast}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
