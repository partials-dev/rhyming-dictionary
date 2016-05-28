'use babel'

import nlp from 'nlp_compromise'
import corpus from './corpus'
import comparison from './comparison'

nlp.plugin(corpus)
nlp.plugin(comparison)

export default {
  compare (foreground, background) {
    return nlp.text(foreground).compare(background).terms()
  }
}
