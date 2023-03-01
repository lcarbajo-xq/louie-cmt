export const COMMIT_TYPES = {
  feat: {
    emoji: '🆕',
    description: 'Add new feature/funcionality',
    release: true
  },
  docs: {
    emoji: '📙',
    description: 'Add/Update documentation',
    release: false
  },
  perf: {
    emoji: '🏃',
    description: 'Improve the performance',
    release: true
  },
  refactor: {
    emoji: '🧰',
    description: 'Code refactor',
    release: false
  },
  fix: {
    emoji: '🐛',
    description: 'Bug fix',
    release: true
  },
  build: {
    emoji: '🏗️ ',
    description: 'Build new release or version',
    release: false
  }
}
