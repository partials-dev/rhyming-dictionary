'use babel'

import Swagger from 'swagger-client'

const wordnik = new Swagger({
  url: 'http://api.wordnik.com/v4/resources.json',
  usePromise: true,
  authorizations: {
    api_key: new Swagger.ApiKeyAuthorization('api_key', 'fcaaa4cd405403d85700608120e060487a6deec798c7d6846', 'query')
  }
})

export default {
  getSyllables (word) {
    return wordnik.then(client => {
      return client.word.getHyphenation({ word })
    })
  }
}
