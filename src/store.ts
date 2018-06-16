
import is from '@sindresorhus/is'

export type Literal = { [x: string]: any }

/**
 * The Configuration store class
 * 
 * @public
 * @class
 */
export class Store {
  /**
   * The configuration map
   * 
   * @private
   */
  private _map: Literal

  /**
   * Initialize a new config store
   * 
   * @param map The source config map
   * @constructor
   * @public
   */
  constructor (map: Literal = {}) {
  	this._map = map
  }

  /**
   * Get the `key` value or `defaultValue` if not exist
   * 
   * @param key The setting key name
   * @param defaultValue The default value to return is missing
   * @public
   */
  public get (key: string, defaultValue?: any): any {
    return this._get(key) || defaultValue
  }

  /**
   * Set a setting value
   * 
   * @param key The setting name
   * @param value The setting value
   * @public
   */
  public set (key: string, value: any): this {
    return this._set(key, value)
  }

  /**
   * Check if a setting is defined
   * 
   * @param key
   * @public
   */
  public has (key: string): boolean {
    return this._get(key) != null
  }

  /**
   * Enable a setting
   * 
   * @param key
   * @public
   */
  public enable (key: string): this {
    this._setEnabled(key, true)
    return this
  }

  /**
   * Check if a setting is enabled
   * 
   * @param key
   * @public
   */
  public enabled (key: string): boolean {
    let value = this._get(key)

    if (is.plainObject(value) && 'enabled' in value) {
      return is.truthy(value['enabled'])
    }

    return is.truthy(value)
  }

  /**
   * Disable a setting
   * 
   * @param key
   * @public
   */
  public disable (key: string): this {
    this._setEnabled(key, false)
    return this
  }

  /**
   * Check if a setting is disabled
   * 
   * @param key
   * @public
   */
  public disabled (key: string): boolean {
    return !this.enabled(key)
  }

  /**
   * Merge the settings with the new values
   * 
   * @param values
   * @public
   */
  public merge (values: Literal | Store): this {
    if (values instanceof Store) values = values._map

    _merge(this._map, values)

    return this
  }

  /**
   * Set `key` state
   * 
   * @param key
   * @param value
   * @private
   */
  private _setEnabled (key: string, value: boolean) {
    let old = this.get(key)

    if (is.plainObject(old)) key += '.enabled'

    this._set(key, value)
  }

  /**
   * Mutate the map
   * 
   * @param key 
   * @param value 
   * @private
   */
  private _set (key: string, value: any): this {
    let map = this._map
    let keys = key.split('.')

    while (keys.length > 1) {
      let field = keys.shift() as string

      // if the key doesn't exist at this depth,
      // we'll just create a plain object to hold the value
      if (!is.plainObject(map[field])) map[field] = {}

      map = map[field]
    }

    map[keys[0]] = value

    return this
  }

  /**
   * Get a value from the map
   * 
   * @param key 
   * @private
   */
  private _get (key: string): any {
    let map = this._map
    let keys = key.split('.')

    while (keys.length > 1) {
      let field = keys.shift() as string

      // we won't go deeper if the field is not an object
      if (!is.plainObject(map[field])) return

      map = map[field]
    }

    return map[keys[0]]
  }
}

/**
 * Merge two objects
 * 
 * @param dest
 * @param source
 * @private
 */
function _merge (dest: Literal, source: Literal) {
  for (let field in source) {
    let value = source[field]

    // list
    if (is.array(dest[field])) {
      dest[field] = dest[field].concat(value)
      continue
    }

    // map
    if (is.plainObject(value) && is.plainObject(dest[field])) {
      _merge(dest[field], value)
      continue
    }

    // otherwise
    dest[field] = value
  }
}
