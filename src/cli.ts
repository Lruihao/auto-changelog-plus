#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { run } from 'auto-changelog/src/run.js'

const argv: string[] = process.argv
const __root: string = dirname(dirname(fileURLToPath(import.meta.url)))

// Check for version flag
if (argv.includes('-V') || argv.includes('--version')) {
  const packageJsonPath: string = join(__root, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  console.log(packageJson.version)
  process.exit(0)
}

const configPath: string = join(__root, 'settings/config.json')
const templatePath: string = join(__root, 'settings/conventional.hbs')
const setupPath: string = join(__root, 'settings/setup.cjs')

// Add default config, template and setup if not provided
if (!argv.includes('--config') && !argv.includes('-c')) {
  argv.push('--config', configPath)
}
if (!argv.includes('--template') && !argv.includes('-t')) {
  argv.push('--template', templatePath)
}
if (!argv.includes('--handlebars-setup')) {
  argv.push('--handlebars-setup', setupPath)
}

run(argv).catch((error) => {
  console.log('\n')
  console.error(error)
  process.exit(1)
})
