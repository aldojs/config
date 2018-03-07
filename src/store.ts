
import assert from 'assert'

const { isArray } = Array

type Literal = { [x: string]: any }

export default class Config {
  /**
   * Create new config instance
   * 
   * @param {Object} [_data]
   * @constructor
   */
  constructor (private _data: Literal = {}) {
  	// 
  }

  /**
   * Get the setting value or `defaultValue` if not exist
   * 
   * @param {String} key
   * @param {Any} [defaultValue]
   * @returns {Any}
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
   * @param {String} key
   * @param {Any} value
   * @returns {Config}
   */
  public set (key: string, value: any): this {
    return this._set(key, value)
  }

  /**
   * Check if a setting is defined
   * 
   * @param {String} key
   * @returns {Boolean}
   */
  public has (key: string): boolean {
    return this.get(key) != null
  }

  /**
   * Enable a setting
   * 
   * @param {String} key
   * @param {Any} value
   * @returns {Config}
   */
  public enable (key: string): this {
    return this._setEnabled(key, true)
  }

  /**
   * Check if a setting is enabled
   * 
   * @param {String} key
   * @returns {Boolean}
   */
  public enabled (key: string): boolean {
    var value = this.get(key)

    return (_isPlainObject(value) ? value.enabled : value) == true
  }

  /**
   * Disable a setting
   * 
   * @param {String} key
   * @returns {Config}
   */
  public disable (key: string): this {
    return this._setEnabled(key, false)
  }

  /**
   * Check if a setting is disabled
   * 
   * @param {String} key
   * @returns {Boolean}
   */
  public disabled (key: string): boolean {
    return !this.enabled(key)
  }

  /**
   * Merge the settings with the new values
   * 
   * @param {Object} values
   * @returns {Config}
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
  return arg && (Object.getPrototypeOf(arg) === null || Object === arg.constructor)
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
    if (isArray(dest[field])) {
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
