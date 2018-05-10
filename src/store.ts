
import assert from 'assert'

export type Literal = { [x: string]: any }

export default class ConfigStore {
  /**
   * The store data
   */
  private _map: Literal = {}

  /**
   * Initialize a new `Config` instance
   * 
   * @param source
   */
  public constructor (source: Literal = {}) {
  	this.merge(source)
  }

  /**
   * Get the `key` value or `defaultValue` if not exist
   * 
   * @param key
   * @param defaultValue
   */
  public get (key: string, defaultValue?: any): any {
    var data = this._map
    var keys = _ensure(key).split('.')

    while (keys.length > 1) {
      let field = keys.shift() as string

      if (!_isPlainObject(data[field])) {
        return defaultValue
      }

      data = data[field]
    }

    return data[keys.shift() as string] || defaultValue
  }

  /**
   * Set a setting value
   * 
   * @param key
   * @param value
   */
  public set (key: string, value: any): this {
    return this._set(key, value)
  }

  /**
   * Check if a setting is defined
   * 
   * @param key
   */
  public has (key: string): boolean {
    return this.get(key) != null
  }

  /**
   * Enable a setting
   * 
   * @param key
   */
  public enable (key: string): this {
    return this._setEnabled(key, true)
  }

  /**
   * Check if a setting is enabled
   * 
   * @param key
   */
  public enabled (key: string): boolean {
    var value = this.get(key)

    return (_isPlainObject(value) ? value.enabled : value) == true
  }

  /**
   * Disable a setting
   * 
   * @param key
   */
  public disable (key: string): this {
    return this._setEnabled(key, false)
  }

  /**
   * Check if a setting is disabled
   * 
   * @param key
   */
  public disabled (key: string): boolean {
    return !this.enabled(key)
  }

  /**
   * Merge the settings with the new values
   * 
   * @param values
   */
  public merge (values: Literal): this {
    assert(_isPlainObject(values), `Expect a plain object but got ${typeof values}`)
    _merge(this._map, values)
    return this
  }

  /**
   * Set a setting flag
   * 
   * @param key
   * @param value
   * @private
   */
  private _setEnabled (key: string, value: boolean): this {
    var old = this.get(key)

    if (_isPlainObject(old)) {
      key = `${key}.enabled`
    }

    return this._set(key, false)
  }

  /**
   * Set a setting value
   * 
   * @param key
   * @param value
   * @private
   */
  private _set (key: string, value: any): this {
    var data = this._map
    var keys = _ensure(key).split('.')

    while (keys.length > 1) {
      let field = keys.shift() as string

      // If the key doesn't exist at this depth,
      // we'll just create a plain object to hold the value
      if (!_isPlainObject(data[field])) {
        data[field] = {}
      }

      data = data[field]
    }

    // last field
    data[keys.shift() as string] = value

    return this
  }
}

/**
 * Ensure the configuration key is valid
 * 
 * @param key
 * @throws `AssertionError` when the `key` is invalid
 * @private
 */
function _ensure (key: string): string {
  assert(typeof key === 'string', 'The key must be a string')
  assert(key !== '', 'The key should not be empty')

  return key
}

/**
 * Check if the given value is a plain object
 * 
 * @param obj
 * @private
 */
function _isPlainObject (obj: any): boolean {
  return obj && (Reflect.getPrototypeOf(obj) === null || Object === obj.constructor)
}

/**
 * Merge two objects
 * 
 * @param one
 * @param two
 * @private
 */
function _merge (one: Literal, two: Literal): void {
  for (let field in two) {
    let value = two[field]

    // list
    if (Array.isArray(one[field])) {
      one[field] = one[field].concat(value)
      continue
    }

    // map
    if (_isPlainObject(value) && _isPlainObject(one[field])) {
      _merge(one[field], value)
      continue
    }

    // otherwise
    one[field] = value
  }
}
