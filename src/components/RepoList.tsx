import { useState } from 'react'
import { motion } from 'framer-motion'
import type { GitHubRepo, SortOrder } from '../types/github'
import RepoCard from './RepoCard'

interface Props { repos: GitHubRepo[] }

const PAGE = 6

export default function RepoList({ repos }: Props) {
  const [sort, setSort] = useState<SortOrder>('stars')
  const [showAll, setShowAll] = useState(false)

  const sorted = [...repos].sort((a, b) =>
    sort === 'stars'
      ? b.stargazers_count - a.stargazers_count
      : new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
  )
  const displayed = showAll ? sorted : sorted.slice(0, PAGE)

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-label mb-0.5">Repositories</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>{repos.length} public</p>
          </div>
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border)' }}
          >
            {(['stars', 'recent'] as SortOrder[]).map(opt => (
              <button
                key={opt}
                onClick={() => setSort(opt)}
                className="px-3 py-1.5 text-xs font-mono transition-colors"
                style={{
                  background: sort === opt ? 'var(--hover)' : 'transparent',
                  color: sort === opt ? 'var(--text)' : 'var(--muted)',
                }}
              >
                {opt === 'stars' ? '★ Stars' : '⏱ Recent'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayed.map((repo, i) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
            >
              <RepoCard repo={repo} />
            </motion.div>
          ))}
        </div>

        {repos.length > PAGE && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn-secondary w-full mt-3 justify-center text-xs"
          >
            {showAll ? 'Show less' : `Show all ${repos.length} repos`}
          </button>
        )}
      </div>
    </motion.div>
  )
}
