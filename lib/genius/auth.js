'use babel'

import Shell from 'shell'
import childProcess from 'child_process'

export default {
  authCodePromise: null,
  activate () {
    // don't start server if running tests
    // causes an error for some reason
    if (atom.inSpecMode()) return
    this.spawnServer()
    this.startLogging()
  },
  deactivate () {
    this.killServer()
  },
  deauthenticate () {
    this.authCodePromise = null
    process.env.GENIUS_AUTH_CODE = null
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
    if (process.env.GENIUS_AUTH_CODE) {
      return Promise.resolve(process.env.GENIUS_AUTH_CODE)
    } else if (!this.authCodePromise) {
      this.openPath('http://localhost:3000/auth/genius')
      this.authCodePromise = {}
      this.authCodePromise.promise = new Promise((resolve, reject) => {
        this.authCodePromise.resolve = resolve
        this.authCodePromise.reject = reject
      })
    }
    return this.authCodePromise.promise
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
        if (parsed.geniusAuthCode) {
          process.env.GENIUS_AUTH_CODE = parsed.geniusAuthCode
          this.authCodePromise.resolve(parsed.geniusAuthCode)
        } else {
          console.log(`server stdout: ${data}`)
        }
      } catch (err) {
        console.log(`server stdout: ${data}`)
        this.authCodePromise.reject(data)
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
