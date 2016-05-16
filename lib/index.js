'use babel'

import RhymeEditor from './rhyme-editor'
import RhymingDictionary from './rhyming-dictionary'
import { CompositeDisposable } from 'atom'
import comments from './comments'

export default {
  panel: null,
  subscriptions: null,
  isVisible: false,

  activate (state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    const commands = {
      'rhyming-dictionary:find-perfect-rhymes': () => this.getRhymes('perfect'),
      'rhyming-dictionary:find-near-rhymes': () => this.getRhymes('near'),
      'rhyming-dictionary:find-all-rhymes': () => this.getRhymes('all')
    }

    // Register commands
    this.subscriptions.add(atom.commands.add('atom-workspace', commands))
  },

  getRhymes (rhymeType) {
    const options = this.getComments()
    const target = this.getCurrentWordOrSelection()
    RhymingDictionary.fetchRhymes(target).then(rhymingDictionary => {
      this.rhymeEditor = new RhymeEditor(rhymingDictionary, rhymeType, options)
    })
  },

  getComments () {
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
