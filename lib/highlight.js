'use babel'

export default function highlight (words) {
  const editor = atom.workspace.getActiveTextEditor()
  words.forEach((word) => {
    const similarity = word.similarity
    const regex = new RegExp(`\\b${word.token}\\b`, 'gi')
    editor.scan(regex, (hit) => {
      const marker = editor.markBufferRange(hit.range)
      editor.decorateMarker(marker, { type: 'highlight', class: `${similarity}-similar` })
    })
  })
}
