import React from 'react'
import html2canvas from 'html2canvas'

/**
 * Captures a DOM element as a high-resolution PNG.
 * - No onclone patching (it corrupts carefully set inline styles)
 * - All card elements must use explicit inline styles only
 * - scale:3 for high quality
 */
export async function exportCardAsPng(
  ref: React.RefObject<HTMLElement>,
  filename: string
): Promise<void> {
  const el = ref.current
  if (!el) return

  // Wait for all avatar images to fully load
  const imgs = Array.from(el.querySelectorAll<HTMLImageElement>('img'))
  await Promise.all(
    imgs.map(img =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>(res => {
            img.onload  = () => res()
            img.onerror = () => res()
          })
    )
  )

  // Two rAF ticks so the browser has painted the latest frame
  await new Promise<void>(res =>
    requestAnimationFrame(() => requestAnimationFrame(() => res()))
  )

  const canvas = await html2canvas(el, {
    scale:           3,
    useCORS:         true,
    allowTaint:      true,
    backgroundColor: '#161B22',
    logging:         false,
  })

  const a = document.createElement('a')
  a.download = `${filename}.png`
  a.href     = canvas.toDataURL('image/png', 1.0)
  a.click()
}

// ── Shared base style for every captured card ──────────────────────────────
export const CARD_BASE_STYLE: React.CSSProperties = {
  background:          '#161B22',
  border:              '1px solid rgba(255,255,255,0.08)',
  borderRadius:        16,
  padding:             28,
  fontFamily:          'Inter, system-ui, sans-serif',
  overflow:            'hidden',
  boxSizing:           'border-box',
  width:               '100%',
  WebkitFontSmoothing: 'antialiased',
}

// ── Options for the txt() helper ──────────────────────────────────────────
export interface TxtOpts {
  mono?:          boolean
  lineHeight?:    number
  letterSpacing?: string
  whiteSpace?:    React.CSSProperties['whiteSpace']
  overflow?:      React.CSSProperties['overflow']
  textOverflow?:  string
}

// ── Text helper: all properties explicit, nothing left to browser defaults ─
export function txt(
  size: number,
  weight: number | string,
  color: string,
  opts: TxtOpts = {}
): React.CSSProperties {
  return {
    display:       'block',
    fontFamily:    opts.mono
      ? 'JetBrains Mono, ui-monospace, monospace'
      : 'Inter, system-ui, sans-serif',
    fontSize:      `${size}px`,
    fontWeight:    weight,
    color,
    lineHeight:    String(opts.lineHeight ?? 1.4),
    letterSpacing: opts.letterSpacing ?? (opts.mono ? '0.01em' : 'normal'),
    margin:        0,
    padding:       0,
    ...(opts.whiteSpace   !== undefined && { whiteSpace:   opts.whiteSpace }),
    ...(opts.overflow     !== undefined && { overflow:     opts.overflow }),
    ...(opts.textOverflow !== undefined && { textOverflow: opts.textOverflow }),
  }
}

// ── Badge with fixed px line-height so background never overflows text ─────
export function badgeStyle(color: string): React.CSSProperties {
  return {
    display:       'inline-block',
    padding:       '3px 10px',
    borderRadius:  20,
    fontSize:      '11px',
    fontWeight:    500,
    lineHeight:    '18px',
    color,
    background:    `${color}18`,
    border:        `1px solid ${color}30`,
    fontFamily:    'JetBrains Mono, ui-monospace, monospace',
    letterSpacing: '0.01em',
    whiteSpace:    'nowrap',
    boxSizing:     'border-box',
    verticalAlign: 'middle',
  }
}
