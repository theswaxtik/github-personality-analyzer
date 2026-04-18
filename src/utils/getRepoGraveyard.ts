import type { GitHubRepo, RepoGraveyardItem } from '../types/github'
import { pick, REPO_MOODS } from './textEngine'

const BADGE_COLORS = [
  '#F85149', '#F0883E', '#A371F7', '#9CA3AF', '#FBBF24',
  '#60A5FA', '#34D399', '#FB7185',
]

interface ClassifiedRepo {
  badge: string
  badgeColor: string
}

function classifyRepo(repo: GitHubRepo): ClassifiedRepo {
  const hasDesc   = !!repo.description
  const daysSince = (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24)
  const hasTopics = (repo.topics?.length ?? 0) > 0
  const stars     = repo.stargazers_count

  // Specific classification first
  if (!hasDesc && !hasTopics && daysSince > 365) {
    return { badge: 'README only project', badgeColor: '#F85149' }
  }
  if (daysSince > 730) {
    return { badge: pick(['Never touched again', 'Digital fossil', 'Abandoned with grace', 'Preserved in amber']), badgeColor: '#9CA3AF' }
  }
  if (daysSince > 365 && stars === 0) {
    return { badge: pick(['Started with motivation', 'Ran out of weekend', '"I\'ll finish this" energy']), badgeColor: '#F0883E' }
  }
  if (stars > 5 && daysSince > 365) {
    return { badge: pick(['Future billion-dollar idea', 'Unfinished classic', 'Stalled gem']), badgeColor: '#FBBF24' }
  }

  // Fall back to mood pool from textEngine
  const badge = pick(REPO_MOODS)
  const badgeColor = pick(BADGE_COLORS)
  return { badge, badgeColor }
}

export function getRepoGraveyard(repos: GitHubRepo[]): RepoGraveyardItem[] {
  const oneYearAgo = Date.now() - 1000 * 60 * 60 * 24 * 365

  return repos
    .filter(r => !r.fork && new Date(r.pushed_at).getTime() < oneYearAgo)
    .sort((a, b) => new Date(a.pushed_at).getTime() - new Date(b.pushed_at).getTime())
    .slice(0, 6)
    .map(repo => ({ repo, ...classifyRepo(repo) }))
}
