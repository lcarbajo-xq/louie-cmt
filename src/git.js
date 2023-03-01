import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

function cleanStdout(stdout) {
  return stdout.trim().split('\n').filter(Boolean)
}

export async function getChangedfilesFromRepo() {
  const { stdout } = await execAsync('git status --porcelain')

  return cleanStdout(stdout).map((line) => line.split(' ').at(-1))
}

export async function getStagedFilesFromRepo() {
  const { stdout } = await execAsync('git diff --cached --name-only')
  return cleanStdout(stdout)
}

export async function gitAddFilesToNextCommit({ files } = {}) {
  const filesToAddinLine = files.join(' ')
  const { stdout } = await execAsync(`git add ${filesToAddinLine}`)
  return cleanStdout(stdout)
}

export async function sendCommit({ message } = {}) {
  const { stdout } = await execAsync(`git commit -m "${message}"`)
  return cleanStdout(stdout)
}
