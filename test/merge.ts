
import assert from 'assert'
import Store from '../src/store'

describe('config.merge(object)', () => {
  let config: any
  
  it('should merge settings', () => {
    config = new Store({
      a: true,
      b: {
        c: [ 123 ]
      }
    })

    config.merge({
      a: false,
      b: { c: 456 },
      d: {
        enabled: true,
        data: [1, 2, 3]
      }
    })

    assert.deepEqual(config._data, {
      a: false,
      b: {
        c: [123, 456]
      },
      d: {
        enabled: true,
        data: [1, 2, 3]
      }
    })
  })
})
