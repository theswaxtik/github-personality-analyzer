// GitHub API response types

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
}

export interface LanguageStat {
  language: string;
  count: number;
  percentage: number;
}

export interface SkillScores {
  Frontend: number;
  Backend: number;
  Mobile: number;
  AI: number;
  'Open Source': number;
  DevOps: number;
}

export interface PersonalityType {
  title: string;
  emoji: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careerPath: string;
}

export type SortOrder = 'stars' | 'recent';

// ── Expansion feature types ───────────────────────────────────────────────────

export interface AuraScore {
  score: number;
  label: string;
  description: string;
}

export interface DevStatsCard {
  Focus: number;
  Chaos: number;
  Consistency: number;
  Creativity: number;
  'Bug Resistance': number;
  'Sleep Deprivation': number;
}

export interface RelationshipStatus {
  language: string;
  status: string;
  emoji: string;
}

export interface RepoGraveyardItem {
  repo: GitHubRepo;
  badge: string;
  badgeColor: string;
}

export interface RecruiterVerdict {
  verdict: string;
  badge: string;
  tone: 'positive' | 'neutral' | 'chaotic';
}

