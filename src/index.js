import {
  intro,
  outro,
  text,
  select,
  confirm,
  multiselect,
  isCancel
} from '@clack/prompts'
import { COMMIT_TYPES } from './commit-types.js'
import colors from 'picocolors'
import {
  getChangedfilesFromRepo,
  getStagedFilesFromRepo,
  gitAddFilesToNextCommit,
  sendCommit
} from './git.js'
import { trytm } from '@bdsqqq/try'
import { exitFromExecution } from './helpers.js'

intro(
  colors.inverse(
    `Commit Convention Creator. Created by ${colors.yellow('@louie-dev')}`
  )
)

const [stagedFilesFromRepo, errorStagedFilesFromRepo] = await trytm(
  getStagedFilesFromRepo()
)
const [changedFilesFromRepo, errorChangedFilesFromRepo] = await trytm(
  getChangedfilesFromRepo()
)

if (errorChangedFilesFromRepo ?? errorStagedFilesFromRepo) {
  outro(colors.red('Error: Are you sure you initialized a git project?'))
  process.exit(1)
}

if (stagedFilesFromRepo.length === 0 && changedFilesFromRepo.length > 0) {
  const files = await multiselect({
    message: colors.cyan('Select files to be included on the next commit'),
    options: changedFilesFromRepo.map((file) => ({
      value: file,
      label: file
    }))
  })

  if (isCancel(files)) exitFromExecution()

  await gitAddFilesToNextCommit({ files })
}

const commitType = await select({
  message: colors.cyan('Select your commit type'),
  options: Object.entries(COMMIT_TYPES).map(([key, value]) => ({
    value: key,
    label: `${value.emoji} · ${key.padEnd(8, ' ')} · ${value.description}`
  }))
})

if (isCancel(commitType)) exitFromExecution()

const commitMessage = await text({
  message: 'Set the commit message',
  validate: (value) => {
    if (value.length === 0) {
      return colors.red('Commit message cannot be empty!')
    }
    if (value.length > 50) {
      return colors.red(
        'Commit message cannot be more than 50 characters long!'
      )
    }
  }
})

if (isCancel(commitMessage)) exitFromExecution()

const { emoji, release } = COMMIT_TYPES[commitType]

let breakingChange = false
if (release) {
  breakingChange = await confirm({
    initialValue: false,
    message: `Are the changes making a breaking change? 
          
          ${colors.gray(
            'Breaking change means breaking compatibility with previouse releases. This will make the changes to public a major release'
          )})`
  })

  if (isCancel(breakingChange)) exitFromExecution()
}

let commit = `${emoji} ${commitType}: ${commitMessage}`
commit = breakingChange ? `${commit} [breaking change]` : commit

const shouldContinue = await confirm({
  message: `This is your commit:
      ${colors.yellow(colors.bold(commit))}
  
      ${colors.cyan(colors.bold('Do you confirm it?'))}
      `
})

if (isCancel(shouldContinue)) exitFromExecution()

if (!shouldContinue) {
  outro(colors.red('Error: Commit was cancelled by user'))
  process.exit(0)
}

await sendCommit({ message: commit })

outro(colors.green('✅ Commit successfully created. Keep developing!!'))
