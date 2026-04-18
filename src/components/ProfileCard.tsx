import { MapPin, Link2, Building2, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import type { GitHubUser } from '../types/github'
import { formatDate } from '../utils/formatDate'

interface Props { user: GitHubUser }

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div>
      <div className="text-base font-semibold" style={{ color: 'var(--text)' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  )
}

export default function ProfileCard({ user }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-16 h-16 rounded-xl flex-shrink-0"
            style={{ border: '1px solid var(--border)' }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                {user.name ?? user.login}
              </h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="badge badge-blue text-xs"
              >
                @{user.login}
              </a>
            </div>
            {user.bio && (
              <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--muted)' }}>
                {user.bio}
              </p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--muted)' }}>
              {user.location && (
                <span className="flex items-center gap-1.5"><MapPin size={11} />{user.location}</span>
              )}
              {user.company && (
                <span className="flex items-center gap-1.5"><Building2 size={11} />{user.company.replace('@', '')}</span>
              )}
              {user.blog && (
                <a
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 hover:underline"
                  style={{ color: 'var(--blue)' }}
                >
                  <Link2 size={11} />{user.blog.replace(/^https?:\/\//, '')}
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={11} />Joined {formatDate(user.created_at)}
              </span>
            </div>
          </div>
        </div>

        <hr className="divider my-5" />

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
          <Stat value={user.followers} label="Followers" />
          <Stat value={user.following} label="Following" />
          <Stat value={user.public_repos} label="Repos" />
          <div className="hidden sm:block">
            <Stat value={user.public_gists} label="Gists" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
