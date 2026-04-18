import type { GitHubUser, GitHubRepo, LanguageStat, AuraScore } from '../types/github'
import { pick, chance, AURA_LABELS_BY_TIER } from './textEngine'

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

// Additional description fragments for dynamic construction
const DESC_MIDDLES = [
  'Ships when ready, which is usually late at night.',
  'The commit history tells a story. It\'s complicated.',
  'Consistency is relative. Productivity is vibes.',
  'Has a unique relationship with deployment.',
  'The side projects are load-bearing.',
  'Documentation is spiritual, not practical.',
  'The README is longer than the codebase. Respectfully.',
  'Every repo is the one that will change things.',
  'Builds quietly. Deploys loudly.',
  'The kind of developer the ecosystem needs.',
  'Node_modules folder weight: immeasurable.',
  'Time to first commit: suspiciously fast.',
  'Localhost is always running something.',
  'Dark mode. Always dark mode.',
  'The Notion board is full. The repos are fuller.',
]

const DESC_ENDINGS_AURA = [
  'Godspeed.',
  'The algorithm respects it.',
  'No notes.',
  'Carry on.',
  'The stack knows.',
  'Touch grass occasionally.',
  'Keep shipping.',
  'The terminal sends its regards.',
  'git log --oneline reads like poetry.',
  'npm run everything.',
]

function buildDynamicDescription(baseDesc: string): string {
  if (chance(0.4)) {
    return `${baseDesc} ${pick(DESC_MIDDLES)}`
  }
  if (chance(0.3)) {
    return `${baseDesc} ${pick(DESC_ENDINGS_AURA)}`
  }
  return baseDesc
}

export function calculateAuraScore(
  user: GitHubUser,
  repos: GitHubRepo[],
  langStats: LanguageStat[]
): AuraScore {
  const repoScore   = clamp(Math.log10(user.public_repos + 1) * 22, 0, 25)
  const followScore = clamp(Math.log10(user.followers + 1) * 15, 0, 20)
  const starScore   = clamp(Math.log10(repos.reduce((s, r) => s + r.stargazers_count, 0) + 1) * 18, 0, 25)
  const langScore   = clamp(langStats.length * 4, 0, 20)

  const sixMonthsAgo = Date.now() - 1000 * 60 * 60 * 24 * 180
  const activeRepos  = repos.filter(r => new Date(r.pushed_at).getTime() > sixMonthsAgo).length
  const activeScore  = clamp((activeRepos / Math.max(repos.length, 1)) * 10, 0, 10)

  const raw   = repoScore + followScore + starScore + langScore + activeScore
  const score = clamp(Math.round(raw), 1, 99)

  // Select tier
  let tier: string
  if (score >= 90) tier = 'legendary'
  else if (score >= 65) tier = 'high'
  else if (score >= 35) tier = 'mid'
  else tier = 'low'

  // Occasionally cross tiers for variety (rare upgrade/downgrade)
  if (chance(0.08) && tier !== 'legendary') {
    const tiers = ['low', 'mid', 'high', 'legendary']
    const idx = tiers.indexOf(tier)
    tier = tiers[Math.min(idx + 1, tiers.length - 1)]
  }

  const pool = AURA_LABELS_BY_TIER[tier]
  const { label, description } = pick(pool)

  return {
    score,
    label,
    description: buildDynamicDescription(description),
  }
}
