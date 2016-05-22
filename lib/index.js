'use babel'

import RhymeEditor from './rhyme-editor'
import RhymingDictionary from './rhyming-dictionary'
import { CompositeDisposable } from 'atom'
import comments from './comments'
import genius from './genius'

const api = {
  subscriptions: null,
  target: 'atom-workspace',
  commands: {
    'rhyming-dictionary:find-perfect-rhymes': () => {
      const target = api.getCurrentWordOrSelection()
      api.showRhymes(target, 'perfect')
      genius.authenticate()
    },
    'rhyming-dictionary:find-near-rhymes': () => {
      const target = api.getCurrentWordOrSelection()
      api.showRhymes(target, 'near')
    },
    'rhyming-dictionary:find-all-rhymes': () => {
      const target = api.getCurrentWordOrSelection()
      api.showRhymes(target, 'all')
    },
    'rhyming-dictionary:clear-genius-permissions': () => {
      genius.deauthenticate()
    }
  },

  activate (state) {
    if (!state) state = {}
    genius.activate(state.geniusAuthCode)

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register commands
    const commandsSubscription = atom.commands.add(this.target, this.commands)
    this.subscriptions.add(commandsSubscription)
  },

  showRhymes (target, rhymeType) {
    const options = this.parseComments()
    RhymeEditor.openTab(rhymeType, target, options).then((rhymeEditor) => {
      this.rhymeEditor = rhymeEditor
      return rhymeEditor
    }).then(() => {
      return RhymingDictionary.fetchRhymes(target)
    }).then((rhymingDictionary) => {
      this.rhymeEditor.rhymingDictionary = rhymingDictionary
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
    genius.deactivate()
    if (this.rhymeEditor) this.rhymeEditor.destroy()
    this.subscriptions.dispose()
  },

  serialize () {
    return {
      geniusAuthCode: process.env.GENIUS_AUTH_CODE
    }
  }
}

export default api
