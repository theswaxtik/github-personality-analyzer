import type { GitHubUser, GitHubRepo, LanguageStat, DevStatsCard } from '../types/github'

function clamp(v: number, min = 5, max = 95) {
  return Math.max(min, Math.min(max, Math.round(v)))
}

export function calculateDevStats(
  user: GitHubUser,
  repos: GitHubRepo[],
  langStats: LanguageStat[]
): DevStatsCard {
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0)

  // Focus: fewer languages = more focused
  const Focus = clamp(100 - langStats.length * 8)

  // Chaos: many repos + many languages + low stars = chaos
  const Chaos = clamp((langStats.length * 7) + (repos.length > 30 ? 20 : 0) - (totalStars > 100 ? 15 : 0))

  // Consistency: recent pushes as share of total repos
  const sixMonthsAgo = Date.now() - 1000 * 60 * 60 * 24 * 180
  const recentPushes = repos.filter(r => new Date(r.pushed_at).getTime() > sixMonthsAgo).length
  const Consistency = clamp((recentPushes / Math.max(repos.length, 1)) * 100)

  // Creativity: variety of topics and languages
  const topics = repos.flatMap(r => r.topics ?? [])
  const uniqueTopics = new Set(topics).size
  const Creativity = clamp(langStats.length * 6 + uniqueTopics * 3)

  // Bug Resistance: stars + forks relative to repo count
  const BugResistance = clamp(
    ((totalStars + totalForks * 2) / Math.max(repos.length, 1)) * 4 + 30
  )

  // Sleep Deprivation: proxy — high repo count + many languages + low follower ratio
  const SleepDeprivation = clamp(
    repos.length * 1.2 + langStats.length * 3 - user.followers * 0.5
  )

  return {
    Focus,
    Chaos,
    Consistency,
    Creativity,
    'Bug Resistance': BugResistance,
    'Sleep Deprivation': SleepDeprivation,
  }
}
