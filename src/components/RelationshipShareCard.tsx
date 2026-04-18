import React, { useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { motion } from 'framer-motion'
import type { GitHubUser, RelationshipStatus, AuraScore } from '../types/github'
import { exportCardAsPng, CARD_BASE_STYLE, badgeStyle } from '../utils/exportCard'

interface Props {
  user: GitHubUser
  relationships: RelationshipStatus[]
  aura: AuraScore
  topLang: string
}

// Inline-block stat: label on top, value below — no margin/margin conflict
function FooterStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <span style={{ display: 'inline-block', verticalAlign: 'top', marginRight: 28 }}>
      <span style={{
        display: 'block',
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        fontWeight: 400,
        color: '#8B949E',
        lineHeight: '1.4',
        paddingBottom: 3,
      }}>
        {label}
      </span>
      <span style={{
        display: 'block',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: '13px',
        fontWeight: 600,
        color,
        lineHeight: '1.4',
      }}>
        {value}
      </span>
    </span>
  )
}

export default function RelationshipShareCard({ user, relationships, aura, topLang }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const primary   = relationships[0]
  const secondary = relationships[1]

  const handleExport = async () => {
    setExporting(true)
    await exportCardAsPng(cardRef as React.RefObject<HTMLElement>, `${user.login}-relationship`)
    setExporting(false)
  }

  if (!primary) return null

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-3">
        <p className="section-label">Relationship Card</p>
        <button onClick={handleExport} disabled={exporting} className="btn-secondary text-xs gap-1.5">
          <Download size={11} />
          {exporting ? 'Exporting…' : 'Download PNG'}
        </button>
      </div>

      {/* ── Captured card — all text uses explicit inline styles ── */}
      <div ref={cardRef} style={{ ...CARD_BASE_STYLE, maxWidth: 520 }}>

        {/* Header: inline-block avatar + text */}
        <div style={{ marginBottom: 28, overflow: 'hidden' }}>
          <img
            src={user.avatar_url}
            alt={user.login}
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              width: 40, height: 40,
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              marginRight: 12,
            }}
          />
          <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <span style={{
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#E6EDF3',
              lineHeight: '1.3',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 360,
            }}>
              {user.name ?? user.login}
            </span>
            <span style={{
              display: 'block',
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: '12px',
              fontWeight: 400,
              color: '#8B949E',
              lineHeight: '1.4',
              paddingTop: 2,
            }}>
              @{user.login}
            </span>
          </span>
        </div>

        {/* Section label */}
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 600,
          color: '#8B949E',
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          lineHeight: '1.4',
          paddingBottom: 10,
          display: 'block',
        }}>
          Relationship Status
        </div>

        {/* Main relationship text */}
        <div style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '20px',
          fontWeight: 700,
          color: '#E6EDF3',
          lineHeight: '1.35',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          paddingBottom: 8,
        }}>
          {primary.emoji} {primary.status} with {primary.language}
        </div>

        {secondary && (
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 400,
            color: '#8B949E',
            lineHeight: '1.5',
            wordBreak: 'break-word',
            paddingBottom: 2,
          }}>
            Also: {secondary.emoji} {secondary.status} with {secondary.language}
          </div>
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 20, marginBottom: 18 }} />

        {/* Footer stats — all inline-block */}
        <div style={{ overflow: 'hidden' }}>
          <FooterStat label="Aura Score"   value={`${aura.score}/100`} color="#A371F7" />
          <FooterStat label="Top Language" value={topLang}              color="#2F81F7" />

          {/* Aura label badge */}
          <span style={{ display: 'inline-block', verticalAlign: 'top', marginRight: 28 }}>
            <span style={{
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 400,
              color: '#8B949E',
              lineHeight: '1.4',
              paddingBottom: 4,
            }}>
              Aura Label
            </span>
            <span style={badgeStyle('#A371F7')}>{aura.label}</span>
          </span>

          {/* Branding */}
          <span style={{
            display: 'inline-block',
            verticalAlign: 'bottom',
            float: 'right',
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: '10px',
            fontWeight: 400,
            color: 'rgba(139,148,158,0.4)',
            lineHeight: '1.4',
          }}>
            github-personality-analyzer
          </span>
        </div>
      </div>
    </motion.div>
  )
}
