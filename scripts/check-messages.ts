import { lstat, readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import pico from 'picocolors'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const MESSAGES = join(ROOT, 'core', 'messages')

const IGNORE = new Set(['node_modules', 'coverage', 'dist', '.git', '.github'])

async function findFiles(
  dir: string,
  filter: RegExp,
  callback: (filename: string) => void
): Promise<void> {
  for (let name of await readdir(dir)) {
    if (IGNORE.has(name)) continue
    let filename = join(dir, name)
    let stat = await lstat(filename)
    if (stat.isDirectory()) {
      findFiles(filename, filter, callback)
    } else if (filter.test(name)) {
      callback(filename)
    }
  }
}

function check(all: Buffer, part: string, filename: string): void {
  if (!all.includes(part)) {
    let path = relative(ROOT, filename)
    process.stderr.write(pico.red(`${path} has no "${part}"\n`))
    process.exit(1)
  }
}

async function checkFile(filename: string): Promise<void> {
  let name = dirname(relative(MESSAGES, filename))
  let code = await readFile(filename)
  check(code, `export const ${name}Messages`, filename)
  check(code, `i18n('${name}', {`, filename)
}

if (process.argv.length > 2) {
  let files = process.argv.slice(2)
  for (let filename of files) {
    checkFile(filename)
  }
} else {
  findFiles(MESSAGES, /en.ts$/, checkFile)
}
