'use babel'

export default class RhymeEditor {
  static openTab (targetWord) {
    const tabName = `Rhymes for '${targetWord}'`
    const opts = {split: 'right', activatePane: false}
    var rhymeEditor
    return atom.workspace.open(tabName, opts).then(editor => {
      rhymeEditor = new RhymeEditor(editor)
      return rhymeEditor
    }).then((rhymeEditor) => {
      atom.workspace.activatePreviousPane()
      return rhymeEditor
    })
  }

  constructor (editor, rhymingDictionary) {
    this.editor = editor
    this.editor.setSoftWrapped(true)
    this.rhymingDictionary = rhymingDictionary
  }

  get rhymingDictionary () {
    return this._rhymingDictionary
  }

  set rhymingDictionary (rhymingDictionary) {
    this._rhymingDictionary = rhymingDictionary
    this.update()
  }

  update () {
    this.editor.setText('')
    this.waitingForContent = !this.rhymingDictionary
    if (this.waitingForContent) {
      this.displayWaiting()
    } else {
      const groups = this.rhymingDictionary.getSyllableGroups(this.rhymeTypes)
      this.displaySyllableGroups(groups)
    }
  }

  displaySyllableGroups (groups) {
    groups.forEach((group, i) => {
      const heading = this.getSyllableHeading(i)
      this.editor.insertText(heading)
      this.editor.insertNewline()
      this.editor.insertText(group.join(', '))
      this.editor.insertNewline()
      if (i !== groups.length - 1) {
        this.editor.insertNewline()
      }
    })
    this.editor.moveToTop()
  }

  getSyllableHeading (numberOfSyllables) {
    var syllables
    if (numberOfSyllables === 1) {
      syllables = 'SYLLABLE\n----------'
    } else {
      syllables = 'SYLLABLES\n-----------'
    }
    return `${numberOfSyllables} ${syllables}`
  }

  displayWaiting () {
    let i = 0
    // if already displaying waiting message, do nothing
    if (this.isDisplayingWaiting) return

    const spin = () => {
      if (this.waitingForContent) {
        i = (i + 1) % 3
        let ellipsis = '.'.repeat(i + 1)
        let message = 'fetching fresh rhymes' + ellipsis
        this.editor.setText(message)
      } else {
        clearInterval(intervalId)
        this.isDisplayingWaiting = false
      }
    }

    const intervalId = setInterval(spin, 500)
    spin()
    this.isDisplayingWaiting = true
  }

  // Tear down any state and detach
  destroy () {
    this.rhymingDictionary = null
    this.editor.destroy()
  }
}
