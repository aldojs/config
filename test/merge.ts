
import assert from 'assert'
import { Config } from '../src'

let config: any

describe('config.merge(object)', () => {
  it('should merge settings', () => {
    config = new Config({
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
