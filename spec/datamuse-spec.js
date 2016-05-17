'use babel'

import datamuse from '../lib/datamuse'

describe('Datamuse', () => {
  describe('.getRhymes', () => {
    it('returns a Promise', () => {
      const promise = datamuse.getRhymes('test')
      expect(promise.constructor.name).toEqual('Promise')
    })

    it('returns an Object with data about all possible rhyme types', () => {
      const fakePerfectRhymes = [{word: 'manifest', score: 1221, numSyllables: 3}]
      const fakeNearRhymes = [{word: 'bereft', score: 622, numSyllables: 2}]
      const matchPerfectRhymeIds = new RegExp(datamuse.__testonly__.rhymeTypeIds.perfect)
      const matchNearRhymeIds = new RegExp(datamuse.__testonly__.rhymeTypeIds.near)

      function fakeHttpGet (url) {
        if (matchPerfectRhymeIds.test(url)) {
          return Promise.resolve({ data: JSON.stringify(fakePerfectRhymes) })
        } else if (matchNearRhymeIds.test(url)) {
          return Promise.resolve({ data: JSON.stringify(fakeNearRhymes) })
        } else {
          throw new Error('Attempted to get datamuse rhymes of unknown rhyme type')
        }
      }

      spyOn(datamuse.__testonly__.get, 'default').andCallFake(fakeHttpGet)

      var rhymes
      runs(() => {
        datamuse.getRhymes('test').then((r) => {
          rhymes = r
        }) // then
      }) // runs

      waitsFor(() => !!rhymes, 'rhyme retrieval', 1000)

      runs(() => {
        expect(rhymes).toEqual({ perfect: fakePerfectRhymes, near: fakeNearRhymes })
      })
    }) // it
  })
})
