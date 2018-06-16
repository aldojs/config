
import 'mocha'
import assert from 'assert'
import { Store, Literal } from '../../src'

describe('unit test the store', () => {
  describe('store.enable(key)', () => {
    let map: Literal
    let config: Store

    it('should set a new property', () => {
      config = new Store(map = {})

      config.enable('foo')

      assert.ok('foo' in map)
      assert.equal(map.foo, true)
    })

    describe('when the key is an object', () => {
      it('should set the "enabled" property to "true"', () => {
        config = new Store(map = {
          foo: {
            'bar': false
          }
        })

        config.enable('foo')

        assert.deepEqual(map, {
          foo: {
            bar: false,
            enabled: true
          }
        })
      })
    })
  })

  describe('store.enabled(key)', () => {
    it('should return "true"', () => {
      let config = new Store({
        a: 25,
        b: true,
        c: {
          d: 'foo',
        },
        e: {
          enabled: true,
        }
      })

      assert.equal(config.enabled('a'), true)
      assert.equal(config.enabled('b'), true)
      assert.equal(config.enabled('c'), true)
      assert.equal(config.enabled('e'), true)
    })

    it('should return "false"', () => {
      let config = new Store({
        a: 0,
        b: false,
        c: {
          enabled: false,
        }
      })

      assert.equal(config.enabled('a'), false)
      assert.equal(config.enabled('b'), false)
      assert.equal(config.enabled('c'), false)
    })
  })

  describe('store.disable(key)', () => {
    let map: Literal
    let config: Store

    it('should set a new property', () => {
      config = new Store(map = {})

      config.disable('foo')

      assert.ok('foo' in map)
      assert.equal(map.foo, false)
    })

    describe('when the key is an object', () => {
      it('should set the "enabled" property to "false"', () => {
        config = new Store(map = {
          foo: {
            'bar': false
          }
        })

        config.disable('foo')

        assert.deepEqual(map, {
          foo: {
            bar: false,
            enabled: false
          }
        })
      })
    })
  })

  describe('store.disabled(key)', () => {
    it('should return "true"', () => {
      let config = new Store({
        a: 0,
        b: false,
        c: {
          enabled: false,
        }
      })

      assert.equal(config.disabled('a'), true)
      assert.equal(config.disabled('b'), true)
      assert.equal(config.disabled('c'), true)
    })

    it('should return "false"', () => {
      let config = new Store({
        a: 25,
        b: true,
        c: {
          d: 'foo',
        },
        e: {
          enabled: true,
        }
      })

      assert.equal(config.disabled('a'), false)
      assert.equal(config.disabled('b'), false)
      assert.equal(config.disabled('c'), false)
      assert.equal(config.disabled('e'), false)
    })
  })

  describe('store.merge(object)', () => {
    it('should merge settings', () => {
      let map = {
        a: true,
        b: {
          c: [ 123 ]
        }
      }

      let conf = new Store(map)

      conf.merge({
        a: false,
        b: {
          c: 456,
          d: true
        },
        e: {
          f: 'foo'
        }
      })

      assert.deepEqual(map, {
        a: false,
        b: {
          c: [ 123, 456 ],
          d: true
        },
        e: {
          f: 'foo'
        }
      })
    })

    it('should merge with another store', () => {
      let map = {
        a: true,
        b: {
          c: [ 123 ]
        }
      }

      let a = new Store(map)

      a.merge(new Store({
        a: false,
        b: { c: 456 },
        d: {
          enabled: true,
          data: [1, 2, 3]
        }
      }))

      assert.deepEqual(map, {
        a: false,
        b: {
          c: [ 123, 456 ]
        },
        d: {
          enabled: true,
          data: [ 1, 2, 3 ]
        }
      })
    })
  })

  describe('store.set(key, value)', () => {
    let config: Store
    let map: Literal

    beforeEach(() => {
      config = new Store(map = {})
    })

    it('should set a simple entry', () => {
      config.set('foo', 'bar')

      assert.equal(map.foo, 'bar')
    })

    it('should override a previous entry', () => {
      config.set('foo', 'bar')
      config.set('foo', 'buzz')

      assert.equal(map.foo, 'buzz')
    })

    describe('when a nested key provided', () => {
      it('should add a nested entry', () => {
        config.set('foo.bar', 123)

        assert.equal(map.foo.bar, 123)
      })

      it('should override a previous nested key', () => {
        config.set('a', { b: { c: true } })

        assert(map.a.b.c)

        config.set('a.b', false)

        assert(!map.a.b)
      })
    })
  })

  describe('store.get(key, defaultValue)', () => {
    let config: Store
  
    beforeEach(() => {
      config = new Store()
    })
  
    it('should return the value of the given key', () => {
      config.set('foo', 'bar')
  
      assert.equal(config.get('foo', 'booom'), 'bar')
    })
  
    describe('when nested key', () => {
      it('should return the value as deep as needed', () => {
        config = new Store({ a: { b: { c: true } } })
  
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
})
