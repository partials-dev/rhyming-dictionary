'use babel'

import parseRhymeTypes from './parse-rhyme-types'
import conjoin from './conjoin'

export default class RhymeEditor {
  static createRhymingDictionary (rhymingDictionary, rhymeTypes) {
    const tabName = this.getTabName(rhymingDictionary.target, this.rhymeTypes)
    const opts = {split: 'right', activatePane: false}
    var rhymeEditor
    return atom.workspace.open(tabName, opts).then(editor => {
      rhymeEditor = new RhymeEditor()
      return rhymeEditor
    }).then((rhymeEditor) => {
      atom.workspace.activatePreviousPane()
      return rhymeEditor
    })
  }

  static getTabName (word, rhymeTypes) {
    rhymeTypes = parseRhymeTypes(rhymeTypes)

    function capitalize (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
    rhymeTypes = rhymeTypes.slice() // copy array
    rhymeTypes[0] = capitalize(rhymeTypes[0])
    const descriptors = conjoin(...rhymeTypes)
    return `${descriptors} rhymes for ${word}`
  }

  constructor (editor, rhymingDictionary, rhymeTypes) {
    this.rhymeTypes = parseRhymeTypes(rhymeTypes)
    this.editor = editor
    this.editor.setSoftWrapped(true)
    this.rhymingDictionary = rhymingDictionary
    this.update()
  }

  update () {
    this.editor.setText('')
    const groups = this.rhymingDictionary.getSyllableGroups(this.rhymeTypes)
    this.displaySyllableGroups(groups)
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

  // Tear down any state and detach
  destroy () {
    this.rhymingDictionary = null
    this.editor.destroy()
  }
}
