import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface Props { message: string; onRetry: () => void }

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-8 flex flex-col items-center gap-4 text-center"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.2)' }}
      >
        <AlertTriangle size={18} style={{ color: 'var(--red)' }} />
      </div>
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Request failed</p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>{message}</p>
      </div>
      <button onClick={onRetry} className="btn-secondary text-xs">Try again</button>
    </motion.div>
  )
}
