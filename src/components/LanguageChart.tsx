import { motion } from 'framer-motion'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import type { LanguageStat } from '../types/github'

ChartJS.register(ArcElement, Tooltip)

const PALETTE = ['#2F81F7','#3FB950','#A371F7','#F85149','#F0883E','#58A6FF','#56D364','#BC8CFF']

interface Props { langStats: LanguageStat[] }

export default function LanguageChart({ langStats }: Props) {
  const top = langStats.slice(0, 6)
  const colors = top.map((_, i) => PALETTE[i % PALETTE.length])

  const data = {
    labels: top.map(l => l.language),
    datasets: [{
      data: top.map(l => l.percentage),
      backgroundColor: colors,
      borderColor: '#161B22',
      borderWidth: 3,
      hoverOffset: 3,
    }],
  }

  const options = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx: { label: string; raw: unknown }) => ` ${ctx.label}: ${ctx.raw}%` },
        backgroundColor: '#21262D',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        titleColor: '#E6EDF3',
        bodyColor: '#8B949E',
        padding: 10,
      },
    },
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="card p-5">
        <p className="section-label mb-4">Languages</p>
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <div className="w-28 h-28 flex-shrink-0">
            <Doughnut data={data} options={options as never} />
          </div>
          <div className="flex-1 w-full space-y-2">
            {top.map((lang, i) => (
              <div key={lang.language}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{lang.language}</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{lang.percentage}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--hover)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors[i] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.percentage}%` }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
