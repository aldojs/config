
import { Store } from './store'
import requireAll from 'require-all'

export type LoaderOptions = {
  /**
   * The filename mapper
   */
  map?: (name: string, path: string) => string

  /**
   * The files filter utility
   */
  filter?: RegExp | ((file: string) => string)

  /**
   * The content transformer
   */
  resolve?: (content: any) => any
}

/**
 * The config files loader
 */
export class Loader {
  /**
   * The loader options
   * 
   * @private
   */
  private _options: LoaderOptions

  /**
   * Initialize a new config loader
   * 
   * @param options 
   * @constructor
   * @public
   */
  public constructor (options: LoaderOptions = {}) {
    this._options = options
  }

  /**
   * Load config files from a directory
   * 
   * @param dirname The config directory
   * @public
   */
  public load (dirname: string): Store {
    return new Store(this._loadFiles(dirname))
  }

  /**
   * Require all config files
   * 
   * @param dirname The directory name
   * @private
   */
  private _loadFiles (dirname: string) {
    return requireAll({ ...this._options, recursive: false, dirname })
  }
}
