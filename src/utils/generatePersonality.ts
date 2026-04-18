import type { GitHubUser, GitHubRepo, LanguageStat, PersonalityType } from '../types/github'
import { pick, chance, PERSONALITY_TITLES, type PersonalityEntry } from './textEngine'

const FRONTEND_LANGS  = new Set(['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'Svelte', 'Elm'])
const BACKEND_LANGS   = new Set(['Python', 'Java', 'Go', 'Rust', 'PHP', 'Ruby', 'C#', 'C++', 'C', 'Scala', 'Elixir', 'Haskell'])
const MOBILE_LANGS    = new Set(['Kotlin', 'Swift', 'Dart', 'Objective-C'])
const AI_LANGS        = new Set(['Python', 'Jupyter Notebook', 'R', 'Julia', 'MATLAB'])
const DEVOPS_LANGS    = new Set(['Shell', 'Dockerfile', 'HCL', 'Makefile', 'PowerShell', 'Nix'])

export function generatePersonality(
  user: GitHubUser,
  repos: GitHubRepo[],
  langStats: LanguageStat[]
): PersonalityType {
  const topLang   = langStats[0]?.language ?? ''
  const langSet   = new Set(langStats.map(l => l.language))
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)

  // Domain scores
  let frontendScore = 0, backendScore = 0, mobileScore = 0
  let aiScore = 0, devopsScore = 0

  for (const { language, count } of langStats) {
    if (FRONTEND_LANGS.has(language))  frontendScore  += count
    if (BACKEND_LANGS.has(language))   backendScore   += count
    if (MOBILE_LANGS.has(language))    mobileScore    += count
    if (AI_LANGS.has(language))        aiScore        += count
    if (DEVOPS_LANGS.has(language))    devopsScore    += count
  }

  const pool = PERSONALITY_TITLES

  // Mobile
  if (mobileScore > 0 && (MOBILE_LANGS.has(topLang) || langSet.has('Kotlin') || langSet.has('Swift') || langSet.has('Dart'))) {
    if (langSet.has('Dart') || topLang === 'Dart') {
      const flutterPool: PersonalityEntry[] = pool.mobile.filter(p => p.title.includes('Flutter'))
      return pick(flutterPool.length > 0 ? flutterPool : pool.mobile)
    }
    return pick(pool.mobile)
  }

  // AI/ML
  if (aiScore > 2 && (topLang === 'Python' || langSet.has('Jupyter Notebook'))) {
    return pick(pool.ai)
  }

  // DevOps
  if (devopsScore > 0 && (langSet.has('Shell') || langSet.has('Dockerfile') || langSet.has('HCL'))) {
    return pick(pool.devops)
  }

  // Next.js / full stack signals
  const hasNextish = repos.some(r =>
    r.name.toLowerCase().includes('next') ||
    r.topics?.some(t => t.includes('nextjs') || t.includes('next-js'))
  )
  if (hasNextish && frontendScore > 0 && backendScore > 0) {
    return pick(pool.fullstack)
  }

  // Full stack
  if (frontendScore > 0 && backendScore > 0 && repos.length > 20) {
    return pick(pool.fullstack)
  }

  // Frontend dominant
  if (frontendScore > backendScore && FRONTEND_LANGS.has(topLang)) {
    // Occasional rare variant
    if (chance(0.15)) return pick(pool.misc)
    return pick(pool.frontend)
  }

  // Open source heavy
  if (totalStars > 200 || user.followers > 100) {
    if (chance(0.3)) return pick(pool.fullstack)
    const osPool: PersonalityEntry[] = pool.misc.filter(p =>
      p.title.includes('Open Source') || p.title.includes('Goblin') || p.title.includes('Hacker')
    )
    return pick(osPool.length > 0 ? osPool : pool.misc)
  }

  // Polyglot / explorer
  if (langStats.length > 6) {
    return pick([...pool.misc, ...pool.fullstack])
  }

  // Backend dominant
  if (backendScore > frontendScore) {
    return pick(pool.backend)
  }

  // High repo count + misc
  if (repos.length > 50) {
    return pick(pool.misc)
  }

  // Default: misc with some frontend chance
  return pick([...pool.misc, ...pool.frontend, ...pool.backend])
}
