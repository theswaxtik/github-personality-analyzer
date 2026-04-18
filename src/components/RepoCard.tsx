import { GitFork, ExternalLink } from 'lucide-react'
import type { GitHubRepo } from '../types/github'
import { timeAgo } from '../utils/formatDate'
import StarButton from './StarButton'

interface Props { repo: GitHubRepo }

const LANG_COLORS: Record<string, string> = {
  JavaScript: '#F1E05A', TypeScript: '#3178C6', Python: '#3572A5',
  Kotlin: '#A97BFF', Swift: '#F05138', Rust: '#DEA584', Go: '#00ADD8',
  Java: '#B07219', 'C++': '#F34B7D', C: '#555555', Ruby: '#701516',
  PHP: '#4F5D95', Dart: '#00B4AB', HTML: '#E34C26', CSS: '#563D7C',
  Shell: '#89E051', Vue: '#41B883',
}

export default function RepoCard({ repo }: Props) {
  const langColor = repo.language ? (LANG_COLORS[repo.language] ?? '#8B949E') : null
  const [owner] = repo.full_name.split('/')

  return (
    <div className="card-interactive p-4 flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-2">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium hover:underline truncate"
          style={{ color: 'var(--blue)' }}
        >
          {repo.name}
        </a>
        <a href={repo.html_url} target="_blank" rel="noreferrer" className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100">
          <ExternalLink size={12} style={{ color: 'var(--muted)' }} />
        </a>
      </div>

      {repo.description && (
        <p className="text-xs line-clamp-2" style={{ color: 'var(--muted)' }}>{repo.description}</p>
      )}

      <div className="flex items-center gap-3 text-xs mt-auto" style={{ color: 'var(--muted)' }}>
        {langColor && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor }} />
            <span className="font-mono">{repo.language}</span>
          </span>
        )}
        <StarButton owner={owner} repo={repo.name} currentStars={repo.stargazers_count} />
        <span className="flex items-center gap-1">
          <GitFork size={11} />
          <span className="font-mono">{repo.forks_count.toLocaleString()}</span>
        </span>
        <span className="ml-auto font-mono">{timeAgo(repo.pushed_at)}</span>
      </div>
    </div>
  )
}
