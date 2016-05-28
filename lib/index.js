'use babel'

import RhymeEditor from './rhyme-editor'
import RhymingDictionary from './rhyming-dictionary'
import { CompositeDisposable } from 'atom'
import CommentParser from './comment-parser'
import genius from './genius'

const api = {
  subscriptions: null,
  target: 'atom-workspace',
  config: {
    geniusAuthToken: {
      title: 'Genius Auth Token',
      description: 'Allows us to pull lyrics from the Genius API',
      type: 'string',
      default: ''
    }
  },
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
    },
    'rhyming-dictionary:clear-genius-permissions': () => {
      genius.deauthenticate()
    },
    'rhyming-dictionary:clear-genius-cache': () => {
      genius.clearCache()
    },
    'rhyming-dictionary:highlight': () => {
      genius.highlight()
    },
    'rhyming-dictionary:lyrics': () => {
      const artist = api.getCurrentWordOrSelection()
      genius.lyrics('Fleet Foxes')
    }
  },

  activate (state) {
    if (!state) state = {}
    genius.activate(state.genius)

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
    return new CommentParser().parse(editor.getText())
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
      genius: genius.serialize()
    }
  }
}

export default api
