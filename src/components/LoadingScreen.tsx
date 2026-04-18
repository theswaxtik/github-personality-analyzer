import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  'Connecting to GitHub API…',
  'Fetching repository data…',
  'Measuring caffeine dependency…',
  'Scanning for unfinished side projects…',
  'Estimating sleep deprivation level…',
  'Analyzing commit message quality…',
  'Checking bug tolerance threshold…',
  'Calculating developer aura…',
  'Profiling personality matrix…',
  'Generating roast material…',
  'Compiling GitHub lore…',
  'Almost there…',
]

export default function LoadingScreen({ username }: { username: string }) {
  const [visible, setVisible] = useState<string[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      if (i < STEPS.length) {
        setVisible(p => [...p, STEPS[i]])
        setProgress(Math.round(((i + 1) / STEPS.length) * 95))
        i++
      } else {
        clearInterval(id)
      }
    }, 260)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-8">
      <div className="card overflow-hidden">
        {/* Terminal bar */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}
        >
          <span className="w-3 h-3 rounded-full" style={{ background: 'var(--red)' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: 'var(--orange)' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: 'var(--green)' }} />
          <span className="ml-2 text-xs font-mono" style={{ color: 'var(--muted)' }}>
            gpa — analyzing @{username}
          </span>
        </div>

        {/* Log output */}
        <div className="p-5 min-h-52 max-h-72 overflow-hidden font-mono text-xs space-y-1.5">
          <AnimatePresence>
            {visible.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.12 }}
                className="flex items-start gap-2"
              >
                <span style={{ color: i === visible.length - 1 ? 'var(--blue)' : 'var(--green)', flexShrink: 0 }}>
                  {i === visible.length - 1 ? '▶' : '✓'}
                </span>
                <span style={{ color: i === visible.length - 1 ? 'var(--text)' : 'var(--muted)' }}>
                  {step}
                  {i === visible.length - 1 && (
                    <span
                      className="inline-block w-1.5 h-3 ml-1 align-middle animate-pulse"
                      style={{ background: 'var(--blue)' }}
                    />
                  )}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress */}
        <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <div className="flex justify-between mb-2">
            <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>PROGRESS</span>
            <span className="text-xs font-mono" style={{ color: 'var(--blue)' }}>{progress}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--hover)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--blue)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
