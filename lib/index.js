'use babel'

import RhymeEditor from './rhyme-editor'
import RhymingDictionary from './rhyming-dictionary'
import { CompositeDisposable } from 'atom'

export default {
  panel: null,
  subscriptions: null,
  isVisible: false,

  activate (state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    const commands = {
      'rhyme:perfect': () => this.getRhymes('perfect'),
      'rhyme:near': () => this.getRhymes('near'),
      'rhyme:all': () => this.getRhymes('all')
    }

    // Register commands
    this.subscriptions.add(atom.commands.add('atom-workspace', commands))
  },

  getRhymes (rhymeType) {
    const target = this.getCurrentWordOrSelection()
    RhymingDictionary.fetchRhymes(target).then(rhymingDictionary => {
      this.rhymeEditor = new RhymeEditor(rhymingDictionary, rhymeType)
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
    this.rhymeEditor.destroy()
    this.subscriptions.dispose()
  },

  serialize () {}
}
