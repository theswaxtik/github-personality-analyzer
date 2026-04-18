import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ContributionGraph({ username }: { username: string }) {
  const [loaded, setLoaded] = useState(false)
  const src = `https://ghchart.rshah.org/2F81F7/${username}`

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="card p-5">
        <p className="text-xs font-medium mb-4" style={{ color: 'var(--muted)' }}>
          CONTRIBUTION ACTIVITY
        </p>
        {!loaded && (
          <div className="h-28 rounded-lg animate-pulse" style={{ background: 'var(--hover)' }} />
        )}
        <img
          src={src}
          alt="Contribution graph"
          className={`w-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}
          onLoad={() => setLoaded(true)}
        />
        <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>Past 12 months</p>
      </div>
    </motion.div>
  )
}
