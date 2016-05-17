'use babel'

import RhymeEditor from './rhyme-editor'
import RhymingDictionary from './rhyming-dictionary'
import { CompositeDisposable } from 'atom'
import comments from './comments'

const api = {
  subscriptions: null,
  TARGET: 'atom-workspace',
  commands: {
    'rhyming-dictionary:find-perfect-rhymes': () => {
      const target = api.getCurrentWordOrSelection()
      api.showRhymes(target, 'perfect')
    },
    'rhyming-dictionary:find-near-rhymes': () => {
      const target = api.getCurrentWordOrSelection()
      api.showRhymes(target, 'near')
    },
    'rhyming-dictionary:find-all-rhymes': () => {
      const target = api.getCurrentWordOrSelection()
      api.showRhymes(target, 'all')
    }
  },

  activate (state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register commands
    this.subscriptions.add(atom.commands.add(this.TARGET, this.commands))
  },

  showRhymes (target, rhymeType) {
    const options = this.parseComments()
    RhymingDictionary.fetchRhymes(target).then(rhymingDictionary => {
      this.rhymeEditor = RhymeEditor.openTab(rhymingDictionary, rhymeType, options)
    })
  },

  parseComments () {
    const editor = atom.workspace.getActiveTextEditor()
    return comments.parse(editor.getText())
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
    this.rhymeEditor.destroy()
    this.subscriptions.dispose()
  },

  serialize () {}
}

export default api
