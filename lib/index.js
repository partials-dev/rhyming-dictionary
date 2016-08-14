'use babel'

import { CompositeDisposable } from 'atom'
import RhymeSchemeView from './rhyme-scheme-view'

export default {
  activate (state) {
    if (!state) state = {}
    this.subscriptions = new CompositeDisposable()

    atom.workspace.observeTextEditors(editor => {
      const view = new RhymeSchemeView(editor)
      const subscription = atom.commands.add(atom.views.getView(editor), 'rhyme-scheme:toggle', () => view.toggle())
      this.subscriptions.add(subscription)
    })
  },

  deactivate () {
    this.subscriptions.dispose()
  },

  serialize () {
    return {}
  }
}
