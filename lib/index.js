'use babel'

import RhymeEditor from './rhyme-editor'
import RhymingDictionary from './rhyming-dictionary'
import { CompositeDisposable } from 'atom'
import CommentParser from './comment-parser'
import genius from './genius'
import spotify from './spotify'
import auth from './auth'
import ling from './ling'
import highlight from './highlight'

const foreground = "On the way to your brother's house in the valley, dear By the river bridge a cradle floating beside me In the whitest water on the banks against the stone You will lift his body from the shore and bring him home Oliver James washed in the rain no longer Oliver James washed in the rain no longer On the kitchen table that your grandfather did make You and your delicate way will slowly clean his fate And you will remember when you rehearsed the actions of A innocent and anxious mother full of anxious love Walk with me down the beach and through the valley floor Love for the one you know more Love for the one you know more Back we go to your brother's house emptier my dear The sound of ancient voices ringing soft upon your ear"

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
      }).then((songs) => {
        const lyrics = songs.map((song) => song.lyrics)
        const clusters = ling.compare(foreground, lyrics).clusters()
        const highlightClusters = clusters.filter((term) => {
          return term.weightCategory !== 'lowest'
        }).map((term) => {
          term.strength = term.weightCategory
          return term
        })
        highlight(highlightClusters)
      })
    },
    'rhyming-dictionary:nlp': () => {
      const fore = 'A web derp engine is a science system.'
      const aft = [
        'A web search engine is a software system that is designed to search for information on the World Wide Web. The search results are generally presented in a line of results often referred to as search engine results pages (SERPs).',
        'In mathematics and computer science, an algorithm (Listeni/ˈælɡərɪðəm/ al-gə-ri-dhəm) is a self-contained step-by-step set of operations to be performed. Algorithms perform calculation, data processing, and/or automated reasoning tasks.'
      ]
      const tfidf = ling.compare(fore, aft)
      console.log(JSON.stringify(tfidf))
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
