import type { GitHubUser, GitHubRepo, LanguageStat } from '../types/github'
import {
  pick, pickWeighted, chance,
  INTROS, LANG_JOKES, HABITS, ENDINGS, SIDE_PROJECT_ENERGY,
  LEGENDARY_LINES, ULTRA_RARE_LINES,
} from './textEngine'

interface RoastContext {
  user: GitHubUser
  repos: GitHubRepo[]
  langStats: LanguageStat[]
}

function repoFacts(user: GitHubUser, repos: GitHubRepo[], langStats: LanguageStat[]): string[] {
  const topLang = langStats[0]?.language ?? 'mystery language'
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)
  const noDesc = repos.filter(r => !r.description).length
  const forked = repos.filter(r => r.fork).length
  const accountAge = new Date().getFullYear() - new Date(user.created_at).getFullYear()
  const sixMoAgo = Date.now() - 1000 * 60 * 60 * 24 * 180
  const stale = repos.filter(r => new Date(r.pushed_at).getTime() < sixMoAgo).length
  const hasBio = !!user.bio
  const bioSnip = user.bio ? user.bio.slice(0, 55) + (user.bio.length > 55 ? '…' : '') : ''

  return [
    `${user.public_repos} repos and ${totalStars} total stars — the ratio tells a story`,
    `been on GitHub ${accountAge} year${accountAge !== 1 ? 's' : ''} and still going`,
    `${noDesc} repos with no description — letting the silence speak`,
    `${forked} forks in the mix — a collector of starting points`,
    `follower/following ratio: ${user.followers}/${user.following} — the math is interesting`,
    `${stale} repos that haven't been touched in 6 months — an archive in progress`,
    `top language is ${topLang} — committed to the bit`,
    `${langStats.length} language${langStats.length !== 1 ? 's' : ''} across ${user.public_repos} repos — range or chaos?`,
    hasBio ? `bio says "${bioSnip}" — the personal brand is a work in progress` : `no GitHub bio — mysterious energy, possibly intentional`,
    `joined in ${new Date(user.created_at).getFullYear()} — ${accountAge} year${accountAge !== 1 ? 's' : ''} of commit history`,
    `${user.followers} follower${user.followers !== 1 ? 's' : ''} — the audience is forming`,
    `${user.public_repos} public repos and who knows how many private ones — the iceberg theory`,
  ]
}

function contextRoasts(user: GitHubUser, repos: GitHubRepo[], langStats: LanguageStat[]): string[] {
  const topLang = langStats[0]?.language ?? 'unknown'
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)
  const noDesc = repos.filter(r => !r.description).length
  const accountAge = new Date().getFullYear() - new Date(user.created_at).getFullYear()
  const stale = repos.filter(r => !r.fork && new Date(r.pushed_at).getTime() < Date.now() - 1000 * 60 * 60 * 24 * 365).length
  const langJokes = LANG_JOKES[topLang] ?? []

  const lines: string[] = [
    totalStars === 0
      ? `${user.public_repos} repos, zero stars. The algorithm hasn't found them yet. Or has.`
      : totalStars < 10
      ? `${totalStars} total stars across ${user.public_repos} repos. Building in stealth mode, apparently.`
      : totalStars > 1000
      ? `${totalStars.toLocaleString()} stars. Not just a developer — an ecosystem.`
      : `${totalStars} stars accumulated. The internet is paying attention. Slowly.`,

    ...(langJokes.length > 0 ? [
      `The kind of developer who ${pick(langJokes)}.`,
      `Diagnosed with: ${pick(langJokes)}.`,
    ] : []),

    noDesc > 5
      ? `${noDesc} repos with no description. Truly believes code is self-documenting. It is not.`
      : noDesc > 0
      ? `A few repos are description-free. The vibe is there, the context is not.`
      : `Every repo has a description. Rare. Appreciated. Suspicious.`,

    stale > 10
      ? `${stale} repos collecting digital dust. It's a museum of good intentions.`
      : stale > 3
      ? `${stale} repos that haven't been touched in a year. Started with ambition, continued with other ambitions.`
      : `Remarkably few abandoned repos. Either disciplined or recently joined. Impressive either way.`,

    accountAge >= 8
      ? `${accountAge} years on GitHub. Has seen things. JavaScript framework cycles. The npm drama. All of it.`
      : accountAge >= 5
      ? `${accountAge} years deep. Old enough to remember when Vue was exciting, young enough to still care.`
      : accountAge <= 1
      ? `Relatively new to GitHub. The repos are modest. The potential is unverified but assumed large.`
      : `${accountAge} years of commit history. A timeline of a developer becoming a developer.`,

    user.following > user.followers * 3
      ? `Follows ${user.following} people, has ${user.followers} followers. The networking game is asymmetric.`
      : user.followers > user.following * 3
      ? `${user.followers} followers. The audience found them before they found the audience.`
      : `Followers and following are in rough balance. A developer of the community.`,

    `Built ${user.public_repos} things. Finished some of them. That's actually the deal.`,
    `The kind of dev who ${pick(HABITS)}.`,
    `${pick(INTROS)} ${pick(HABITS)}.`,
    `Top language: ${topLang}. ${langJokes.length > 0 ? pick(langJokes).charAt(0).toUpperCase() + pick(langJokes).slice(1) + '.' : 'Committed to the choice.'}`,
    `${user.public_repos} repos in the wild. ${pick(SIDE_PROJECT_ENERGY)}`,
    `${user.login} has been on GitHub ${accountAge} year${accountAge !== 1 ? 's' : ''}. ${pick(SIDE_PROJECT_ENERGY)}`,
    `Has ${user.public_repos} public repos and ${user.followers} followers. The ratio is what it is.`,
    `${langStats.length > 4 ? `${langStats.length} languages used` : `Focused on ${topLang}`}. ${pick(HABITS)}.`,
    `Joined GitHub in ${new Date(user.created_at).getFullYear()} and ${pick(HABITS)} since.`,
    `${noDesc > 3 ? 'Prefers code that speaks for itself (it doesn\'t).' : 'Documents things. Rare.'} ${pick(ENDINGS)}`,
    `${user.public_repos > 50 ? 'Quantity is a strategy.' : user.public_repos > 20 ? 'A solid portfolio in the making.' : 'Quality over quantity energy.'} ${pick(HABITS)}.`,
  ]

  return lines.filter(Boolean)
}

function buildModularRoast(user: GitHubUser, repos: GitHubRepo[], langStats: LanguageStat[]): string {
  const topLang = langStats[0]?.language ?? 'code'
  const langJokes = LANG_JOKES[topLang] ?? []
  const facts = repoFacts(user, repos, langStats)

  const patterns = [
    () => `${pick(INTROS)} ${pick(facts)}. ${pick(ENDINGS)}`,
    () => `${pick(INTROS)} this one ${pick(HABITS)}, ${langJokes.length > 0 ? pick(langJokes) : 'and somehow makes it work'}. ${pick(ENDINGS)}`,
    () => `${pick(facts)}. Also ${pick(HABITS)}.`,
    () => {
      const h = pick(HABITS)
      return `${h.charAt(0).toUpperCase() + h.slice(1)}. ${pick(facts)}. ${pick(ENDINGS)}`
    },
    () => {
      const h = pick(HABITS)
      const lj = langJokes.length > 0 ? ` Simultaneously ${pick(langJokes)}.` : ''
      return `${pick(INTROS)} ${user.login} ${h}.${lj} ${pick(ENDINGS)}`
    },
    () => `${pick(SIDE_PROJECT_ENERGY)} Also, ${pick(HABITS)}.`,
    () => `${pick(facts)}. ${langJokes.length > 0 ? `Additionally: ${pick(langJokes)}.` : pick(ENDINGS)}`,
  ]

  return pick(patterns)()
}

export function generateRoast({ user, repos, langStats }: RoastContext): string {
  if (chance(0.005)) return pick(ULTRA_RARE_LINES)
  if (chance(0.02)) return pick(LEGENDARY_LINES)

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)
  if (totalStars > 2000 && chance(0.5)) {
    return `${totalStars.toLocaleString()} total stars. At some point this stops being a GitHub profile and starts being a portfolio. This is that point. ${pick(ENDINGS)}`
  }

  const allContextual = contextRoasts(user, repos, langStats)

  return pickWeighted([
    { value: () => pick(allContextual), weight: 40 },
    { value: () => buildModularRoast(user, repos, langStats), weight: 35 },
    { value: () => `${pick(INTROS)} ${pick(allContextual).toLowerCase()}`, weight: 15 },
    { value: () => `${pick(allContextual)} ${pick(ENDINGS)}`, weight: 10 },
  ]).call(null)
}
