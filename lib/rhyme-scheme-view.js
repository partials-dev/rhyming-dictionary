'use babel'

import analyzeRhymeScheme from './rhyme-scheme'
import { CompositeDisposable } from 'atom'

export default class RhymeSchemeView {
  constructor (editor) {
    this.editor = editor
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(this.editor.onDidStopChanging(this.update.bind(this)))

    this.markers = []

    this.subscriptions.add(this.editor.onDidDestroy(() => {
      this.cancelUpdate()
      this.removeDecorations()
      this.subscriptions.dispose()
    }))

    this.update()
  }

  update () {
    const lines = this.editor.getBuffer().getLines()
    analyzeRhymeScheme(lines).then(rhymes => {
      rhymes.forEach(rhyme => {
        rhyme.lines.forEach(lineNumber => {
          this.markLine(lineNumber, rhyme.colorClass)
        })
      })
    })
  }

  removeDecorations () {
    this.markers.forEach(marker => marker.destroy())
    this.markers = []
  }

  markLine (lineNumber, klass) {
    const options = { invalidate: 'never' }
    const marker = this.editor.markBufferRange([[lineNumber, 0], [lineNumber, 0]], options)
    this.editor.decorateMarker(marker, { type: 'line-number', class: klass })
    this.markers.push(marker)
  }

  cancelUpdate () {

  }

  toggle () {
    if (this.isVisible) {
      this.hide()
    } else {
      this.show()
    }
  }

  show () {
    this.isVisible = true
    this.update()
  }

  hide () {
    this.isVisible = false
    this.update()
  }
}
