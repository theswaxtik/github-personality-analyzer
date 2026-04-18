import type { GitHubRepo, LanguageStat, SkillScores } from '../types/github';

const FRONTEND_LANGS = new Set(['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'Svelte', 'Elm']);
const BACKEND_LANGS = new Set(['Python', 'Java', 'Go', 'Rust', 'PHP', 'Ruby', 'C#', 'C++', 'C', 'Scala', 'Elixir']);
const MOBILE_LANGS = new Set(['Kotlin', 'Swift', 'Dart', 'Objective-C', 'Java']);
const AI_LANGS = new Set(['Python', 'Jupyter Notebook', 'R', 'Julia', 'MATLAB']);
const DEVOPS_LANGS = new Set(['Shell', 'Dockerfile', 'HCL', 'Makefile', 'PowerShell']);

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function calculateSkills(repos: GitHubRepo[], langStats: LanguageStat[]): SkillScores {
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const repoCount = repos.length;

  let frontendScore = 0;
  let backendScore = 0;
  let mobileScore = 0;
  let aiScore = 0;
  let devopsScore = 0;

  for (const { language, percentage } of langStats) {
    if (FRONTEND_LANGS.has(language)) frontendScore += percentage;
    if (BACKEND_LANGS.has(language)) backendScore += percentage;
    if (MOBILE_LANGS.has(language)) mobileScore += percentage;
    if (AI_LANGS.has(language)) aiScore += percentage;
    if (DEVOPS_LANGS.has(language)) devopsScore += percentage;
  }

  // Open source score based on stars, forks, and repo count
  const openSourceScore = clamp(
    Math.round((totalStars / 10 + totalForks / 5 + repoCount * 2) / 3),
    5,
    95
  );

  const normalize = (raw: number) => clamp(Math.round(raw * 0.9), 5, 95);

  return {
    Frontend: normalize(frontendScore),
    Backend: normalize(backendScore),
    Mobile: normalize(mobileScore),
    AI: normalize(aiScore),
    'Open Source': openSourceScore,
    DevOps: normalize(devopsScore),
  };
}
