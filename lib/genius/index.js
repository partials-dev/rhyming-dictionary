'use babel'

import auth from './auth'

export default {
  activate () {
    auth.activate()
  },
  deactivate () {
    auth.deactivate()
  },
  authenticate () {
    auth.authenticate()
  }
}
