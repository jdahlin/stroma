import type { ChildProcess } from 'node:child_process'
import type { FSWatcher } from 'node:fs'
import { spawn } from 'node:child_process'
import { watch } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

async function startDev(): Promise<void> {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const projectRoot = resolve(scriptDir, '..')
  process.chdir(projectRoot)

  // Build and watch renderer, preload, and main using pnpm filters
  const spawnPnpm = (
    args: string[],
    options?: { env?: NodeJS.ProcessEnv, stdio?: 'inherit' | 'pipe' },
  ): ChildProcess =>
    spawn('pnpm', args, {
      stdio: options?.stdio ?? 'inherit',
      env: options?.env ? { ...process.env, ...options.env } : process.env,
    })

  const runPnpm = (args: string[], label: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const child = spawnPnpm(args, { stdio: 'inherit' })
      child.on('exit', (code) => {
        if (code === 0) {
          console.log(`[${label}] Completed.`)
          resolve()
        }
        else {
          reject(new Error(`${label} exited with code ${code ?? 'unknown'}`))
        }
      })
    })

  const runPnpmCheck = (args: string[], label: string, env?: NodeJS.ProcessEnv): Promise<boolean> =>
    new Promise((resolve) => {
      const child = spawnPnpm(args, { stdio: 'inherit', env })
      child.on('exit', (code) => {
        if (code === 0) {
          console.log(`[${label}] Completed.`)
          resolve(true)
        }
        else {
          console.warn(`[${label}] Failed (code ${code ?? 'unknown'}).`)
          resolve(false)
        }
      })
    })

  // Initial builds
  await Promise.all([
    runPnpm(['-s', '--filter', '@repo/renderer', 'build'], 'renderer build'),
    runPnpm(['-s', '--filter', '@repo/preload', 'build'], 'preload build'),
    runPnpm(['-s', '--filter', '@repo/main', 'build'], 'main build'),
  ])

  const nativeOk = await runPnpmCheck(
    ['-s', '--filter', '@repo/main', 'exec', 'electron', '-e', 'require("better-sqlite3")'],
    'main native check',
    { ELECTRON_RUN_AS_NODE: '1' },
  )
  if (!nativeOk) {
    await runPnpm(['-s', '--filter', '@repo/main', 'rebuild:electron'], 'main native rebuild')
  }

  // Watchers
  const rendererDev: ChildProcess = spawnPnpm(['--filter', '@repo/renderer', 'dev'])
  const preloadWatch: ChildProcess = spawnPnpm(['--filter', '@repo/preload', 'exec', 'esbuild', 'src/index.ts', '--bundle', '--platform=node', '--format=cjs', '--sourcemap', '--tsconfig=tsconfig.json', '--outfile=dist/index.cjs', '--external:electron', '--conditions=import', '--watch'])
  const mainWatch: ChildProcess = spawnPnpm([
    '--filter',
    '@repo/main',
    'exec',
    'esbuild',
    'src/index.ts',
    '--bundle',
    '--platform=node',
    '--format=esm',
    '--sourcemap',
    '--tsconfig=tsconfig.json',
    '--outfile=dist/index.mjs',
    '--external:electron',
    '--external:better-sqlite3',
    '--conditions=import',
    '--watch',
  ])

  let electron: ChildProcess | null = null
  let restartTimer: NodeJS.Timeout | null = null
  let stopping = false
  let restartEnabled = false
  let watchers: FSWatcher[] = []

  // Handle process termination
  const cleanup = (): void => {
    stopping = true
    for (const watcher of watchers) {
      watcher.close()
    }
    if (electron) {
      electron.kill()
    }
    rendererDev.kill()
    preloadWatch.kill()
    mainWatch.kill()
    process.exit()
  }

  const startElectron = (): void => {
    electron = spawnPnpm(['--filter', '@repo/main', 'exec', 'electron', '.'], {
      env: { VITE_DEV_SERVER_URL: 'http://localhost:5173' },
    })
    electron.on('close', () => {
      electron = null
      if (!stopping) {
        cleanup()
      }
    })
  }

  const restartElectron = (): void => {
    if (!electron) {
      startElectron()
      return
    }
    electron.once('close', () => {
      if (!stopping) {
        startElectron()
      }
    })
    electron.kill()
  }

  const scheduleRestart = (): void => {
    if (!restartEnabled) {
      return
    }
    if (restartTimer) {
      clearTimeout(restartTimer)
    }
    restartTimer = setTimeout(() => {
      restartTimer = null
      restartElectron()
    }, 200)
  }

  // Watch built files to restart electron
  const watchDirs = [
    resolve(projectRoot, 'apps/main/dist'),
    resolve(projectRoot, 'apps/preload/dist')
  ]
  watchers = watchDirs.map(dir => watch(dir, { persistent: true }, scheduleRestart))

  startElectron()
  setTimeout(() => {
    restartEnabled = true
  }, 1000)

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}

startDev().catch((error: unknown) => {
  console.error('Failed to start dev server:', error)
  process.exit(1)
})
