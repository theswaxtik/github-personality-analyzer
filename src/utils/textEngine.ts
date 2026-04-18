/**
 * textEngine.ts
 * Modular weighted text generation engine.
 * Combines fragment pools with weighted randomness + rare/legendary tiers.
 */

// ── Core random helpers ───────────────────────────────────────────────────────

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Weighted pick: items with higher weight appear more often */
export function pickWeighted<T>(items: { value: T; weight: number }[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let rand = Math.random() * total
  for (const item of items) {
    rand -= item.weight
    if (rand <= 0) return item.value
  }
  return items[items.length - 1].value
}

/** Returns true with probability p (0–1) */
export function chance(p: number): boolean {
  return Math.random() < p
}

/** Pick n unique items from array */
export function pickN<T>(arr: T[], n: number): T[] {
  const copy = [...arr]
  const result: T[] = []
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * (copy.length - i))
    result.push(copy[idx])
    copy[idx] = copy[copy.length - 1 - i]
  }
  return result
}

// ── Fragment pools ────────────────────────────────────────────────────────────

export const INTROS = [
  'Scientifically proven:', 'Hot take:', 'Fun fact:', 'Leaked internal report:',
  'According to GitHub analytics:', 'Peer reviewed:', 'Breaking news:', 'Confidentially,',
  'Warning label:', 'Between us:', 'Unofficial diagnosis:', 'GitHub says hi btw,',
  'The data doesn\'t lie:', 'Our AI noticed:', 'Plot twist:', 'Sources close to the repo confirm:',
  'Not to be dramatic but:', 'Empirically speaking:', 'Statistically speaking:',
  'The algorithm has spoken:', 'Terminal output:', 'Stack trace revealed:',
  'Last commit message energy:', 'Your README admits:', 'GitHub Copilot whispered:',
]

export const LANG_JOKES: Record<string, string[]> = {
  TypeScript: [
    'types everything including their grocery list',
    'would add generics to a sandwich recipe',
    'hasn\'t written plain JS since 2021 and is thriving',
    'will argue about strict mode for 45 minutes',
    'genuinely enjoys writing interface declarations',
    'probably annotated their TODO list with types',
    'treats any as a personal failure',
    'named their cat Readonly<Cat>',
    'added TypeScript to a project that had 2 files',
    'cried when they had to use @ts-ignore once',
  ],
  JavaScript: [
    'still uses var occasionally and refuses to apologize',
    'has 14 different ways to do async and uses all of them',
    'typeof null === "object" and they made peace with it',
    'can explain the event loop at 2am without blinking',
    'has a complicated relationship with \'this\'',
    'npm installed their way to a 500MB node_modules',
    'knows 6 ways to reverse a string and uses a different one each time',
    'probably has a .js file that\'s 1800 lines long',
  ],
  Python: [
    'whitespace is a lifestyle, not a syntax rule',
    'uses list comprehensions when a for loop would be perfectly fine',
    'has a Jupyter notebook graveyard with 40 untitled files',
    'pip installs first, reads docs never',
    'named a variable l because it was faster to type',
    'rewrites shell scripts in Python for fun',
    'has three virtual envs active and no idea what\'s in any of them',
    'thinks indentation is a feature, not a bug',
  ],
  Rust: [
    'fights the borrow checker like a daily workout',
    'joined the cult and hasn\'t looked back',
    'rewrites everything in Rust "for fun"',
    'tells everyone about memory safety at dinner parties',
    'has the Rust book open in one tab forever',
    'cannot write code without mutability warnings',
    'spent 3 hours on a lifetime annotation and felt proud',
    'owns a "Rewrite it in Rust" sticker unironically',
  ],
  Go: [
    'appreciates simplicity in a world full of drama',
    'refused to add generics for a decade and somehow won',
    'handles errors explicitly because they respect themselves',
    'has a binary that just works and ships faster than your build step',
    'writes Go at work and tells nobody about it',
    'enjoys writing goroutines more than having hobbies',
  ],
  Java: [
    'has seen things in enterprise codebases that cannot be unseen',
    'annotates everything. absolutely everything.',
    'AbstractFactoryBuilderManagerServiceImpl is not a joke to them',
    'wrote getters and setters for a class with one field',
    'deployed to Tomcat once and still hasn\'t fully recovered',
    'uses Spring Boot for a to-do app',
    'has an IDE that takes 45 seconds to start and calls it fine',
  ],
  Kotlin: [
    'escaped Java and never looked back',
    'data classes and extension functions changed their life',
    'writes Android apps with coroutines and is genuinely happy',
    'considers null safety a personality trait',
    'uses ?.let {} for everything and feels powerful',
  ],
  'C++': [
    'manages memory manually and has the scars to show',
    'segfaults are just suggestions to them',
    'wrote a destructor once and ascended to a new plane',
    'uses templates so complex they need a diagram to explain',
    'pointers to pointers are a lifestyle choice',
  ],
  CSS: [
    'centering a div is their final boss',
    'uses flexbox for everything including life decisions',
    'has z-index: 9999 somewhere in their codebase',
    'position: absolute is a coping mechanism',
    'dark mode is broken on one specific browser and they\'ve accepted it',
    'their animation is 12ms off and it haunts their dreams',
    'uses !important and immediately feels shame',
  ],
  Shell: [
    'writes scripts that work once and must never be touched again',
    'has an alias for everything including cd ..',
    'reads man pages for fun on weekends',
    'their .bashrc is 400 lines long',
    'sed and awk are their love languages',
  ],
  PHP: [
    'started with WordPress and never fully escaped',
    'has seen the dark timeline of PHP 5.3 code',
    'uses Laravel now and has made peace with the past',
    'knows every quirk of the language and still chose it',
  ],
  Ruby: [
    'thinks Rails magic is a feature',
    'named every variable in a poetic way',
    'misses the Rails golden age but won\'t admit it',
    'writes beautiful code nobody else can maintain',
  ],
  Swift: [
    'lives inside Xcode and has developed Stockholm syndrome',
    'would buy a new Mac just to run the simulator faster',
    'protocols with associated types are their entire personality',
    'submitted to the App Store and waited 3 weeks',
  ],
  Dart: [
    'chose Flutter because one codebase for everything sounded sane',
    'hot reload changed their relationship with debugging',
    'has a widget tree so deep it needs its own map',
  ],
}

export const HABITS = [
  'commits at 2am with the message "fix"',
  'has 12 unfinished side projects and just opened a new one',
  'reads HN instead of writing the code',
  'has Notion, Linear, and Obsidian open but uses none of them',
  'tabs over spaces is not up for debate',
  'their localhost is running 6 things right now',
  'has a "will refactor later" comment from 2022 that is still there',
  'opened a new terminal tab to avoid dealing with git conflicts',
  'their README has more stars than commits',
  'deploys to prod on Fridays and is somehow still employed',
  'broke the main branch and fixed it before anyone noticed. probably.',
  'has a .env file with 30 variables and no .env.example',
  'uses TODO comments as a spiritual journaling practice',
  'skipped writing tests and wrote a Twitter thread about test-driven development',
  'their biggest dependency is a package with 2 weekly downloads',
  'hasn\'t used git stash correctly a single time',
  'their commit history reads like a personal diary',
  'named a branch hotfix-final-v2-REAL',
  'runs npm install and goes to make coffee',
  'googled "how to exit vim" this week',
  'copy-pasted from Stack Overflow before GPT existed. copy-pastes from ChatGPT now.',
  'opened DevTools just to see what color something was',
  'has 47 browser tabs open, 12 are Stack Overflow',
  'writes documentation for personal projects nobody uses',
  'installed a new font for their terminal instead of shipping the feature',
  'their package.json has 40 dependencies and 3 are actually used',
  'git blamed themselves and felt nothing',
  'has a Dockerfile that works on their machine and nowhere else',
  'uses Prettier and ESLint but still writes messy logic',
  'their variable names are a window into their mental state at 1am',
  'has a private repo called "untitled-thing" from 3 years ago',
  'learned a new keyboard shortcut instead of fixing the bug',
  'ran a database migration in production without a backup',
  'started using Vim and talks about it constantly',
  'switched from VS Code to Cursor to Neovim back to VS Code in one month',
  'has GitHub Copilot enabled and still writes the same bugs',
  'asked ChatGPT to explain code they wrote six months ago',
  'their localhost:3000 is running something from a tutorial they never finished',
  'has a branch called "experiment" that\'s 6 months old and was never merged',
  'pushed node_modules to git once. once.',
]

export const SIDE_PROJECT_ENERGY = [
  'This person has startup energy with personal-project output.',
  'MVP stands for "Maybe Viable… Perhaps".',
  'Every repo is the one that\'s going to change everything.',
  'Will describe any side project as "just a small thing I\'m building".',
  'The graveyard of ideas is vast and beautiful.',
  'Has a Notion board for projects that will never leave Notion.',
  '"I\'ll finish it this weekend" — every weekend, forever.',
  'One day the side project becomes the main project. Today is not that day.',
  'Quantity of repos > quality of sleep.',
  'Started 3 projects this month. Finished 0. Net positive.',
]

export const ENDINGS = [
  'Respect.',
  'We stan.',
  'Carry on.',
  'Keep shipping.',
  'The pipeline believes in you.',
  'May your builds never fail.',
  'Touch grass occasionally.',
  'Your future self will understand. Maybe.',
  '10x developer energy, 0.3x documentation energy.',
  'The open source world is lucky to have you. Mostly.',
  'git push and pray.',
  'Stack overflow can\'t help you now.',
  'npm run vibe.',
  'This is the way.',
  'We\'re all just figuring it out.',
  'The borrow checker sends its regards.',
  'Skill issue? Never heard of it.',
  'Based and type-safe pilled.',
  'main branch is fine, probably.',
  'May your merge conflicts be few.',
]

export const LEGENDARY_LINES = [
  'Legend. Certified unhinged developer. GitHub is not ready.',
  'This profile should come with a warning label. It does not.',
  'Top 0.001% on GitHub. The other 99.999% are catching up. Maybe.',
  'The kind of developer that ships before standup and disappears after.',
  'If their commit history was a movie, it would be directed by Christopher Nolan.',
  'Local deity. Worshipped in at least three Discord servers.',
  'At this point just commit directly to Linux kernel.',
  'Their README alone has more words than the average novel.',
  'Built something that runs on a Raspberry Pi in someone\'s basement and never went down.',
  'The type to open a 5000 line PR with the message "small changes".',
]

export const ULTRA_RARE_LINES = [
  '✦ ULTRA RARE: This profile achieved perfect developer chaos. We bow.',
  '✦ LEGENDARY: Somehow maintains work-life balance AND ships. Fake. Impossible. Inspiring.',
  '✦ MYTHIC: Wrote a compiler for fun. Deployed it. Never mentioned it.',
]

// ── Aura label pools by tier ──────────────────────────────────────────────────

export const AURA_LABELS_BY_TIER: Record<string, { label: string; description: string }[]> = {
  legendary: [
    { label: 'Mythic Dev', description: 'Exists beyond the normal GitHub dimension.' },
    { label: 'Ascended Coder', description: 'Code compiles on the first try. Always.' },
    { label: 'Open Source Deity', description: 'Stars fall from the sky when they push.' },
    { label: 'Repository God', description: 'Maintainer of things mortals dare not fork.' },
    { label: '10x Ghost', description: 'Invisible output. Massive impact. No meetings.' },
    { label: 'Terminal Overlord', description: 'Has a shell alias for everything including emotions.' },
    { label: 'Commit Singularity', description: 'One with the diff. Eternally in flow state.' },
    { label: 'The Architect', description: 'Designed systems that outlived three startups.' },
  ],
  high: [
    { label: 'Chaotic Genius', description: 'Unpredictable. Dangerous. Somehow always ships.' },
    { label: 'Silent Builder', description: 'Ships quietly. Repos speak louder than tweets.' },
    { label: 'Dark Mode Monk', description: 'Codes in silence. Achieves enlightenment in PRs.' },
    { label: 'Async Wizard', description: 'Awaits nothing. Resolves everything.' },
    { label: 'Refactor Zealot', description: 'Cannot merge without making it better first.' },
    { label: 'CI/CD Samurai', description: 'Green pipelines only. No exceptions.' },
    { label: 'Stack Conqueror', description: 'Frontend, backend, infra. What can\'t they do.' },
    { label: 'PR Perfectionist', description: 'Every diff is a piece of art.' },
    { label: 'Ship It Spirit', description: 'Done is better than perfect. Done and good is better.' },
    { label: 'Dependency Witch', description: 'Knows every package in node_modules by name.' },
    { label: 'High Aura Dev', description: 'The vibe is immaculate. The code matches.' },
    { label: 'Branch Whisperer', description: 'Merges without conflicts. Somehow.' },
    { label: 'Senior Hobbyist', description: 'Does this professionally and also for fun. Unwell.' },
    { label: 'Production Oracle', description: 'Senses when things will break before they do.' },
    { label: 'Latency Hunter', description: 'Shaved 12ms off a query at 11pm. Worth it.' },
  ],
  mid: [
    { label: 'Midnight Committer', description: 'The dark hours are peak productivity. Circadian rhythm: unknown.' },
    { label: 'Weekend Warrior', description: 'Five days of meetings, two days of actual building.' },
    { label: 'Tutorial Escapee', description: 'Left tutorial hell and is building in the real world now.' },
    { label: 'Stack Overflow Pilgrim', description: 'Every bug is a journey. Most journeys end on SO.' },
    { label: 'Side Project Hoarder', description: 'Collects project ideas like others collect trophies.' },
    { label: 'Localhost Legend', description: 'Incredible on their machine. Somewhere else is another story.' },
    { label: 'README Romantic', description: 'Writes better documentation than code. Still counts.' },
    { label: 'Feature Creeper', description: 'Started simple. Added scope. Cannot stop.' },
    { label: 'NPM Enthusiast', description: 'There\'s a package for it. They have it installed.' },
    { label: 'Framework Drifter', description: 'Has used React, Vue, Angular, Svelte, and is now curious about HTMX.' },
    { label: 'Async Apprentice', description: 'Learning promises by breaking them.' },
    { label: 'Type Explorer', description: 'TypeScript is making sense. Slowly. Very slowly.' },
    { label: 'Git Bisect Enjoyer', description: 'Finds bugs the hard way, learns the most.' },
    { label: 'Deployment Dabbler', description: 'Vercel, Netlify, Railway — all tried, all partially configured.' },
    { label: 'Solo Founder Mindset', description: 'Building in public. Mostly. Kind of.' },
    { label: 'Hackathon Survivor', description: 'Has shipped under pressure. The scars are invisible.' },
    { label: 'Vibe Coder', description: 'The architecture is vibes. The code works though.' },
    { label: 'Caffeine-Fueled Engineer', description: 'Runs on coffee, ambient music, and stubbornness.' },
    { label: 'Sprint Sprinter', description: 'Productive for 2 hours. Burned out for 6. Repeat.' },
    { label: 'Database Whisperer', description: 'Has strong opinions about SQL vs NoSQL. Both are wrong.' },
  ],
  low: [
    { label: 'Open Source Ghost', description: 'Present in code. Absent on the internet.' },
    { label: 'Bug Hunter', description: 'Every commit is a negotiation with reality.' },
    { label: 'Early Stage Dev', description: 'The journey has started. The destination is fuzzy.' },
    { label: 'Tutorial Collector', description: 'Has bookmarked 200 tutorials. Started 4.' },
    { label: 'Lurker Coder', description: 'Reads more code than they write. For now.' },
    { label: 'Node Modules Victim', description: 'Still downloading dependencies from yesterday.' },
    { label: 'Hello World Graduate', description: 'Has moved beyond the basics. Barely.' },
    { label: 'Commit Minimalist', description: 'Ships small. Commits smaller. Speaks in riddles.' },
    { label: 'Init Stage Developer', description: 'npm init, git init, life init.' },
    { label: 'Curious Newcomer', description: 'Everything is new. Everything is exciting. Everything breaks.' },
    { label: 'Syntax Learner', description: 'The language makes sense now. The ecosystem does not.' },
    { label: 'First PR Energy', description: 'Getting started is the hardest part. They started.' },
    { label: 'README Only Dev', description: 'The ideas are great. The implementations are pending.' },
    { label: 'Copy Paste Pioneer', description: 'Stack Overflow is a mentor, not a shortcut. Right?' },
    { label: 'Environment Battler', description: 'Half the time is getting the project to run locally.' },
  ],
}

// ── Personality title pools ───────────────────────────────────────────────────

export interface PersonalityEntry {
  title: string
  emoji: string
  description: string
  strengths: string[]
  weaknesses: string[]
  careerPath: string
}

interface PersonalityTitlesMap {
  frontend: PersonalityEntry[]
  backend: PersonalityEntry[]
  fullstack: PersonalityEntry[]
  mobile: PersonalityEntry[]
  ai: PersonalityEntry[]
  devops: PersonalityEntry[]
  misc: PersonalityEntry[]
}

export const PERSONALITY_TITLES: PersonalityTitlesMap = {
  frontend: [
    {
      title: 'Frontend Wizard', emoji: '🎨',
      description: 'Pixels bow to their will. Every animation runs at 60fps.',
      strengths: ['Eye for detail', 'Component instincts', 'CSS sorcery'],
      weaknesses: ['Backend aversion', 'CSS rabbit holes', 'Redesigning instead of shipping'],
      careerPath: 'Frontend Dev → UI Engineer → Design Systems Lead',
    },
    {
      title: 'UI Alchemist', emoji: '✨',
      description: 'Transforms Figma mockups into reality with unsettling accuracy.',
      strengths: ['Design sense', 'Pixel perfection', 'Accessibility awareness'],
      weaknesses: ['Scope creep on animations', 'Over-engineering hover states'],
      careerPath: 'UI Dev → Senior Frontend → Principal Engineer',
    },
    {
      title: 'Component Hoarder', emoji: '🧩',
      description: 'Has a component for everything. Including things that don\'t need components.',
      strengths: ['Reusability thinking', 'DRY principle mastery', 'Storybook enthusiast'],
      weaknesses: ['Abstraction addiction', 'Premature optimization', 'Prop drilling nightmares'],
      careerPath: 'Frontend Dev → Component Library Maintainer → Platform Engineer',
    },
    {
      title: 'Tailwind Cultist', emoji: '💨',
      description: 'Utility classes are the only truth. className strings 400 chars long.',
      strengths: ['Rapid styling', 'Consistent design tokens', 'Zero context switching'],
      weaknesses: ['Unreadable JSX', 'Resists CSS files on principle', 'tw-merge addiction'],
      careerPath: 'Frontend Dev → UI Specialist → DX Engineer',
    },
  ],
  backend: [
    {
      title: 'Backend Phantom', emoji: '⚙️',
      description: 'Lurks in the server layer. Nobody knows what they build but everything depends on it.',
      strengths: ['Systems thinking', 'API design', 'Database optimization'],
      weaknesses: ['UI blindness', 'Markdown-only documentation', 'Overcomplicates simple things'],
      careerPath: 'Backend Dev → Senior Engineer → Platform Architect',
    },
    {
      title: 'API Artisan', emoji: '🔌',
      description: 'Every endpoint is crafted with care. The swagger docs are beautiful.',
      strengths: ['REST mastery', 'Clear contracts', 'Error handling'],
      weaknesses: ['Bikesheds over naming conventions', 'REST vs GraphQL debates that never end'],
      careerPath: 'Backend Dev → API Lead → Staff Engineer',
    },
    {
      title: 'Database Whisperer', emoji: '🗄️',
      description: 'Can explain query plans at breakfast. Has strong feelings about indexes.',
      strengths: ['Query optimization', 'Schema design', 'Data modeling'],
      weaknesses: ['Over-normalizes everything', 'Rewrites ORMs for sport'],
      careerPath: 'Backend Dev → Data Engineer → Database Architect',
    },
    {
      title: 'Microservices Monk', emoji: '🕸️',
      description: 'Splits every feature into its own service. Docker Compose is their Bible.',
      strengths: ['Service isolation', 'Scalability mindset', 'Docker fluency'],
      weaknesses: ['Distributed systems complexity', 'Network latency blindspot', 'Overkill for small projects'],
      careerPath: 'Backend Dev → Platform Engineer → Distributed Systems Lead',
    },
  ],
  fullstack: [
    {
      title: 'Full Stack Warrior', emoji: '⚔️',
      description: 'Frontend, backend, databases — roams the entire stack without fear.',
      strengths: ['End-to-end ownership', 'Versatility', 'No waiting on others'],
      weaknesses: ['Depth vs breadth tradeoff', 'Context switching fatigue', 'Jack of all, master of some'],
      careerPath: 'Full Stack Dev → Tech Lead → CTO',
    },
    {
      title: 'Next.js Nomad', emoji: '🌐',
      description: 'Everything is a Next.js app. Even things that should not be Next.js apps.',
      strengths: ['Rapid prototyping', 'Vercel deployment speed', 'SSR awareness'],
      weaknesses: ['App Router confusion', 'Overuses server components', 'Page Router nostalgia'],
      careerPath: 'Full Stack Dev → Next.js Specialist → Senior Engineer',
    },
    {
      title: 'Vercel Maximalist', emoji: '▲',
      description: 'git push = deploy. Their workflow is six commands or fewer.',
      strengths: ['Deployment velocity', 'Edge function fluency', 'CI/CD speed'],
      weaknesses: ['Vendor lock-in blindspot', 'Cold start denial', 'Bill anxiety on scale'],
      careerPath: 'Full Stack Dev → Infrastructure Engineer → Platform Lead',
    },
    {
      title: 'T3 Stack Apostle', emoji: '🔺',
      description: 'tRPC, Prisma, Next.js, Tailwind. Type safety all the way down.',
      strengths: ['Full type safety', 'DX obsession', 'Rapid app scaffolding'],
      weaknesses: ['Boilerplate bloat', 'Debates prisma vs drizzle constantly', 'Everything is typesafe including the coffee'],
      careerPath: 'Full Stack Dev → TypeScript Lead → Principal Engineer',
    },
  ],
  mobile: [
    {
      title: 'Android Architect', emoji: '🤖',
      description: 'Kotlin flows through their veins. Jetpack Compose is home.',
      strengths: ['Android patterns', 'Kotlin mastery', 'Material Design fluency'],
      weaknesses: ['iOS gaps', 'Fragmentation headaches', 'Play Store review anxiety'],
      careerPath: 'Android Dev → Senior Mobile Engineer → Mobile Platform Lead',
    },
    {
      title: 'Flutter Fanatic', emoji: '🦋',
      description: 'One codebase, six platforms. The widget tree is 40 layers deep.',
      strengths: ['Cross-platform thinking', 'Hot reload addiction', 'Dart mastery'],
      weaknesses: ['Platform-specific edge cases', 'Native feel debates', 'StatefulWidget nightmares'],
      careerPath: 'Flutter Dev → Mobile Lead → Cross-Platform Architect',
    },
    {
      title: 'iOS Craftsperson', emoji: '🍎',
      description: 'SwiftUI is poetry. Xcode is a necessary evil.',
      strengths: ['Apple HIG knowledge', 'Swift mastery', 'Performance obsession'],
      weaknesses: ['Android blind spot', 'Xcode crashes accepted as fate', 'Simulator addiction'],
      careerPath: 'iOS Dev → Senior Mobile Engineer → Apple Platform Specialist',
    },
  ],
  ai: [
    {
      title: 'AI Builder', emoji: '🧠',
      description: 'Fine-tunes models before breakfast. Has opinions on attention mechanisms.',
      strengths: ['Data intuition', 'Rapid prototyping', 'Research mindset'],
      weaknesses: ['Deployment polish', 'Frontend blindspot', 'Model size debates'],
      careerPath: 'ML Engineer → Research Engineer → AI Product Lead',
    },
    {
      title: 'Prompt Engineer', emoji: '💬',
      description: 'Talks to LLMs for a living and has mastered the art of asking nicely.',
      strengths: ['LLM intuition', 'Chain of thought mastery', 'RAG architecture'],
      weaknesses: ['Non-determinism acceptance', 'Token count anxiety', 'Hallucination denial'],
      careerPath: 'Prompt Engineer → AI Product Engineer → LLM Application Lead',
    },
    {
      title: 'Vector Database Pilgrim', emoji: '📐',
      description: 'Embeddings are the new SQL. Similarity search is the new query.',
      strengths: ['Semantic search', 'RAG pipelines', 'Embedding model selection'],
      weaknesses: ['Traditional database nostalgia', 'Dimension count debates', 'cosine vs dot product wars'],
      careerPath: 'ML Engineer → AI Infrastructure Engineer → Search Lead',
    },
    {
      title: 'Cursor Maximalist', emoji: '🖱️',
      description: 'Codes faster with AI autocomplete and still writes the same bugs.',
      strengths: ['AI-assisted development', 'Speed', 'Composing from scratch is overrated'],
      weaknesses: ['Over-trusts suggestions', 'Doesn\'t always read what was generated', 'Context window guilt'],
      careerPath: 'Developer → AI-Augmented Engineer → Vibe Coder Lead',
    },
  ],
  devops: [
    {
      title: 'Automation Hacker', emoji: '🤖',
      description: 'If it runs more than twice, it gets automated. Shell scripts are poetry.',
      strengths: ['Systems thinking', 'Tooling mastery', 'Efficiency obsession'],
      weaknesses: ['Over-engineering', 'Automation of things that didn\'t need it'],
      careerPath: 'DevOps Engineer → Platform Engineer → Infrastructure Lead',
    },
    {
      title: 'Docker Disciple', emoji: '🐳',
      description: 'Everything is a container. Their laptop runs 12 of them right now.',
      strengths: ['Environment consistency', 'Deployment reliability', 'Image optimization'],
      weaknesses: ['Docker Desktop memory usage acceptance', 'Writes 300-line Dockerfiles for a hello world'],
      careerPath: 'DevOps Dev → Container Platform Engineer → Cloud Architect',
    },
    {
      title: 'Kubernetes Cultist', emoji: '☸️',
      description: 'Orchestrates containers the way a conductor leads an orchestra. Loudly.',
      strengths: ['Scaling expertise', 'Resilience design', 'YAML fluency'],
      weaknesses: ['Overkill for most projects', 'kubectl muscle memory', 'Certificate expiry anxiety'],
      careerPath: 'DevOps → Platform Engineer → Cloud Native Architect',
    },
    {
      title: 'CI/CD Maximalist', emoji: '🚀',
      description: 'Green pipeline or it doesn\'t ship. The workflow YAML is 800 lines.',
      strengths: ['Deployment confidence', 'Automated quality gates', 'Release velocity'],
      weaknesses: ['Pipeline bikeshedding', '40-minute build times accepted as normal'],
      careerPath: 'DevOps Engineer → Build Engineer → Engineering Productivity Lead',
    },
  ],
  misc: [
    {
      title: 'Open Source Goblin', emoji: '👾',
      description: 'Stars and forks are the currency. Ships at midnight, reviews at dawn.',
      strengths: ['Community building', 'Code quality', 'Documentation habits'],
      weaknesses: ['Scope creep', 'Maintainer burnout', 'Unread issues pile'],
      careerPath: 'OSS Contributor → Developer Advocate → Maintainer',
    },
    {
      title: 'Midnight Hacker', emoji: '🌙',
      description: 'Commits at 2am. Merges at 3. Ships at dawn. No off switch exists.',
      strengths: ['Raw output', 'Creative problem solving', 'Fearless experimentation'],
      weaknesses: ['Work-life balance', 'Morning standup survival', 'Commit message quality after midnight'],
      careerPath: 'Solo Dev → Startup Founder → Technical Co-founder',
    },
    {
      title: 'Code Explorer', emoji: '🗺️',
      description: 'New language every month. New framework every quarter. Infinite curiosity.',
      strengths: ['Adaptability', 'Curiosity', 'Polyglot mindset'],
      weaknesses: ['Finishing projects', 'Depth in any single area', 'Shiny object syndrome'],
      careerPath: 'Generalist Engineer → Solutions Architect → Tech Consultant',
    },
    {
      title: 'Bug Hunter', emoji: '🔍',
      description: 'Reads stack traces for fun. Debugging is their meditation.',
      strengths: ['Analytical thinking', 'Patience', 'Root-cause intuition'],
      weaknesses: ['Feature velocity', 'Premature optimization', 'Over-investigates simple issues'],
      careerPath: 'QA Engineer → SDET → Engineering Manager',
    },
    {
      title: 'Professional Tutorial Collector', emoji: '📚',
      description: 'Has watched every course on Udemy. Built nothing from them yet.',
      strengths: ['Theoretical knowledge', 'Learning velocity', 'Stack awareness'],
      weaknesses: ['Tutorial hell escape', 'Analysis paralysis', 'Project initiation anxiety'],
      careerPath: 'Self-taught Dev → Junior Engineer → ??? (The escape is possible)',
    },
    {
      title: 'Supabase Sommelier', emoji: '🥂',
      description: 'Has strong opinions about Firebase vs Supabase. Supabase won.',
      strengths: ['Rapid backend setup', 'Realtime data', 'Postgres fluency'],
      weaknesses: ['Vendor dependency', 'Row Level Security confusion', 'Edge function cold starts'],
      careerPath: 'Full Stack Dev → BaaS Specialist → Backend Lead',
    },
    {
      title: 'Hackathon Veteran', emoji: '🏆',
      description: 'Ships MVPs in 24 hours. The code quality is deliberately unexamined.',
      strengths: ['Speed', 'Scope management', 'Demo day performance'],
      weaknesses: ['Hackathon code in production', 'Tech debt accumulation', 'Post-event abandonment'],
      careerPath: 'Hackathon Winner → Startup Founder → Either CTO or new Hackathon',
    },
    {
      title: 'Startup Archeologist', emoji: '⛏️',
      description: 'Has founded or worked at 3 startups. Two are pivoted, one is a meme.',
      strengths: ['Scrappy execution', 'Product instincts', 'Wears many hats'],
      weaknesses: ['Process aversion', 'Documentation as afterthought', 'Burnout proximity'],
      careerPath: 'Startup Engineer → Co-founder → Either exit or do it again',
    },
  ],
}

// ── Repo mood labels ──────────────────────────────────────────────────────────

export const REPO_MOODS = [
  // Classic abandoned
  'started with motivation, abandoned with grace',
  'README only, no warranty',
  'untouched since the last hackathon',
  'a vibe with no commits to back it up',
  'the idea was good, the execution is TBD',
  '"I\'ll finish this weekend" — 14 months ago',
  'monument to unrealized potential',
  'this one had a 2am breakthrough that never continued',
  'fork to nowhere',
  'archived by momentum, not by choice',
  // Tech debt
  'works but nobody touch it',
  'held together by console.log and hope',
  'technical debt: the sequel',
  'the original developer has fled the country',
  '"it\'s fine" — last commit message energy',
  'production since 2019, untouched since 2021',
  'one broken dependency away from extinction',
  // Ambitious
  'was going to be a SaaS',
  'future billion-dollar idea, current zero-star repo',
  'the pivot that never pivoted',
  'next Stripe killer (in progress)',
  'the unicorn that got distracted by another unicorn',
  'indie hacker origin story, chapter one only',
  '"disrupting the industry" (no activity in 8 months)',
  // Funny
  'built at 3am, pushed at 4am, regretted at 9am',
  'created during tutorial, evolved into identity',
  'for a job application that didn\'t work out',
  'because someone said it couldn\'t be done',
  'to prove a point in a Discord argument',
  'the conference talk demo that lives on',
  'exists because npm publish is too easy',
  'this was supposed to be a gist',
]

// ── Starter pack items ────────────────────────────────────────────────────────

export const STARTER_PACK_ITEMS: Record<string, string[]> = {
  TypeScript: [
    'strict: true and proud', 'every variable has a type', 'interface over type (or type over interface, it changes weekly)',
    'tsconfig.json is a work of art', 'uses zod for runtime validation', 'generics in functions that did not need generics',
    'never writes any on purpose', 'gets personally offended by implicit any', 'satisfies operator enthusiast',
  ],
  JavaScript: [
    'named something util.js', 'has a helpers.js with 40 functions', 'jQuery still lives somewhere in the project',
    '6 ways to do async, uses all of them', 'chaining .then() instead of async/await sometimes',
    'prototype chain explanation ready at any time', 'closures are a vibe', 'the README says "vanilla js"',
  ],
  Python: [
    'virtual env wars (venv vs conda vs uv)', 'Jupyter notebook called "untitled7"',
    'list comprehensions as a personality trait', 'underscores in every variable name',
    'f-strings only, no .format() allowed', 'PEP 8 is scripture', '__init__.py in every folder',
    'requirements.txt pinned to exact versions from 2020',
  ],
  Rust: [
    'fought the borrow checker and won (eventually)', 'Cargo.toml is the first thing opened',
    '"safe" and "fast" used in the same sentence always', 'match expressions for everything',
    'Option<T> is now their worldview', 'the Rust book is open in another tab right now',
    'rewrites a project "just to see how Rust handles it"', 'no null, only None',
  ],
  Go: [
    'err != nil check on every line', 'binary that\'s 5MB and does everything',
    'goroutines instead of threads, forever', 'select statement enjoyer',
    'refused to use generics until 1.18, then immediately used them', 'gofmt is non-negotiable',
    'no exception handling, just error returns and vibes',
  ],
  generic: [
    'localhost:3000 always running something', 'dark mode everything', 'Oh My Zsh with 12 plugins',
    'Nerd Font in the terminal', '.zshrc longer than most projects', 'Homebrew for everything on Mac',
    'has an alias for git status', 'iTerm2 or Warp, never Terminal.app',
    'VS Code with 30 extensions or Neovim with 60 plugins, no in-between',
    'always has a README in progress', 'commits to main "just this once"',
    'localhost ngrok tunnel for mobile testing', 'multiple package managers installed',
    'has a personal domain that goes to a splash page', 'dotfiles repo that\'s better maintained than actual projects',
    'uses fish shell and considers it a personality', 'has tried and abandoned Emacs once',
  ],
}

// ── Badge title pools ─────────────────────────────────────────────────────────

export const BADGE_TITLES = [
  // Commit habits
  'Midnight Committer', 'Commit & Run', 'git push --force', 'Rebase Royalty', 'Merge Conflict Survivor',
  'Branch Hoarder', 'Squash Master', 'git blame Magnet', 'Cherry Pick Artist', 'Stash Abandonist',
  // Repo types
  'README Poet', 'One-File Wonder', 'Monorepo Monk', 'Fork Galaxy', 'Archived Legend',
  'Private Repo Hoarder', 'Template Wizard', 'Boilerplate Baron', 'Clone Army', 'Star Chaser',
  // Language
  'TypeScript Purist', 'JavaScript Apologist', 'Python Evangelist', 'Rust Rustacean', 'Go Gopher',
  'Java Survivor', 'C++ Masochist', 'CSS Philosopher', 'Shell Shaman', 'Polyglot Pilgrim',
  // Habits
  'npm install Addict', '3am Push Club', 'Friday Deployer', 'TODO Hoarder', 'Comment Whisperer',
  'Semicolon Agnostic', 'Prettier Devotee', 'ESLint Ignorer', 'Console.log Detective', 'Stack Overflow Regular',
  // Energy
  'Burnout Survivor', 'Flow State Seeker', 'Productivity Maximizer', 'Deep Work Disciple', 'Pomodoro Skeptic',
  'Mechanical Keyboard Evangelist', 'Standing Desk Convert', 'Background Music Curator', 'Dark Mode Absolutist',
  // Community
  'HN Lurker', 'Discord Server Founder', 'Issue Opener', 'PR Abandoner', 'Code Review Feared',
  'Documentation Volunteer', 'Issue Closer', 'First Contributor Badge', 'Open Source Patron', 'Sponsor Receiver',
  // Rare
  '10k Stars Club', 'Viral Repo Author', 'Conference Speaker', 'Podcast Guest', 'Newsletter Writer',
  'YouTube Tutorial Creator', 'Tech Twitter Legend', 'Dev.to Prolific', 'Hashnode Habitué',
]

// ── Side comments ─────────────────────────────────────────────────────────────

export const SIDE_COMMENTS = [
  'Hydration status: unknown.', 'Sleep schedule: creative.', 'git log looks like a fever dream.',
  'The .env file is sacred. Do not touch.', 'node_modules weighs more than their soul.',
  'Has opened a new side project tab while reading this.', 'The TODO list has its own TODO list.',
  'coffee.count++', 'Undefined behavior is just creative output.', 'The standup was skipped. Productively.',
  'Stack Overflow tab: always open.', 'The commit message was "asdf" once. Only once.',
  'Their Spotify playlist is called "coding beats" and it hits.', 'package.json: 47 dependencies, 3 used.',
  'The linter is disabled locally and it shows.', 'localhost is more stable than their sleep schedule.',
  'Deploy button pressed. Eyes closed.', 'The branch name says it all.', 'It works and nobody knows why.',
  'Tech debt: lovingly maintained.', 'Vim mode enabled, hjkl somewhat understood.',
  'The AI suggested this. They approved it. Ship it.', 'Three monitors and somehow still alt-tabbing.',
  'The README wrote itself. Mostly.', 'git stash pop is a lifestyle.',
  'There\'s a better way to do this. They\'ll find it next time.', 'Tabs. Final answer. Non-negotiable.',
  'The feature was simpler in the Notion doc.', 'Dependency updated. Everything works. Suspicious.',
  'The build passed on the third try. Counts as first.', 'Issue labeled "wontfix" lives rent-free in their head.',
]

// ── Footer taglines ───────────────────────────────────────────────────────────

export const FOOTER_TAGLINES = [
  'Analyzing developers since forever.', 'No code was harmed in this analysis.',
  'Powered by GitHub API and questionable decisions.', 'Data-driven roasting since 2024.',
  'Your repos told us everything.', 'The truth is in the commit history.',
  'This is a judgment-free zone. Mostly.', 'Built with TypeScript, deployed with courage.',
  'Every repo has a story. This is yours.', 'Open source, closed sleep schedule.',
  'npm run analyze → npm run roast → npm run ship', 'github.com never looked so personal.',
  'Made by developers, for developers, about developers.', 'Zero AI hallucinations. Some developer hallucinations.',
  'Verified by the power of git log --oneline', 'Stars and forks don\'t define you. But they help.',
  'The algorithm has opinions. You can ignore them.', 'Commit. Push. Repeat. Repeat. Repeat.',
  'Your personality in repository form.', 'One API call away from self-discovery.',
]

// ── Hidden achievements ───────────────────────────────────────────────────────

export const HIDDEN_ACHIEVEMENTS = [
  { name: 'Midnight Merger', desc: 'Merged a PR between midnight and 4am' },
  { name: 'The Archaeologist', desc: 'Has repos older than 5 years still active' },
  { name: 'Fork You', desc: 'More than 20% of repos are forks' },
  { name: 'The Minimalist', desc: '10+ repos with zero description' },
  { name: 'Star Chaser', desc: 'At least one repo with 100+ stars' },
  { name: 'Language Tourist', desc: 'Used more than 8 different languages' },
  { name: 'The Contrarian', desc: 'Zero TypeScript in 2024+' },
  { name: 'Graveyard Keeper', desc: '5+ repos untouched for over a year' },
  { name: 'Solo Founder', desc: 'All repos are personal, no org work' },
  { name: 'Readme Obsessive', desc: 'README longer than the codebase' },
  { name: 'The Ghost', desc: 'Fewer followers than repos' },
  { name: 'Commit Surge', desc: '50+ repos pushed to recently' },
  { name: 'Dependency Dealer', desc: 'package.json has 50+ dependencies' },
  { name: 'The Perfectionist', desc: 'Every repo has topics and description' },
  { name: 'Open Source Soldier', desc: '10+ forked repos with contributions' },
  { name: 'Rust Pioneer', desc: 'Using Rust before it was cool' },
  { name: 'AI Native', desc: 'Multiple AI/ML repos in portfolio' },
  { name: 'The Architect', desc: 'Has a repo that others depend on' },
  { name: 'Weekend Builder', desc: 'Most pushes happen on weekends' },
  { name: 'Tutorial Escapee', desc: 'Early repos are tutorials, recent repos are projects' },
]
