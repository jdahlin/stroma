import { type ChildProcess, spawn } from 'node:child_process'
import { type FSWatcher, watch } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { createServer, type ViteDevServer } from 'vite'

async function startDev(): Promise<void> {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const appRoot = resolve(scriptDir, '..')
  process.chdir(appRoot)

  process.env.VITE_CLEAR_SCREEN = 'false'

  // Start Vite dev server
  const vite: ViteDevServer = await createServer({
    configFile: 'vite.config.ts',
    server: { port: 5173 },
  })
  await vite.listen()

  // Build main and preload in watch mode
  const spawnPnpmExec = (
    args: string[],
    options?: { env?: NodeJS.ProcessEnv, stdio?: 'inherit' | 'pipe' },
  ): ChildProcess =>
    spawn('pnpm', ['exec', ...args], {
      stdio: options?.stdio ?? 'inherit',
      env: options?.env ? { ...process.env, ...options.env } : process.env,
    })

  const runPnpmExec = (args: string[], label: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const child = spawnPnpmExec(args, { stdio: 'inherit' })
      child.on('exit', (code) => {
        if (code === 0) {
          resolve()
        }
        else {
          reject(new Error(`${label} exited with code ${code ?? 'unknown'}`))
        }
      })
    })

  const buildMainArgs = [
    'esbuild',
    'src/main/index.ts',
    '--bundle',
    '--platform=node',
    '--format=cjs',
    '--sourcemap',
    '--tsconfig=tsconfig.main.json',
    '--outfile=dist/main/index.js',
    '--external:electron',
    '--log-level=error',
  ]

  const buildPreloadArgs = [
    'esbuild',
    'src/preload/index.ts',
    '--bundle',
    '--platform=node',
    '--format=cjs',
    '--sourcemap',
    '--tsconfig=tsconfig.preload.json',
    '--outfile=dist/preload/index.js',
    '--external:electron',
    '--log-level=error',
  ]

  await runPnpmExec(buildMainArgs, 'main build')
  await runPnpmExec(buildPreloadArgs, 'preload build')

  const mainWatch: ChildProcess = spawnPnpmExec([...buildMainArgs, '--watch'])
  const preloadWatch: ChildProcess = spawnPnpmExec([...buildPreloadArgs, '--watch'])

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
    mainWatch.kill()
    preloadWatch.kill()
    void vite.close()
    process.exit()
  }

  const startElectron = (): void => {
    electron = spawnPnpmExec(['electron', '.'], {
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

  const watchDirs = [resolve(appRoot, 'dist/main'), resolve(appRoot, 'dist/preload')]
  watchers = watchDirs.map(dir => watch(dir, { persistent: true }, scheduleRestart))

  startElectron()
  setTimeout(() => {
    restartEnabled = true
  }, 500)

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}

startDev().catch((error: unknown) => {
  console.error('Failed to start dev server:', error)
  process.exit(1)
})
