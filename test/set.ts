
import assert from 'assert'
import { Config } from '../src'

let config: any

describe('config.set(key, value)', () => {
  beforeEach(() => {
    config = new Config()
  })

  it('should set a simple entry', () => {
    assert(!config._data.foo)

    config.set('foo', 'bar')

    assert(config._data.foo)
    assert.equal(config._data.foo, 'bar')
  })

  it('should override a previous entry', () => {
    config.set('foo', 'bar')
    config.set('foo', 'buzz')

    assert.equal(config._data.foo, 'buzz')
  })

  describe('when a nested key provided', () => {
    it('should add a nested entry', () => {
      config.set('foo.bar', 123)

      assert(config._data.foo)
      assert(config._data.foo.bar)
      assert.equal(config._data.foo.bar, 123)
    })

    it('should override a previous nested key', () => {
      config.set('a', { b: { c: true } })

      assert(config._data.a.b.c)

      config.set('a.b', false)

      assert(!config._data.a.b)
    })
  })
})
