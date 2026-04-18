import axios from 'axios';
import type { GitHubUser, GitHubRepo } from '../types/github';

const BASE_URL = 'https://api.github.com';

// Optional: set VITE_GITHUB_TOKEN in .env for higher rate limits
const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;

const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
};
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}

const client = axios.create({ baseURL: BASE_URL, headers });

export async function fetchUser(username: string): Promise<GitHubUser> {
  const { data } = await client.get<GitHubUser>(`/users/${username}`);
  return data;
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  // Fetch up to 100 repos sorted by most recently updated
  const { data } = await client.get<GitHubRepo[]>(`/users/${username}/repos`, {
    params: { per_page: 100, sort: 'updated', direction: 'desc' },
  });
  return data;
}

/**
 * Star a repo. Requires the user to be authenticated via VITE_GITHUB_TOKEN.
 * GitHub API: PUT /user/starred/{owner}/{repo}  → 204 on success
 */
export async function starRepo(owner: string, repo: string): Promise<void> {
  await client.put(`/user/starred/${owner}/${repo}`, null, {
    headers: { 'Content-Length': '0' },
  });
}

/**
 * Unstar a repo. GitHub API: DELETE /user/starred/{owner}/{repo} → 204
 */
export async function unstarRepo(owner: string, repo: string): Promise<void> {
  await client.delete(`/user/starred/${owner}/${repo}`);
}

/**
 * Check if the authenticated user has starred a repo.
 * Returns true if starred (204), false if not (404).
 */
export async function checkStarred(owner: string, repo: string): Promise<boolean> {
  try {
    await client.get(`/user/starred/${owner}/${repo}`);
    return true;
  } catch {
    return false;
  }
}

/** Returns true if a GitHub token is configured (star feature requires auth). */
export function isAuthenticated(): boolean {
  return !!token;
}

