import React, { useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { motion } from 'framer-motion'
import type {
  GitHubUser, GitHubRepo, LanguageStat,
  PersonalityType, AuraScore, RelationshipStatus,
} from '../types/github'
import { exportCardAsPng, CARD_BASE_STYLE, badgeStyle, txt } from '../utils/exportCard'
import { generateRoast } from '../utils/roastGenerator'

interface Props {
  user: GitHubUser
  repos: GitHubRepo[]
  langStats: LanguageStat[]
  personality: PersonalityType
  aura: AuraScore
  relationships: RelationshipStatus[]
}

const LANG_COLORS: Record<string, string> = {
  JavaScript: '#F1E05A', TypeScript: '#3178C6', Python: '#3572A5',
  Kotlin: '#A97BFF', Swift: '#F05138', Rust: '#DEA584', Go: '#00ADD8',
  Java: '#B07219', 'C++': '#F34B7D', C: '#555555', Ruby: '#701516',
  PHP: '#4F5D95', Dart: '#00B4AB', HTML: '#E34C26', CSS: '#563D7C',
  Shell: '#89E051', Vue: '#41B883',
}

// All text primitives: display:block, explicit font/size/weight/lineHeight
// This is what html2canvas actually reads — no class resolution needed.

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600,
      color: '#8B949E', letterSpacing: '0.07em', textTransform: 'uppercase' as const,
      lineHeight: '1.4', marginBottom: 7, display: 'block', padding: 0,
    }}>
      {children}
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 4, overflow: 'hidden' }}>
      <span style={{
        display: 'inline-block', fontFamily: 'Inter, sans-serif',
        fontSize: '11px', fontWeight: 400, color: '#8B949E', lineHeight: '1.4',
      }}>
        {label}
      </span>
      <span style={{
        display: 'inline-block', float: 'right',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: '11px', fontWeight: 600, color: '#E6EDF3', lineHeight: '1.4',
      }}>
        {value}
      </span>
    </div>
  )
}

function LangDot({ language, color }: { language: string; color: string }) {
  return (
    <span style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      padding: '3px 9px 3px 7px',
      borderRadius: 20,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      whiteSpace: 'nowrap' as const,
      marginRight: 5,
      marginBottom: 4,
      lineHeight: '18px',
      boxSizing: 'border-box' as const,
    }}>
      <span style={{
        display: 'inline-block',
        width: 7, height: 7,
        borderRadius: '50%',
        background: color,
        verticalAlign: 'middle',
        marginRight: 5,
        marginTop: -1,
        flexShrink: 0,
      }} />
      <span style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: '10px',
        fontWeight: 500,
        color: '#E6EDF3',
        lineHeight: '18px',
      }}>
        {language}
      </span>
    </span>
  )
}

export default function FullProfileShareCard({
  user, repos, langStats, personality, aura, relationships,
}: Props) {
  const cardRef    = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const roast      = generateRoast({ user, repos, langStats })
  const topLangs   = langStats.slice(0, 3)
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)

  const handleExport = async () => {
    setExporting(true)
    await exportCardAsPng(cardRef as React.RefObject<HTMLElement>, `${user.login}-profile`)
    setExporting(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-3">
        <p className="section-label">Full Profile Card</p>
        <button onClick={handleExport} disabled={exporting} className="btn-secondary text-xs gap-1.5">
          <Download size={11} />{exporting ? 'Exporting…' : 'Download PNG'}
        </button>
      </div>

      {/* ── Captured card ── */}
      <div ref={cardRef} style={{ ...CARD_BASE_STYLE }}>

        {/* TOP SECTION: two-column layout using inline-block columns */}
        <div style={{ overflow: 'hidden', marginBottom: 20 }}>

          {/* LEFT column */}
          <div style={{
            display: 'inline-block',
            verticalAlign: 'top',
            width: 155,
            paddingRight: 20,
            boxSizing: 'border-box',
          }}>
            <img
              src={user.avatar_url}
              alt={user.login}
              style={{
                display: 'block',
                width: 56, height: 56,
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: 10,
              }}
            />
            <div style={{ ...txt(14, 700, '#E6EDF3'), marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name ?? user.login}
            </div>
            <div style={{ ...txt(11, 400, '#8B949E', { mono: true }), marginBottom: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              @{user.login}
            </div>
            <StatRow label="Followers" value={user.followers.toLocaleString()} />
            <StatRow label="Repos"     value={user.public_repos.toLocaleString()} />
            <StatRow label="Stars"     value={totalStars.toLocaleString()} />
          </div>

          {/* Vertical rule */}
          <div style={{
            display: 'inline-block',
            verticalAlign: 'top',
            width: 1,
            background: 'rgba(255,255,255,0.08)',
            alignSelf: 'stretch',
            // Stretch hack: use a very tall min-height; overflow:hidden on parent clips it
            minHeight: 300,
            marginRight: 0,
          }} />

          {/* RIGHT column */}
          <div style={{
            display: 'inline-block',
            verticalAlign: 'top',
            paddingLeft: 20,
            // Width = 100% minus left col minus divider
            width: 'calc(100% - 156px)',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}>

            {/* Personality */}
            <div style={{ marginBottom: 14 }}>
              <SectionLabel>Personality</SectionLabel>
              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                <span style={{ display: 'inline-block', verticalAlign: 'top', fontSize: '18px', lineHeight: '1.2', marginRight: 7 }}>
                  {personality.emoji}
                </span>
                <span style={{ display: 'inline-block', verticalAlign: 'top', overflow: 'hidden', maxWidth: 'calc(100% - 28px)' }}>
                  <span style={{ ...txt(13, 600, '#E6EDF3'), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                    {personality.title}
                  </span>
                  <span style={{ ...txt(10, 400, '#8B949E', { lineHeight: 1.5 }), whiteSpace: 'normal', overflow: 'hidden', display: 'block' }}>
                    {personality.description.length > 80
                      ? personality.description.slice(0, 80) + '…'
                      : personality.description}
                  </span>
                </span>
              </div>
            </div>

            {/* Aura */}
            <div style={{ marginBottom: 14 }}>
              <SectionLabel>Aura</SectionLabel>
              <div style={{ whiteSpace: 'nowrap' }}>
                <span style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#A371F7',
                  lineHeight: '1',
                  marginRight: 10,
                }}>
                  {aura.score}
                </span>
                <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                  <span style={badgeStyle('#A371F7')}>{aura.label}</span>
                </span>
              </div>
            </div>

            {/* Languages */}
            <div style={{ marginBottom: 14 }}>
              <SectionLabel>Top Languages</SectionLabel>
              <div>
                {topLangs.map(l => (
                  <LangDot
                    key={l.language}
                    language={l.language}
                    color={LANG_COLORS[l.language] ?? '#8B949E'}
                  />
                ))}
              </div>
            </div>

            {/* Relationship */}
            {relationships[0] && (
              <div>
                <SectionLabel>Relationship</SectionLabel>
                <div style={{ ...txt(11, 400, '#E6EDF3', { lineHeight: 1.5 }), overflow: 'hidden' }}>
                  {relationships[0].emoji} {relationships[0].status} with {relationships[0].language}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: 16 }} />

        {/* Roast */}
        <div style={{ marginBottom: 16 }}>
          <SectionLabel>🔥 Roast</SectionLabel>
          <div style={{
            ...txt(12, 400, '#8B949E', { lineHeight: 1.6 }),
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}>
            "{roast}"
          </div>
        </div>

        {/* Stat bars */}
        <div style={{ overflow: 'hidden', marginBottom: 16 }}>
          {[
            { label: 'Followers',   value: user.followers,    max: Math.max(user.followers, 500),  color: '#2F81F7' },
            { label: 'Total Stars', value: totalStars,         max: Math.max(totalStars, 200),       color: '#F0883E' },
            { label: 'Repos',       value: user.public_repos,  max: Math.max(user.public_repos, 30), color: '#3FB950' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                display: 'inline-block',
                verticalAlign: 'top',
                width: 'calc(33.333% - 8px)',
                marginRight: i < 2 ? 12 : 0,
                boxSizing: 'border-box',
              }}
            >
              {/* Label + value on same line */}
              <div style={{ overflow: 'hidden', marginBottom: 4 }}>
                <span style={{ display: 'inline-block', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 400, color: '#8B949E', lineHeight: '1.4' }}>
                  {stat.label}
                </span>
                <span style={{ display: 'inline-block', float: 'right', fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: '10px', fontWeight: 500, color: stat.color, lineHeight: '1.4' }}>
                  {stat.value.toLocaleString()}
                </span>
              </div>
              {/* Bar */}
              <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (stat.value / stat.max) * 100)}%`,
                  background: stat.color,
                  borderRadius: 99,
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Branding */}
        <div style={{ overflow: 'hidden' }}>
          <span style={{
            display: 'inline-block', float: 'right',
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: '10px', fontWeight: 400,
            color: 'rgba(139,148,158,0.35)',
            lineHeight: '1.4',
          }}>
            github-personality-analyzer
          </span>
        </div>
      </div>
    </motion.div>
  )
}
