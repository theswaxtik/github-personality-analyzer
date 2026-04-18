import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { starRepo, unstarRepo, checkStarred, isAuthenticated } from '../services/githubApi'

interface Props { owner: string; repo: string; currentStars: number }

type StarState = 'idle' | 'loading' | 'starred' | 'unstarring'

// Split into two components so hooks are never called conditionally
function StarLink({ owner, repo, stars }: { owner: string; repo: string; stars: number }) {
  return (
    <a
      href={`https://github.com/${owner}/${repo}`}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1 text-xs transition-colors"
      style={{ color: 'var(--muted)' }}
      onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)')}
      onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)')}
    >
      <Star size={11} />
      <span className="font-mono">{stars.toLocaleString()}</span>
    </a>
  )
}

function StarButtonAuth({ owner, repo, currentStars }: Props) {
  const [state, setState] = useState<StarState>('idle')
  const [stars, setStars] = useState(currentStars)
  const [tip, setTip] = useState('')

  useEffect(() => {
    let cancelled = false
    checkStarred(owner, repo).then(ok => {
      if (!cancelled) setState(ok ? 'starred' : 'idle')
    })
    return () => { cancelled = true }
  }, [owner, repo])

  const toggle = async () => {
    if (state === 'loading' || state === 'unstarring') return
    if (state === 'starred') {
      setState('unstarring')
      try { await unstarRepo(owner, repo); setStars(s => Math.max(0, s - 1)); setState('idle'); setTip('Unstarred') }
      catch { setState('starred'); setTip('Failed') }
    } else {
      setState('loading')
      try { await starRepo(owner, repo); setStars(s => s + 1); setState('starred'); setTip('Starred ⭐') }
      catch { setState('idle'); setTip('Failed') }
    }
    setTimeout(() => setTip(''), 2000)
  }

  const starred = state === 'starred'
  const busy = state === 'loading' || state === 'unstarring'

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={toggle}
        disabled={busy}
        className="flex items-center gap-1 text-xs transition-colors disabled:opacity-50"
        style={{ color: starred ? 'var(--orange)' : 'var(--muted)' }}
        onMouseEnter={e => { if (!busy) (e.currentTarget as HTMLButtonElement).style.color = starred ? 'var(--orange)' : 'var(--text)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = starred ? 'var(--orange)' : 'var(--muted)' }}
      >
        <motion.div
          animate={busy ? { rotate: 360 } : { rotate: 0 }}
          transition={busy ? { repeat: Infinity, duration: 0.7, ease: 'linear' } : {}}
        >
          <Star size={11} fill={starred ? 'var(--orange)' : 'none'} />
        </motion.div>
        <span className="font-mono">{stars.toLocaleString()}</span>
      </button>
      <AnimatePresence>
        {tip && (
          <motion.span
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded text-xs whitespace-nowrap pointer-events-none font-mono"
            style={{ background: 'var(--hover)', border: '1px solid var(--border)', color: 'var(--text)', zIndex: 10 }}
          >
            {tip}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function StarButton(props: Props) {
  if (!isAuthenticated()) {
    return <StarLink owner={props.owner} repo={props.repo} stars={props.currentStars} />
  }
  return <StarButtonAuth {...props} />
}
