import { motion } from 'framer-motion'
import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js'
import type { SkillScores } from '../types/github'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

interface Props { skills: SkillScores }

export default function SkillChart({ skills }: Props) {
  const labels = Object.keys(skills) as (keyof SkillScores)[]
  const values = labels.map(k => skills[k])

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: 'rgba(163,113,247,0.1)',
      borderColor: '#A371F7',
      borderWidth: 1.5,
      pointBackgroundColor: '#A371F7',
      pointBorderColor: '#161B22',
      pointBorderWidth: 2,
      pointRadius: 3,
    }],
  }

  const options = {
    scales: {
      r: {
        min: 0, max: 100,
        ticks: { display: false, stepSize: 25 },
        grid:         { color: 'rgba(255,255,255,0.05)' },
        angleLines:   { color: 'rgba(255,255,255,0.05)' },
        pointLabels:  { color: '#8B949E', font: { size: 10, family: 'JetBrains Mono' } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx: { raw: unknown }) => ` ${ctx.raw}/100` },
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
        <p className="section-label mb-4">Skill Radar</p>
        <div className="max-w-[220px] mx-auto">
          <Radar data={data} options={options as never} />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4" style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          {labels.map(l => (
            <div key={l} className="text-center">
              <div className="text-sm font-semibold" style={{ color: 'var(--purple)' }}>{skills[l]}</div>
              <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--muted)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
