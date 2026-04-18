import { useState, type KeyboardEvent } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface SearchBarProps {
  onSearch: (username: string) => void
  isLoading: boolean
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [value, setValue] = useState('')

  const submit = () => {
    const t = value.trim()
    if (t && !isLoading) onSearch(t)
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="w-full max-w-xl mx-auto"
    >
      <div
        className="flex items-center rounded-xl overflow-hidden"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3 flex-1 px-4 py-3">
          <Search size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search GitHub username…"
            disabled={isLoading}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text)', fontFamily: 'Inter, sans-serif' }}
          />
          {value && !isLoading && (
            <button
              onClick={() => setValue('')}
              className="text-xs"
              style={{ color: 'var(--muted)' }}
            >
              ✕
            </button>
          )}
        </div>
        <div className="pr-2 py-2">
          <button
            onClick={submit}
            disabled={!value.trim() || isLoading}
            className="btn-primary"
          >
            {isLoading ? (
              <><Loader2 size={13} className="animate-spin" /> Analyzing</>
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
