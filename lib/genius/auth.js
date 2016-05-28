'use babel'

import Shell from 'shell'
import childProcess from 'child_process'

export default {
  authTokenPromise: null,
  activate (state) {
    if (!state) state = {}
    // don't start server if running tests
    // it causes an error for some reason
    if (atom.inSpecMode()) return
    if (!process.env.GENIUS_AUTH_TOKEN) {
      process.env.GENIUS_AUTH_TOKEN = state.geniusAuthToken
    }
    this.spawnServer()
    this.startLogging()
  },
  deactivate () {
    this.killServer()
  },
  deauthenticate () {
    this.authTokenPromise = null
    process.env.GENIUS_AUTH_TOKEN = null
  },
  serialize () {
    return {
      geniusAuthToken: process.env.GENIUS_AUTH_TOKEN
    }
  },
  openPath (filePath) {
    const processArchitecture = process.platform
    switch (processArchitecture) {
      case 'darwin':
        childProcess.exec(`open "${filePath}"`)
        break
      case 'linux':
        childProcess.exec(`xdg-open "${filePath}"`)
        break
      case 'win32': Shell.openExternal(`file:///${filePath}`)
        break
    }
  },
  authenticate () {
    const configToken = atom.config.get('rhyming-dictionary.geniusAuthToken')
    if (configToken) {
      return Promise.resolve(configToken)
    } else if (!this.authTokenPromise) {
      this.openPath('http://localhost:3000/auth/genius')
      this.authTokenPromise = {}
      this.authTokenPromise.promise = new Promise((resolve, reject) => {
        this.authTokenPromise.resolve = resolve
        this.authTokenPromise.reject = reject
      })
    }
    return this.authTokenPromise.promise
  },
  spawnServer () {
    const serverPath = __dirname
    const serverProcess = childProcess.spawn('node', ['auth-server'], { cwd: serverPath })
    this.serverProcess = serverProcess
  },
  startLogging () {
    this.serverProcess.stdout.setEncoding('utf8')
    this.serverProcess.stdout.on('data', (data) => {
      try {
        const parsed = JSON.parse(data)
        if (parsed.geniusAuthToken) {
          process.env.GENIUS_AUTH_TOKEN = parsed.geniusAuthToken
          this.authTokenPromise.resolve(parsed.geniusAuthToken)
        } else {
          console.log(`server stdout: ${data}`)
        }
      } catch (err) {
        console.log(`server stdout: ${data}`)
      }
    })

    this.serverProcess.stderr.on('data', (data) => {
      console.log(`server stderr: ${data}`)
    })

    this.serverProcess.on('close', (code) => {
      console.log(`server child process exited with code ${code}`)
    })
  },
  killServer () {
    if (this.serverProcess) this.serverProcess.kill()
  }
}
