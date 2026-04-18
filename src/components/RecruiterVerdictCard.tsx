import { motion } from 'framer-motion'
import type { RecruiterVerdict } from '../types/github'

interface Props { verdict: RecruiterVerdict }

const TONE_MAP = {
  positive: { badgeClass: 'badge-green',  borderColor: 'rgba(63,185,80,0.2)',  bg: 'rgba(63,185,80,0.05)' },
  neutral:  { badgeClass: 'badge-blue',   borderColor: 'rgba(47,129,247,0.2)', bg: 'rgba(47,129,247,0.05)' },
  chaotic:  { badgeClass: 'badge-orange', borderColor: 'rgba(240,136,62,0.2)', bg: 'rgba(240,136,62,0.05)' },
}

export default function RecruiterVerdictCard({ verdict }: Props) {
  const s = TONE_MAP[verdict.tone]
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
      <div className="card p-5" style={{ background: s.bg, borderColor: s.borderColor }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Recruiter Verdict</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              "{verdict.verdict}"
            </p>
          </div>
          <span className={`badge ${s.badgeClass} flex-shrink-0`}>{verdict.badge}</span>
        </div>
      </div>
    </motion.div>
  )
}
