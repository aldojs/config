
/**
 * Configuration store
 */
export default class Store {

  /**
   * Enable a setting
   * 
   * @param key
   */
  enable(key: string): any;

  /**
   * Disable a setting
   * 
   * @param key
   */
  disable(key: string): any;

  /**
   * Check if a setting is defined
   * 
   * @param key
   */
  has(key: string): boolean;

  /**
   * Check if a setting is enabled
   * 
   * @param key
   */
  enabled(key: string): boolean;

  /**
   * Check if a setting is disabled
   * 
   * @param key
   */
  disabled(key: string): boolean;

  /**
   * Set a setting value
   * 
   * Examples:
   * 
   *    // simple key
   *    config.set('foo', 123)
   * 
   *    // composite key
   *    config.set('foo.bar.baz', [1, 2, 3])
   * 
   * @param key
   * @param value
   */
  set(key: string, value: any): this;

  /**
   * Get the `key` value or `defaultValue` if not exist
   * 
   * Examples:
   * 
   *    // simple key with fallback value
   *    config.get('foo', 'bar')
   * 
   *    // composite key
   *    config.get('foo.bar.baz')
   * 
   * @param key
   * @param defaultValue
   */
  get(key: string, defaultValue?: any): any;

  /**
   * Merge the settings with the new values
   * 
   * @param values
   */
  merge(values: { [x: string]: any }): any;
}
