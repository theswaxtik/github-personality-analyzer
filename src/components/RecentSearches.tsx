import { Clock, X } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  searches: string[]
  onSelect: (username: string) => void
  onClear: () => void
}

export default function RecentSearches({ searches, onSelect, onClear }: Props) {
  if (searches.length === 0) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 flex-wrap justify-center"
    >
      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
        <Clock size={11} /> Recent
      </span>
      {searches.map(name => (
        <button
          key={name}
          onClick={() => onSelect(name)}
          className="text-xs px-2.5 py-1 rounded-md transition-colors"
          style={{
            background: 'var(--hover)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            fontFamily: 'JetBrains Mono, monospace',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
          }}
        >
          {name}
        </button>
      ))}
      <button onClick={onClear} className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
        <X size={10} /> Clear
      </button>
    </motion.div>
  )
}
