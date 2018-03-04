
import assert from 'assert'
import { Config } from '../src'

let config: any

describe('config.get(key, defaultValue)', () => {
  beforeEach(() => {
    config = new Config()
  })

  it('should return the value of the given key', () => {
    config.set('foo', 'bar')

    assert.equal(config.get('foo', 'booom'), 'bar')
  })

  describe('when nested key', () => {
    it('should return the value as deep as needed', () => {
      config = new Config({ a: { b: { c: true } } })

      assert.deepEqual(config.get('a.b'), { c: true })
      assert.equal(config.get('a.b.c'), true)
    })
  })

  describe('when the key is not registered', () => {
    beforeEach(() => {
      config.set('a', { b: 123 })
    })

    it('should return "undefined"', () => {
      assert(!config.get('x.y'))
    })

    it('should return the "defaultValue" if provided', () => {
      assert.equal(config.get('a.c', 'buzz'), 'buzz')
    })
  })
})
