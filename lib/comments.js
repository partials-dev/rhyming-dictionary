'use babel'

const COMMENT_DELIMITER = '#'
const KEYS = {
  SIMILAR_TO: 'like'
}

export default {
  COMMENT_DELIMITER,
  KEYS,

  parse (text) {
    const parsedLines = this.getCommentLines(text).map(line => this.parseLine(line))
    return parsedLines.reduce((parsed, parsedLine) => {
      Object.keys(parsedLine).forEach((key) => {
        if (!parsed[key]) parsed[key] = []
        parsed[key] = parsed[key].concat(parsedLine[key])
      })
      return parsed
    }, {})
  },

  parseLine (line) {
    if (this.isComment(line)) {
      const key = this.getKey(line)
      const values = this.getValues(line)
      return {
        [key]: values
      }
    } else {
      return {}
    }
  },

  getCommentLines (string) {
    return string.split('\n').filter(this.isComment.bind(this))
  },

  isComment (line) {
    return (line.trim()[0] === this.COMMENT_DELIMITER)
  },

  getKey (line) {
    if (this.isComment(line)) {
      // get all known keys
      const knownKeys = Object.keys(KEYS).map(keyId => KEYS[keyId])

      // get location of every known key in line
      const keyLocations = knownKeys.map(key => {
        var location = line.indexOf(key)
        if (location < 0) {
          location = Infinity
        }
        return { key, location }
      })

      // get first occurrence of a known key
      const earliestKeyLocation = keyLocations.reduce((earliest, keyLocation) => {
        if (keyLocation.location < earliest.location) {
          return keyLocation
        } else {
          return earliest
        }
      })

      return earliestKeyLocation.key
    } else {
      return null
    }
  },

  getValues (line) {
    if (this.isComment(line)) {
      const spaceLocations = []
      for (var i = 0; i < line.length; i++) {
        if (/\s/g.test(line[i])) {
          spaceLocations.push(i)
        }
      }
      const key = this.getKey(line)
      const keyLocation = line.indexOf(key)
      const firstSpaceAfterKeyLocation = spaceLocations.sort((a, b) => a - b).filter(i => i >= keyLocation)[0]
      const values = line.substring(firstSpaceAfterKeyLocation).split(',').map(s => s.trim())
      return values
    } else {
      return []
    }
  }
}
