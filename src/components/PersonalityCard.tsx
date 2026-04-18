import { motion } from 'framer-motion'
import type { PersonalityType } from '../types/github'

interface Props { personality: PersonalityType }

export default function PersonalityCard({ personality }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
      <div className="card p-6">
        <p className="section-label mb-4">Developer Personality</p>

        <div className="flex items-start gap-4 mb-5">
          <span className="text-3xl flex-shrink-0">{personality.emoji}</span>
          <div>
            <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>
              {personality.title}
            </h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{personality.description}</p>
          </div>
        </div>

        <hr className="divider mb-5" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--green)' }}>Strengths</p>
            <ul className="space-y-1">
              {personality.strengths.map(s => (
                <li key={s} className="text-xs" style={{ color: 'var(--muted)' }}>· {s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--red)' }}>Watch out for</p>
            <ul className="space-y-1">
              {personality.weaknesses.map(w => (
                <li key={w} className="text-xs" style={{ color: 'var(--muted)' }}>· {w}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--purple)' }}>Career Path</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>{personality.careerPath}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
