import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { GitHubUser, GitHubRepo } from '../types/github'
import { fetchUser, fetchRepos } from '../services/githubApi'
import { calculateLanguageStats } from '../utils/calculateLanguageStats'
import { generatePersonality } from '../utils/generatePersonality'
import { calculateSkills } from '../utils/calculateSkills'
import { calculateAuraScore } from '../utils/calculateAura'
import { calculateDevStats } from '../utils/calculateDevStats'
import { generateRelationshipStatuses } from '../utils/generateRelationshipStatus'
import { generateRecruiterVerdict } from '../utils/generateRecruiterVerdict'
import { getRepoGraveyard } from '../utils/getRepoGraveyard'

import SearchBar from '../components/SearchBar'
import RecentSearches from '../components/RecentSearches'
import ProfileCard from '../components/ProfileCard'
import ContributionGraph from '../components/ContributionGraph'
import LanguageChart from '../components/LanguageChart'
import SkillChart from '../components/SkillChart'
import PersonalityCard from '../components/PersonalityCard'
import RoastCard from '../components/RoastCard'
import RepoList from '../components/RepoList'
import LoadingScreen from '../components/LoadingScreen'
import ErrorState from '../components/ErrorState'
import AuraScoreCard from '../components/AuraScoreCard'
import RecruiterVerdictCard from '../components/RecruiterVerdictCard'
import RepoGraveyard from '../components/RepoGraveyard'
import DevStatsCards from '../components/DevStatsCards'
import RelationshipStatusCard from '../components/RelationshipStatusCard'
import LoreCard from '../components/LoreCard'
import RelationshipShareCard from '../components/RelationshipShareCard'
import RoastShareCard from '../components/RoastShareCard'
import FullProfileShareCard from '../components/FullProfileShareCard'

// ── Storage helpers ───────────────────────────────────────────────────────────
const HISTORY_KEY = 'gpa_recent_searches'
const MAX_HISTORY = 5

function loadHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]') }
  catch { return [] }
}
function saveHistory(username: string, prev: string[]): string[] {
  const updated = [username, ...prev.filter(u => u !== username)].slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  return updated
}

// ── Types ─────────────────────────────────────────────────────────────────────
type Status = 'idle' | 'loading' | 'success' | 'error'
interface Result { user: GitHubUser; repos: GitHubRepo[]; username: string }

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const [loadingUsername, setLoadingUsername] = useState('')
  const [history, setHistory] = useState<string[]>(loadHistory)

  const analyze = useCallback(async (username: string) => {
    setStatus('loading')
    setLoadingUsername(username)
    setError('')
    setResult(null)
    try {
      const [user, repos] = await Promise.all([fetchUser(username), fetchRepos(username)])
      setResult({ user, repos, username })
      setHistory(prev => saveHistory(username, prev))
      setStatus('success')
    } catch (err: unknown) {
      const ax = err as { response?: { status: number } }
      if (ax?.response?.status === 404) setError(`"${username}" not found on GitHub.`)
      else if (ax?.response?.status === 403) setError('Rate limit hit. Add VITE_GITHUB_TOKEN to .env for higher limits.')
      else setError('Request failed. Check your connection and try again.')
      setStatus('error')
    }
  }, [])

  const clearHistory = () => { localStorage.removeItem(HISTORY_KEY); setHistory([]) }
  const reset = () => { setStatus('idle'); setResult(null) }

  // Derived — only computed when result exists
  const langStats        = result ? calculateLanguageStats(result.repos) : []
  const personality      = result ? generatePersonality(result.user, result.repos, langStats) : null
  const skills           = result ? calculateSkills(result.repos, langStats) : null
  const aura             = result ? calculateAuraScore(result.user, result.repos, langStats) : null
  const devStats         = result ? calculateDevStats(result.user, result.repos, langStats) : null
  const relationships    = result ? generateRelationshipStatuses(langStats) : []
  const recruiterVerdict = result ? generateRecruiterVerdict(result.user, result.repos, langStats) : null
  const graveyard        = result ? getRepoGraveyard(result.repos) : []

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="var(--blue)" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="4" fill="var(--blue)" />
            </svg>
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              GitHub Personality Analyzer
            </span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost text-xs"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <header className="max-w-3xl mx-auto px-4 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-5"
            style={{ background: 'rgba(47,129,247,0.1)', border: '1px solid rgba(47,129,247,0.2)', color: 'var(--blue)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Analyze any GitHub profile instantly
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: 'var(--text)', lineHeight: 1.2 }}
          >
            What kind of developer
            <br />
            <span style={{ color: 'var(--blue)' }}>are you, really?</span>
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
            Enter any GitHub username for a full profile analysis — personality type,
            aura score, skill breakdown, roast, lore, and more.
          </p>
        </motion.div>

        <SearchBar onSearch={analyze} isLoading={status === 'loading'} />

        <div className="mt-4 flex justify-center">
          <RecentSearches searches={history} onSelect={analyze} onClear={clearHistory} />
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">

          {status === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingScreen username={loadingUsername} />
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ErrorState message={error} onRetry={reset} />
            </motion.div>
          )}

          {status === 'success' && result && personality && skills && aura && devStats && recruiterVerdict && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

              {/* Profile */}
              <ProfileCard user={result.user} />

              {/* Aura + Recruiter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AuraScoreCard aura={aura} />
                <RecruiterVerdictCard verdict={recruiterVerdict} />
              </div>

              {/* Contribution graph */}
              <ContributionGraph username={result.username} />

              {/* Personality */}
              <PersonalityCard personality={personality} />

              {/* Language + Skills */}
              {langStats.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LanguageChart langStats={langStats} />
                  <SkillChart skills={skills} />
                </div>
              )}

              {/* Dev stats */}
              <DevStatsCards stats={devStats} />

              {/* Relationship */}
              {relationships.length > 0 && (
                <RelationshipStatusCard relationships={relationships} />
              )}

              {/* Lore */}
              <LoreCard user={result.user} repos={result.repos} langStats={langStats} />

              {/* Roast */}
              <RoastCard user={result.user} repos={result.repos} langStats={langStats} />

              {/* Repos */}
              <RepoList repos={result.repos} />

              {/* Graveyard */}
              {graveyard.length > 0 && <RepoGraveyard items={graveyard} />}

              {/* ── Share & Export Section ────────────────────────────── */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <hr className="divider flex-1" />
                  <span className="section-label">Share & Export</span>
                  <hr className="divider flex-1" />
                </div>
                <div className="space-y-6">
                  <FullProfileShareCard
                    user={result.user}
                    repos={result.repos}
                    langStats={langStats}
                    personality={personality}
                    aura={aura}
                    relationships={relationships}
                  />
                  <RoastShareCard
                    user={result.user}
                    repos={result.repos}
                    langStats={langStats}
                  />
                  {relationships.length > 0 && (
                    <RelationshipShareCard
                      user={result.user}
                      relationships={relationships}
                      aura={aura}
                      topLang={langStats[0]?.language ?? '—'}
                    />
                  )}
                </div>
              </div>

              {/* Reset */}
              <div className="pt-2 text-center">
                <button onClick={reset} className="btn-secondary">
                  Analyze another profile
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div
          className="max-w-3xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ color: 'var(--muted)' }}
        >
          <span>GitHub Personality Analyzer · Open source project</span>
          <div className="flex items-center gap-4">
            <a href="https://docs.github.com/en/rest" target="_blank" rel="noreferrer"
              className="hover:underline" style={{ color: 'var(--muted)' }}>GitHub REST API</a>
            <a href="https://vercel.com" target="_blank" rel="noreferrer"
              className="hover:underline" style={{ color: 'var(--muted)' }}>Deploy on Vercel</a>
          </div>
        </div>
      </footer>

    </div>
  )
}

