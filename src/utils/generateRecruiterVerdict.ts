import type { GitHubUser, GitHubRepo, LanguageStat, RecruiterVerdict } from '../types/github'
import { pick, chance } from './textEngine'

// ── Verdict pools by profile type ────────────────────────────────────────────

const STAR_VERDICTS: RecruiterVerdict[] = [
  { verdict: 'Portfolio speaks for itself. Skip the phone screen.',          badge: 'Top 1%',     tone: 'positive' },
  { verdict: 'Rare find. Forward to hiring manager immediately.',             badge: 'Unicorn',    tone: 'positive' },
  { verdict: 'Would survive any team. Hire before someone else does.',        badge: 'Senior+',    tone: 'positive' },
  { verdict: 'GitHub profile alone justifies the salary ask.',                badge: 'Elite',      tone: 'positive' },
  { verdict: 'The kind of profile that closes job reqs.',                     badge: 'Immediate',  tone: 'positive' },
  { verdict: 'Open source output > most interview processes.',                badge: 'Proven',     tone: 'positive' },
  { verdict: 'Has shipped things people actually use. Rare.',                 badge: 'Impact',     tone: 'positive' },
  { verdict: 'This profile is a reference check that passed itself.',         badge: 'Self-Verified', tone: 'positive' },
]

const POLYGLOT_VERDICTS: RecruiterVerdict[] = [
  { verdict: 'Uses 7+ languages. Wildcard energy.',                          badge: 'Wildcard',   tone: 'neutral' },
  { verdict: 'Explores everything. Might be unfocused or a generalist gem.', badge: 'Explorer',   tone: 'neutral' },
  { verdict: 'Jack of all trades. Strong senior mentor candidate.',           badge: 'Generalist', tone: 'neutral' },
  { verdict: 'Has touched enough stacks to be dangerous.',                    badge: 'Full Range', tone: 'neutral' },
  { verdict: 'Language breadth suggests strong fundamentals.',                badge: 'Adaptable',  tone: 'positive' },
  { verdict: 'Could parachute into most teams and survive.',                  badge: 'Versatile',  tone: 'positive' },
]

const TYPESAFE_VERDICTS: RecruiterVerdict[] = [
  { verdict: 'Types their code. Respects others\' time.',                    badge: 'Solid Hire',    tone: 'positive' },
  { verdict: 'Uses strict mode. Probably flosses too.',                      badge: 'Disciplined',   tone: 'positive' },
  { verdict: 'TypeScript and Rust? The borrow checker and the type checker.', badge: 'Type Safe',    tone: 'positive' },
  { verdict: 'Zero runtime errors in production. Allegedly.',                badge: 'Reliable',      tone: 'positive' },
  { verdict: 'Catches bugs at compile time. Everyone else catches them in prod.', badge: 'Proactive', tone: 'positive' },
  { verdict: 'Writes self-documenting code. No, really.',                    badge: 'Clean Code',    tone: 'positive' },
]

const HIGH_REPO_VERDICTS: RecruiterVerdict[] = [
  { verdict: 'Starts more projects than they finish. High energy, needs direction.', badge: 'Energetic',    tone: 'chaotic' },
  { verdict: 'Likely to push directly to main. Lovable menace.',                    badge: 'Chaos Agent',  tone: 'chaotic' },
  { verdict: 'Would survive a startup. Barely.',                                    badge: 'Survivor',     tone: 'chaotic' },
  { verdict: '50+ repos. Some are finished. This is fine.',                         badge: 'Prolific',     tone: 'chaotic' },
  { verdict: 'Velocity is high. Code review cadence is a question mark.',           badge: 'Fast Mover',   tone: 'chaotic' },
  { verdict: 'Ships first, asks permission later.',                                 badge: 'Move Fast',    tone: 'chaotic' },
  { verdict: 'Has strong opinions about everything except folder structure.',       badge: 'Opinionated',  tone: 'chaotic' },
  { verdict: 'Founder energy with IC output. Interesting.',                         badge: 'Builder',      tone: 'chaotic' },
  { verdict: 'Their git log reads like a fever dream. A productive one.',           badge: 'Unhinged',     tone: 'chaotic' },
]

const DEFAULT_VERDICTS: RecruiterVerdict[] = [
  { verdict: 'Can debug for 7 hours straight. Emotionally stable? TBD.',           badge: 'Focused',     tone: 'neutral' },
  { verdict: 'Solid fundamentals. Will complain about meetings.',                  badge: 'Reliable',    tone: 'neutral' },
  { verdict: 'README needs work. Code probably doesn\'t.',                         badge: 'Developer',   tone: 'neutral' },
  { verdict: 'Will ask good questions and break things thoughtfully.',             badge: 'Curious',     tone: 'positive' },
  { verdict: 'Has the GitHub green squares to prove they\'re serious.',            badge: 'Active',      tone: 'positive' },
  { verdict: 'Profile suggests someone who learns by building. Hire for that.',    badge: 'Builder',     tone: 'positive' },
  { verdict: 'Consistent commit history. Doesn\'t ghost the codebase.',           badge: 'Consistent',  tone: 'positive' },
  { verdict: 'Fewer repos, more polish. This is the way.',                         badge: 'Quality Dev', tone: 'positive' },
  { verdict: 'Has opinions. Expresses them in code instead of meetings.',          badge: 'Pragmatic',   tone: 'neutral' },
  { verdict: 'Writes the kind of code future developers thank someone for.',       badge: 'Thoughtful',  tone: 'positive' },
  { verdict: 'Would not introduce a race condition on purpose.',                   badge: 'Careful',     tone: 'neutral' },
  { verdict: 'Works well without a ticket system. Concerning and impressive.',     badge: 'Self-Driven', tone: 'positive' },
  { verdict: 'Knows when to use a library and when to write the thing.',           badge: 'Judicious',   tone: 'positive' },
  { verdict: 'Code review comments are probably useful rather than pedantic.',     badge: 'Collaborative', tone: 'positive' },
  { verdict: 'Not a 10x developer. Probably a 3x developer with a 10x attitude.', badge: '3x Dev',      tone: 'neutral' },
  { verdict: 'The kind of engineer who fixes the build before being asked.',       badge: 'Proactive',   tone: 'positive' },
  { verdict: 'Would update the README when the API changes. Rare trait.',          badge: 'Documented',  tone: 'positive' },
  { verdict: 'Has a testing strategy. It may not be conventional. It exists.',     badge: 'Tested',      tone: 'neutral' },
  { verdict: 'Commits are small and well-scoped. This is not common. Respect.',    badge: 'Clean Git',   tone: 'positive' },
  { verdict: 'Will not cause a production incident in the first week. Probably.',  badge: 'Safe Hire',   tone: 'neutral' },
  { verdict: 'Interview performance may not reflect this level of output.',        badge: 'Hidden Gem',  tone: 'positive' },
  { verdict: 'Would be mid in an interview, exceptional in practice.',             badge: 'Practical',   tone: 'positive' },
]

export function generateRecruiterVerdict(
  user: GitHubUser,
  repos: GitHubRepo[],
  langStats: LanguageStat[]
): RecruiterVerdict {
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)
  const topLang    = langStats[0]?.language ?? ''

  if (totalStars > 500 || user.followers > 200) {
    return pick(STAR_VERDICTS)
  }

  if (langStats.length > 6) {
    // 60% polyglot verdict, 40% default for variety
    return chance(0.6) ? pick(POLYGLOT_VERDICTS) : pick(DEFAULT_VERDICTS)
  }

  if (topLang === 'TypeScript' || topLang === 'Rust' || topLang === 'Go') {
    return chance(0.7) ? pick(TYPESAFE_VERDICTS) : pick(DEFAULT_VERDICTS)
  }

  if (user.public_repos > 50) {
    return chance(0.65) ? pick(HIGH_REPO_VERDICTS) : pick(DEFAULT_VERDICTS)
  }

  return pick(DEFAULT_VERDICTS)
}
