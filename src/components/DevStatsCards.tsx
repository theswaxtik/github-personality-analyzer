import { motion } from 'framer-motion'
import type { DevStatsCard } from '../types/github'

interface Props { stats: DevStatsCard }

const META: Record<keyof DevStatsCard, { emoji: string; color: string }> = {
  Focus:               { emoji: '🎯', color: 'var(--blue)' },
  Chaos:               { emoji: '🌪️', color: 'var(--red)' },
  Consistency:         { emoji: '📅', color: 'var(--green)' },
  Creativity:          { emoji: '🎨', color: 'var(--purple)' },
  'Bug Resistance':    { emoji: '🛡️', color: 'var(--orange)' },
  'Sleep Deprivation': { emoji: '😴', color: 'var(--muted)' },
}

export default function DevStatsCards({ stats }: Props) {
  const entries = Object.entries(stats) as [keyof DevStatsCard, number][]
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="card p-5">
        <p className="section-label mb-4">Developer Stats</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {entries.map(([stat, value], i) => {
            const { emoji, color } = META[stat]
            return (
              <motion.div
                key={stat}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg p-3"
                style={{ background: 'var(--hover)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{emoji}</span>
                  <span className="text-sm font-bold font-mono" style={{ color }}>{value}</span>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>{stat}</p>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
