
import * as assert from 'assert'

type Literal = { [x: string]: any }

/**
 * Configuration store
 */
export default class {
  private _data: Literal

  /**
   * Initialize a new `Config` instance
   * 
   * @param source
   */
  constructor (source: Literal = {}) {
  	this._data = source
  }

  /**
   * Get the `key` value or `defaultValue` if not exist
   * 
   * @param key
   * @param defaultValue
   */
  public get (key: string, defaultValue?: any): any {
    var data = this._data
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
    // TODO assert values is a plain object
    _merge(this._data, values)
    return this
  }

  /**
   * 
   * 
   * @param {String} key
   * @param {Boolean} value
   * @returns {Config}
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
   * @param {String} key
   * @param {Any} value
   * @returns {Config}
   * @private
   */
  private _set (key: string, value: any) {
    var data = this._data
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
 * @param {String} key
 * @returns {String}
 * @throws {AssertionError}
 * @private
 */
function _ensure (key: string) {
  assert(typeof key === 'string', 'The key must be a string')
  assert(key !== '', 'The key should not be empty')
  
  return key
}

/**
 * Check if the given value is a plain object
 * 
 * @param {Any} arg
 * @returns {Boolean}
 * @private
 */
function _isPlainObject (arg: any): boolean {
  return arg && (Reflect.getPrototypeOf(arg) === null || Object === arg.constructor)
}

/**
 * Merge two objects
 * 
 * @param {Object} dest
 * @param {Object} source
 * @private
 */
function _merge (dest: Literal, source: Literal) {
  for (let field in source) {
    let value = source[field]

    // list
    if (Array.isArray(dest[field])) {
      dest[field] = dest[field].concat(value)
      continue
    }

    // map
    if (_isPlainObject(value) && _isPlainObject(dest[field])) {
      _merge(dest[field], value)
      continue
    }

    // otherwise
    dest[field] = value
  }
}
