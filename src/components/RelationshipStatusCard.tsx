import { motion } from 'framer-motion'
import { Heart, Download } from 'lucide-react'
import React, { useRef, useState } from 'react'
import type { RelationshipStatus } from '../types/github'
import { exportCardAsPng } from '../utils/exportCard'

interface Props { relationships: RelationshipStatus[] }

export default function RelationshipStatusCard({ relationships }: Props) {
  const [exporting, setExporting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleExport = async () => {
    setExporting(true)
    await exportCardAsPng(ref as React.RefObject<HTMLElement>, 'relationship-status')
    setExporting(false)
  }

  if (relationships.length === 0) return null

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart size={13} style={{ color: 'var(--red)' }} />
            <span className="section-label">Relationship Status</span>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn-ghost text-xs gap-1.5"
          >
            <Download size={11} />
            {exporting ? 'Exporting…' : 'Export'}
          </button>
        </div>

        <div ref={ref} className="flex flex-wrap gap-2">
          {relationships.map((rel, i) => (
            <motion.div
              key={rel.language}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'var(--hover)', border: '1px solid var(--border)' }}
            >
              <span>{rel.emoji}</span>
              <div>
                <p className="text-xs font-semibold font-mono leading-tight" style={{ color: 'var(--text)' }}>
                  {rel.language}
                </p>
                <p className="text-xs leading-tight" style={{ color: 'var(--muted)' }}>
                  {rel.status}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
