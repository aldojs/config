
Configuration store for Node.js applications.

## Installing
```sh
npm add aldo-config
```

## Testing
```sh
npm test
```

## Usage
```js
const Store = require('aldo-config')

// create a new store with initial values
const config = new Store({ foo: 'bar' })

console.log(config.get('foo'))
//=> 'bar'

config.set('awesome', true)
console.log(config.get('awesome'))
//=> true

// Use dot-notation to access nested properties
config.set('bar.baz', true)
console.log(config.get('bar'))
//=> {baz: true}

console.log(config.toJSON())
//=> { "foo": "bar", "awesome": true, "bar": { "baz": true } }
```

## API

### config.set(key, value)
Set an item.

### config.get(key, [defaultValue])
Get an item, or `defaultValue` if undefined.

### config.has(key)
Check if an item exists.

### config.merge(values)
Merge old values with the new ones.
> Will set plain values and merge objects and arrays.

### config.enable(key)
Set an item value to `true`.
> If the key points to an object, a property `enabled` will be added with `true` value.

### config.enabled(key)
Check whether a key's value is truthy.

### config.disable(key)
Set an item value to `false`.
> If the key points to an object, a property `enabled` will be added with `false` value.

### config.enabled(key)
Check whether a key's value is falsy.

## License
[MIT License](https://opensource.org/licenses/MIT)
