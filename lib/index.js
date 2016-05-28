'use babel'

import RhymeEditor from './rhyme-editor'
import RhymingDictionary from './rhyming-dictionary'
import { CompositeDisposable } from 'atom'
import CommentParser from './comment-parser'
import genius from './genius'
import spotify from './spotify'
import auth from './auth'
import ling from './ling'

const api = {
  subscriptions: null,
  target: 'atom-workspace',
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
    'rhyming-dictionary:clear-permissions': () => {
      genius.deauthenticate()
      auth.deauthenticate()
    },
    'rhyming-dictionary:clear-genius-cache': () => {
      genius.clearCache()
    },
    'rhyming-dictionary:highlight': () => {
      genius.highlight()
    },
    'rhyming-dictionary:lyrics': () => {
      genius.lyrics('Fleet Foxes', 'Your Protector')
    },
    'rhyming-dictionary:playlist': () => {
      spotify.playlist('1230043178', '3J6RSlxKFjHgQJ73bRMcHu').then((tracks) => {
        return genius.lyrics(tracks)
      }).then((lyrics) => {
        console.log(JSON.stringify(lyrics))
      })
    },
    'rhyming-dictionary:nlp': () => {
      const foreground = 'In information retrieval, tf–idf, short for term frequency–inverse document frequency, is a numerical statistic that is intended to reflect how important a word is to a document in a collection or corpus.'
      const background = [
        'A web search engine is a software system that is designed to search for information on the World Wide Web. The search results are generally presented in a line of results often referred to as search engine results pages (SERPs).',
        'In mathematics and computer science, an algorithm (Listeni/ˈælɡərɪðəm/ al-gə-ri-dhəm) is a self-contained step-by-step set of operations to be performed. Algorithms perform calculation, data processing, and/or automated reasoning tasks.'
      ]
      const tfidf = ling.compare(foreground, background)
    }
  },

  activate (state) {
    if (!state) state = {}
    genius.activate(state.genius)
    auth.activate(['spotify', 'genius'])

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
    auth.deactivate()
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
