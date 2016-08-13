'use babel'

import RhymeEditor from './rhyme-editor'
import RhymingDictionary from './rhyming-dictionary'
import { CompositeDisposable } from 'atom'

const api = {
  subscriptions: null,
  target: 'atom-workspace',
  commands: {
    'rhyming-dictionary:find-rhymes': () => {
      const target = api.getCurrentWordOrSelection()
      api.showRhymes(target)
    }
  },

  activate (state) {
    if (!state) state = {}
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register commands
    const commandsSubscription = atom.commands.add(this.target, this.commands)
    this.subscriptions.add(commandsSubscription)
  },

  showRhymes (target) {
    RhymeEditor.openTab(target).then((rhymeEditor) => {
      this.rhymeEditor = rhymeEditor
      return rhymeEditor
    }).then(() => {
      return RhymingDictionary.fetchRhymes(target)
    }).then((rhymingDictionary) => {
      this.rhymeEditor.rhymingDictionary = rhymingDictionary
    })
  },

  getCurrentWordOrSelection () {
    const editor = atom.workspace.getActiveTextEditor()
    const previousSelection = editor.getSelectedBufferRange()
    if (previousSelection.isEmpty()) {
      editor.selectWordsContainingCursors()
    }
    const word = editor.getSelectedText()
    editor.setSelectedBufferRange(previousSelection)
    return word
  },

  deactivate () {
    if (this.rhymeEditor) this.rhymeEditor.destroy()
    this.subscriptions.dispose()
  },

  serialize () {
    return { }
  }
}

export default api
