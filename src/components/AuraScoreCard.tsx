import { motion } from 'framer-motion'
import type { AuraScore } from '../types/github'

interface Props { aura: AuraScore }

export default function AuraScoreCard({ aura }: Props) {
  const color =
    aura.score >= 75 ? 'var(--orange)' :
    aura.score >= 50 ? 'var(--purple)' :
    'var(--blue)'

  const c = 2 * Math.PI * 36
  const offset = c - (aura.score / 100) * c

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
      <div className="card p-5 flex flex-col sm:flex-row items-center gap-5">
        {/* Ring */}
        <div className="relative flex-shrink-0 w-20 h-20">
          <svg viewBox="0 0 84 84" className="-rotate-90 w-full h-full">
            <circle cx="42" cy="42" r="36" fill="none" stroke="var(--hover)" strokeWidth="5" />
            <motion.circle
              cx="42" cy="42" r="36"
              fill="none"
              stroke={color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-xl font-bold"
              style={{ color, lineHeight: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {aura.score}
            </motion.span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>/100</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Developer Aura</span>
            <span className="badge badge-purple">{aura.label}</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{aura.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

