import type { LanguageStat, RelationshipStatus } from '../types/github'
import { pick, chance } from './textEngine'

// ── Per-language status pools ─────────────────────────────────────────────────

const LANG_STATUSES: Record<string, { status: string; emoji: string }[]> = {
  TypeScript: [
    { status: 'In a committed relationship', emoji: '💍' },
    { status: 'Would type everything including feelings', emoji: '✍️' },
    { status: 'Refuses to write any', emoji: '🚫' },
    { status: 'Made strict: true a personality trait', emoji: '📐' },
    { status: 'In love with interfaces', emoji: '🏗️' },
    { status: 'The borrow checker but for JavaScript', emoji: '🔒' },
    { status: 'Annotates grocery lists with types', emoji: '🛒' },
    { status: 'Types as documentation evangelist', emoji: '📖' },
    { status: 'Generics enthusiast, possibly unwell', emoji: '⚙️' },
    { status: 'Genuinely enjoys tsconfig.json', emoji: '🎯' },
    { status: 'Loyal since 2019, no regrets', emoji: '🏆' },
    { status: 'Cries when forced to use any', emoji: '😢' },
  ],
  JavaScript: [
    { status: "It's complicated", emoji: '😬' },
    { status: 'Cannot live without it', emoji: '🫀' },
    { status: 'Toxic but familiar', emoji: '🔁' },
    { status: 'Understands the event loop now', emoji: '🌀' },
    { status: 'Made peace with undefined', emoji: '☮️' },
    { status: 'Uses 4 async patterns in one file', emoji: '🤹' },
    { status: 'typeof null === "object" acceptance phase', emoji: '🧘' },
    { status: 'Still names things thing and stuff', emoji: '🏷️' },
    { status: 'npm installed their way to glory', emoji: '📦' },
    { status: 'Prototype chain explained unprompted', emoji: '🧬' },
    { status: 'var used once, never again', emoji: '🪦' },
  ],
  Python: [
    { status: 'Current situationship', emoji: '🐍' },
    { status: 'Ghosted after discovering TypeScript', emoji: '👻' },
    { status: 'Whitespace is a love language', emoji: '⬛' },
    { status: 'List comprehensions as therapy', emoji: '💆' },
    { status: 'pip install everything, regret later', emoji: '📦' },
    { status: 'Jupyter notebook graveyard maintainer', emoji: '📓' },
    { status: 'Indentation is a feature, not a choice', emoji: '🎹' },
    { status: 'Rewrites bash scripts in Python for fun', emoji: '🔄' },
    { status: 'Three virtual envs, zero idea what\'s in them', emoji: '🌀' },
    { status: 'The _ variable has been used', emoji: '🤫' },
    { status: 'PEP 8 is the law, the prophets, and the code review', emoji: '⚖️' },
  ],
  CSS: [
    { status: 'Toxic relationship', emoji: '💀' },
    { status: 'We argue constantly', emoji: '😤' },
    { status: 'Centering divs is still the final boss', emoji: '🎯' },
    { status: 'z-index: 9999 and proud', emoji: '🏔️' },
    { status: '!important as a coping mechanism', emoji: '🆘' },
    { status: 'position: absolute is a personality', emoji: '📍' },
    { status: 'Dark mode broken in one browser, accepted fate', emoji: '🌑' },
    { status: 'Flexbox for everything including life decisions', emoji: '🧲' },
    { status: 'Grid master in theory, flex in practice', emoji: '📊' },
    { status: 'animation-delay is the only therapy', emoji: '⏱️' },
    { status: 'Uses Tailwind to avoid writing CSS, still writes CSS', emoji: '💨' },
  ],
  Rust: [
    { status: 'Secret crush', emoji: '🤫' },
    { status: 'Admire from a distance', emoji: '👀' },
    { status: 'Fighting the borrow checker daily', emoji: '⚔️' },
    { status: 'Joined the cult, no regrets', emoji: '🙏' },
    { status: 'Tells everyone about memory safety', emoji: '📢' },
    { status: 'Rewrites things in Rust for fun', emoji: '🔄' },
    { status: 'Owns a "Rewrite it in Rust" sticker unironically', emoji: '🦀' },
    { status: 'Lifetime annotations are meditation', emoji: '🧘' },
    { status: 'Option<T> is now a worldview', emoji: '🌍' },
    { status: 'match arms are their love language', emoji: '💘' },
    { status: 'Zero cost abstractions enthusiast', emoji: '🆓' },
  ],
  Go: [
    { status: 'Quietly dating', emoji: '🤝' },
    { status: 'No drama zone', emoji: '😌' },
    { status: 'Appreciates simplicity in a complex world', emoji: '🧘' },
    { status: 'err != nil on every line', emoji: '🔍' },
    { status: 'Goroutines as a lifestyle', emoji: '🏃' },
    { status: 'Gofmt is non-negotiable', emoji: '📐' },
    { status: 'Minimal dependencies, maximum ships', emoji: '🚀' },
    { status: 'Binary deploys that just work', emoji: '✅' },
    { status: 'select statement enjoyer', emoji: '🎛️' },
    { status: 'Used generics after 1.18, no regrets', emoji: '⚡' },
  ],
  Java: [
    { status: 'Long distance relationship', emoji: '📡' },
    { status: 'Met in college, still haven\'t escaped', emoji: '🎓' },
    { status: 'AbstractFactoryBuilderManager is peak design', emoji: '🏗️' },
    { status: 'Spring Boot for a to-do app', emoji: '🌱' },
    { status: 'Enterprise patterns as a lifestyle', emoji: '🏢' },
    { status: 'Getter and setter for every field', emoji: '🔧' },
    { status: 'Has seen things in legacy codebases', emoji: '🌑' },
    { status: 'Maven and Gradle both installed, both complained about', emoji: '⚙️' },
    { status: 'Survived Tomcat deployment and has stories', emoji: '📖' },
  ],
  Kotlin: [
    { status: 'Upgraded from Java', emoji: '⬆️' },
    { status: 'New fling that became serious', emoji: '💘' },
    { status: 'data classes changed everything', emoji: '💾' },
    { status: 'Extension functions as therapy', emoji: '🔌' },
    { status: 'Null safety as a personality trait', emoji: '🛡️' },
    { status: '?.let {} on every nullable', emoji: '🔍' },
    { status: 'Coroutines are the answer always', emoji: '⚡' },
    { status: 'Sealed classes for everything', emoji: '🔒' },
    { status: 'Writing Android and genuinely happy', emoji: '😊' },
  ],
  'C++': [
    { status: 'Masochistic love', emoji: '🩹' },
    { status: 'It hurts but I stay', emoji: '😭' },
    { status: 'Manual memory management builds character', emoji: '💪' },
    { status: 'Segfaults are just suggestions', emoji: '🤷' },
    { status: 'Pointers to pointers to pointers', emoji: '🌀' },
    { status: 'Templates so deep they need documentation', emoji: '📚' },
    { status: 'Undefined behavior is a feature, sometimes', emoji: '🎲' },
  ],
  PHP: [
    { status: 'On and off again', emoji: '🔁' },
    { status: "We don't talk about this", emoji: '🤐' },
    { status: 'Started with WordPress, never fully left', emoji: '🌐' },
    { status: 'Laravel made it survivable', emoji: '🚀' },
    { status: 'Seen the dark timeline of PHP 5.3', emoji: '🕳️' },
    { status: 'Making peace with the past', emoji: '☮️' },
  ],
  Swift: [
    { status: "It's beautiful but lives in one ecosystem", emoji: '🍎' },
    { status: 'Xcode Stockholm syndrome', emoji: '🏠' },
    { status: 'Protocols with associated types are home', emoji: '📐' },
    { status: 'Submitted to App Store, waited, shipped', emoji: '🚀' },
    { status: 'SwiftUI is poetry, UIKit is history', emoji: '📝' },
    { status: 'Simulator addiction, can\'t stop', emoji: '📱' },
  ],
  Ruby: [
    { status: 'Was in love once', emoji: '💔' },
    { status: 'Still nostalgic for the Rails golden age', emoji: '🥹' },
    { status: 'Convention over configuration believer', emoji: '📜' },
    { status: 'Misses writing beautiful code nobody else could maintain', emoji: '🎨' },
    { status: 'The magic was real and also terrifying', emoji: '🪄' },
  ],
  Dart: [
    { status: 'Flutter brought us together', emoji: '🦋' },
    { status: 'Trying something new and loving it', emoji: '🎯' },
    { status: 'Hot reload changed the relationship with debugging', emoji: '🔥' },
    { status: 'Widget tree 40 layers deep', emoji: '🌲' },
    { status: 'One codebase for six platforms, reasonable', emoji: '🌐' },
  ],
  Shell: [
    { status: 'Used when nobody is watching', emoji: '🫣' },
    { status: 'Dark arts practitioner', emoji: '🧙' },
    { status: '.zshrc is a work of art', emoji: '🎨' },
    { status: 'alias everything including emotions', emoji: '🏷️' },
    { status: 'sed and awk are love languages', emoji: '💘' },
    { status: 'Pipe operator is a lifestyle', emoji: '🔗' },
    { status: 'Script works once, must never be touched', emoji: '🔒' },
  ],
  Dockerfile: [
    { status: 'Ships everything in a container', emoji: '📦' },
    { status: 'Works on my machine, and in a box', emoji: '✅' },
    { status: 'Multi-stage builds as architecture', emoji: '🏗️' },
    { status: 'COPY . . then cry later', emoji: '😭' },
  ],
  HTML: [
    { status: 'The foundation that cannot be left', emoji: '🏠' },
    { status: 'Semantic HTML evangelist', emoji: '📢' },
    { status: 'div soup survivor', emoji: '🍜' },
    { status: 'Still debates id vs class', emoji: '🤔' },
    { status: 'Forms without JavaScript, as a treat', emoji: '📝' },
  ],
}

// ── Modular combination fragments ─────────────────────────────────────────────

const RELATIONSHIP_PREFIXES = [
  'In a', 'Currently in a', 'Stuck in a', 'Voluntarily in a', 'Accidentally in a',
  'Permanently in a', 'Happily in a', 'Reluctantly in a', 'Joyfully in a', 'Chaotically in a',
]

const RELATIONSHIP_TYPES = [
  'committed relationship', 'complicated situation', 'toxic situationship', 'healthy partnership',
  'casual arrangement', 'long-distance arrangement', 'on-and-off thing', 'love-hate dynamic',
  'codependent loop', 'productive collaboration', 'obsessive deep dive', 'spiritual connection',
  'questionable arrangement', 'no-drama partnership', 'intense affair',
]

const RELATIONSHIP_SUFFIXES = [
  // Side affairs
  'but secretly texting Rust on the weekends',
  'while considering leaving for Go',
  'despite not understanding all of it',
  'and refuses to explain why',
  'that started at a hackathon',
  'after abandoning Python',
  'while still maintaining multiple node_modules folders',
  'after a brief but passionate affair with Svelte',
  'with zero regrets and several StackOverflow tabs open',
  'even though the relationship started in tutorial hell',
  'despite the build times',
  'while also learning Rust "just in case"',
  'and genuinely no plans to stop',
  'after years of therapy (debugging)',
  'because someone had to do it',
]

const FALLBACK_STATUSES = [
  { status: 'Casual fling that became serious', emoji: '🙃' },
  { status: 'Met at a hackathon, still here', emoji: '🏃' },
  { status: "It's a phase that never ended", emoji: '📖' },
  { status: 'Learning curve became a lifestyle', emoji: '📈' },
  { status: 'Tutorial became identity', emoji: '🎓' },
  { status: 'Assigned at work, stayed by choice', emoji: '💼' },
  { status: 'The documentation is sparse but feelings are real', emoji: '💭' },
  { status: 'Curious at first, obsessed now', emoji: '🔍' },
  { status: 'Nobody else understood, kept going anyway', emoji: '🤷' },
]

// ── Generator ─────────────────────────────────────────────────────────────────

function buildModularStatus(language: string): { status: string; emoji: string } {
  // Modular combo: prefix + type + optional suffix
  if (chance(0.4)) {
    const prefix = pick(RELATIONSHIP_PREFIXES)
    const type = pick(RELATIONSHIP_TYPES)
    const addSuffix = chance(0.5)
    const suffix = addSuffix ? ` ${pick(RELATIONSHIP_SUFFIXES)}` : ''
    const status = `${prefix} ${type} with ${language}${suffix}`
    const emojis = ['💘', '💔', '🔥', '😭', '✨', '🎯', '🌀', '🏗️', '⚔️', '🤝']
    return { status, emoji: pick(emojis) }
  }
  return pick(FALLBACK_STATUSES)
}

export function generateRelationshipStatuses(langStats: LanguageStat[]): RelationshipStatus[] {
  return langStats.slice(0, 4).map(({ language }) => {
    const pool = LANG_STATUSES[language]

    if (pool && pool.length > 0) {
      // 70% use language-specific, 30% use modular builder for variety
      const picked = chance(0.7) ? pick(pool) : buildModularStatus(language)
      return { language, ...picked }
    }

    const built = buildModularStatus(language)
    return { language, ...built }
  })
}
