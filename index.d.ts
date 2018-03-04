
export type Literal = { [x: string]: any }

export class Config {
  enable (key: string): any
  disable (key: string): any
  has (key: string): boolean
  merge (values: Literal): any
  enabled (key: string): boolean
  disabled (key: string): boolean
  set (key: string, value: any): Config
  get (key: string, defaults?: any): any
}
