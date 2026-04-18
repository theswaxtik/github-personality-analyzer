import React, { useRef, useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GitHubUser, GitHubRepo, LanguageStat } from '../types/github'
import { generateRoast } from '../utils/roastGenerator'
import { exportCardAsPng, CARD_BASE_STYLE, badgeStyle } from '../utils/exportCard'

interface Props {
  user: GitHubUser
  repos: GitHubRepo[]
  langStats: LanguageStat[]
}

function getRoastLevel(repos: GitHubRepo[], followers: number) {
  const stars = repos.reduce((s, r) => s + r.stargazers_count, 0)
  if (stars > 500 || followers > 200) return { label: 'Legendary 🏆', color: '#F0883E' }
  if (repos.length > 50 || followers > 50) return { label: 'Spicy 🌶️', color: '#F85149' }
  if (repos.length > 20) return { label: 'Medium', color: '#A371F7' }
  return { label: 'Mild', color: '#2F81F7' }
}

export default function RoastShareCard({ user, repos, langStats }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [roast, setRoast] = useState(() => generateRoast({ user, repos, langStats }))
  const [key, setKey] = useState(0)
  const [exporting, setExporting] = useState(false)
  const level = getRoastLevel(repos, user.followers)

  const refresh = () => {
    setRoast(generateRoast({ user, repos, langStats }))
    setKey(k => k + 1)
  }

  const handleExport = async () => {
    setExporting(true)
    await exportCardAsPng(cardRef as React.RefObject<HTMLElement>, `${user.login}-roast`)
    setExporting(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Controls — outside captured area */}
      <div className="flex items-center justify-between mb-3">
        <p className="section-label">Roast Card</p>
        <div className="flex items-center gap-2">
          <button onClick={refresh} className="btn-ghost text-xs gap-1.5">
            <RefreshCw size={11} />Refresh
          </button>
          <button onClick={handleExport} disabled={exporting} className="btn-secondary text-xs gap-1.5">
            <Download size={11} />{exporting ? 'Exporting…' : 'Download PNG'}
          </button>
        </div>
      </div>

      {/* ── Captured card — every style is explicit inline ── */}
      <div
        ref={cardRef}
        style={{ ...CARD_BASE_STYLE, maxWidth: 520, border: `1px solid ${level.color}25` }}
      >
        {/* Badge */}
        <div style={{ marginBottom: 20 }}>
          <span style={badgeStyle(level.color)}>🔥 {level.label} Roast</span>
        </div>

        {/* Roast text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{ marginBottom: 28 }}
          >
            <div style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '17px',
              fontWeight: 600,
              color: '#E6EDF3',
              lineHeight: '1.55',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              margin: 0,
              padding: 0,
            }}>
              "{roast}"
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: 18 }} />

        {/* Footer row — no flex, use inline-block so items sit on the same line */}
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {/* Avatar */}
          <img
            src={user.avatar_url}
            alt={user.login}
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              width: 28,
              height: 28,
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              marginRight: 10,
            }}
          />

          {/* Username + stats */}
          <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <span style={{
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#E6EDF3',
              lineHeight: '1.3',
              margin: 0,
              padding: 0,
            }}>
              @{user.login}
            </span>
            <span style={{
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 400,
              color: '#8B949E',
              lineHeight: '1.4',
              margin: 0,
              padding: 0,
            }}>
              {user.public_repos} repos · {user.followers.toLocaleString()} followers
            </span>
          </span>

          {/* Branding — float right via absolute positioning relative to card */}
          <span style={{
            display: 'inline-block',
            verticalAlign: 'bottom',
            float: 'right',
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: '10px',
            fontWeight: 400,
            color: 'rgba(139,148,158,0.4)',
            lineHeight: '1.4',
          }}>
            github-personality-analyzer
          </span>
        </div>
      </div>
    </motion.div>
  )
}
