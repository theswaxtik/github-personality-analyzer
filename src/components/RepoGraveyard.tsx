import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { RepoGraveyardItem } from '../types/github'
import { timeAgo } from '../utils/formatDate'

interface Props { items: RepoGraveyardItem[] }

export default function RepoGraveyard({ items }: Props) {
  if (items.length === 0) return null
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="card p-5">
        <div className="mb-4">
          <p className="section-label mb-0.5">Repo Graveyard 🪦</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>repos that never made it</p>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.a
              key={item.repo.id}
              href={item.repo.html_url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-interactive flex items-center justify-between gap-3 px-4 py-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-base flex-shrink-0">🪦</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--blue)' }}>{item.repo.name}</p>
                  {item.repo.description && (
                    <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{item.repo.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className="hidden sm:inline badge"
                  style={{
                    background: `${item.badgeColor}12`,
                    color: item.badgeColor,
                    border: `1px solid ${item.badgeColor}25`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.badge}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{timeAgo(item.repo.pushed_at)}</span>
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--muted)' }} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
