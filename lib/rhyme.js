'use babel'

import datamuse from './datamuse'
import RhymeView from './rhyme-view'
import {CompositeDisposable} from 'atom'

export default {
  rhymeView: null,
  modalPanel: null,
  subscriptions: null,
  isVisible: false,

  activate (state) {
    this.rhymeView = new RhymeView(state.rhymeViewState)
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.rhymeView.getElement(),
      visible: false
    })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'rhyme:perfect': () => this.findRhymes(this.getRhymeTarget(), 'perfect')
    }))
  },

  deactivate () {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.rhymeView.destroy()
  },

  serialize () {
    return {
      rhymeViewState: this.rhymeView.serialize()
    }
  },

  getRhymeTarget () {
    const editor = atom.workspace.getActiveTextEditor()
    const previousSelection = editor.getSelectedBufferRange()
    if (previousSelection.isEmpty()) {
      editor.moveToBeginningOfWord()
      editor.selectToEndOfWord()
    }
    const word = editor.getSelectedText()
    editor.setSelectedBufferRange(previousSelection)
    return word
  },

  findRhymes (word, rhymeType) {
    console.log(`Searching for rhymes with ${word}`)
    datamuse.get(word, rhymeType).then(rhymeData => {
      const rhymes = rhymeData.map(d => d.word).join('\n')
      console.log(JSON.stringify(rhymes))
      this.display(rhymes)
    })
  },

  display (words) {
    if (this.isVisible) {
      this.modalPanel.hide()
    } else {
      this.rhymeView.setContent(words)
      this.modalPanel.show()
    }
    this.isVisible = !this.isVisible
  }
}
