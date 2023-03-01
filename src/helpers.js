import { outro } from '@clack/prompts'
import colors from 'picocolors'

export function exitFromExecution({
  code = 0,
  exitMessage = 'Commit creation cancelled by user!'
} = {}) {
  outro(colors.magenta(exitMessage))
  process.exit(code)
}
