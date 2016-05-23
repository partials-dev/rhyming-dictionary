'use babel'

// the
// the

export default {
  highlight (words) {
    const editor = atom.workspace.getActiveTextEditor()
    words.forEach((word) => {
      editor.scan(new RegExp(word, 'g'), (hit) => {
        const marker = editor.markBufferRange(hit.range)
        editor.decorateMarker(marker, { type: 'highlight', class: 'highlight-blue' })
      })
    })
    console.log(`highlighting ${JSON.stringify(words)}`)
  }
}
