import type { GitHubUser, GitHubRepo, LanguageStat } from '../types/github'
import { pick, pickN, chance } from './textEngine'

const LEGEND_OPENERS = [
  'Legend says', 'It is rumored that', 'Ancient texts confirm', 'Sources close to the repo claim',
  'Historians note that', 'The commit log reveals', 'Witnesses report', 'Folklore holds that',
  'The README once confessed', 'GitHub Copilot whispered', 'Insiders confirm',
  'The git log doesn\'t lie:', 'Three different Stack Overflow answers agree:', 'CI/CD logs suggest',
  'The changelogs are silent but the diffs say', 'According to an anonymous PR review,',
]

const LORE_TEMPLATES = [
  (name: string, lang: string) => `${pick(LEGEND_OPENERS)} ${name} once fixed a production bug by renaming a variable to fix_FINAL_v2.${lang.toLowerCase()}.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} has a graveyard of side projects with names like "the-one-that-will-work".`,
  (name: string, lang: string) => `${pick(LEGEND_OPENERS)} ${name} once named a file final_v2_REAL_last_USE_THIS.${lang.toLowerCase()} and never looked back.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} has pushed to main at least once and immediately closed their laptop.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} wrote "will refactor later" in a comment in 2022. The comment remains.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} spent 4 hours debugging only to find a missing semicolon.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} has a .env file with 40 variables and remembers none of them.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} once committed node_modules to git. Once.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} opened Stack Overflow before reading the error message.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} considers console.log a legitimate debugging strategy. It is.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} has a branch called "experiment" that is 7 months old and was never merged.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} refactored the same function three times in one night without merging once.`,
  (name: string, repoName: string) => `${pick(LEGEND_OPENERS)} ${name} wrote ${repoName} in a single sitting fueled entirely by cold coffee and spite.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} has a private repo called "untitled-idea-3" that is definitely going to be big.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} once deployed on a Friday and survived. The details are classified.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} installed a new terminal font instead of fixing the bug. Twice.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} has asked ChatGPT to explain code they wrote six months ago.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} uses TODO comments as a form of journaling.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} has more VS Code extensions installed than features shipped this quarter.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} once ran a database migration in production without a backup and everything was fine. Somehow.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} switched from VS Code to Cursor to Neovim and back to VS Code in the same sprint.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} named a variable data2 and moved on without a second thought.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} has a localhost:3000 running something from a tutorial they never finished.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} once wrote the same utility function in three different files in the same project.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} pushed with the commit message "asdf" once and called it documentation.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} is the reason the repo has a CONTRIBUTING.md that nobody reads.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} once spent 2 hours on a PR description for a one-line change.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} has a Notion board with 60 project ideas and has started exactly 3 of them.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} once copy-pasted code from Stack Overflow into production and it worked perfectly. The shame never left.`,
  (name: string, _lang: string) => `${pick(LEGEND_OPENERS)} ${name} still has an open issue from 2022 labeled "good first issue" that they keep meaning to close.`,
]

// Ultra-rare legendary lines (appear ~3% of the time)
const LEGENDARY_LORE = [
  (name: string) => `✦ LORE DROP: ${name} once fixed a critical bug at 4am, pushed a single character change, and went back to sleep. The PR had 47 approvals by morning.`,
  (name: string) => `✦ LORE DROP: ${name} is believed to have submitted a PR to a project they had never heard of, fixed the bug, and left without explanation.`,
  (name: string) => `✦ LORE DROP: ${name} wrote a tool once that automated their entire job. They used the spare time to build three more projects.`,
]

export function generateLore(
  user: GitHubUser,
  repos: GitHubRepo[],
  langStats: LanguageStat[]
): string[] {
  const name    = user.name ?? user.login
  const topLang = langStats[0]?.language ?? 'code'
  const topRepo = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0]
  const repoRef = topRepo?.name ?? 'their legendary untitled project'

  // Build pool by applying context to each template
  const pool = LORE_TEMPLATES.map(fn => fn(name, topLang.toLowerCase()))
    // Also add a few repo-name variants
    .concat([
      `${pick(LEGEND_OPENERS)} ${name} is believed to have written "${repoRef}" in a single night and never touched it again.`,
      `${pick(LEGEND_OPENERS)} ${name} once described "${repoRef}" as "basically done" for six consecutive months.`,
    ])

  // Pick 4–5 unique lines
  const count = pick([4, 4, 5])
  const lines = pickN(pool, count)

  // Occasionally insert a legendary lore line at a random position (3% chance)
  if (chance(0.03)) {
    const legendary = pick(LEGENDARY_LORE)(name)
    const pos = Math.floor(Math.random() * (lines.length + 1))
    lines.splice(pos, 0, legendary)
  }

  return lines
}
