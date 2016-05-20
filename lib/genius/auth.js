'use babel'

import Shell from 'shell'
import childProcess from 'child_process'

export default {
  geniusAuthCode: null,
  activate () {
    this.spawnServer()
    this.startLogging()
  },
  deactivate () {
    this.killServer()
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
    if (!this.geniusAuthCode) this.openPath('http://localhost:3000/auth/genius')
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
          this.geniusAuthCode = parsed.geniusAuthCode
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
    this.serverProcess.kill()
  }
}
