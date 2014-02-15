# extract-flags [![Flattr this!](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=hughskennedy&url=http://github.com/hughsk/extract-flags&title=extract-flags&description=hughsk/extract-flags%20on%20GitHub&language=en_GB&tags=flattr,github,javascript&category=software)[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

Extract command-line arguments from a list, removing matches from the original
array. Useful for providing custom arguments for a wrapper executable, but
passing unexpected arguments back onto the original executable if not expected.

Only supports a subset of what you'd get with
[minimist](http://github.com/substack/minimist), so unless you're explicitly
looking to modify the arguments array you're better of using that module.

## Usage ##

[![extract-flags](https://nodei.co/npm/extract-flags.png?mini=true)](https://nodei.co/npm/extract-flags)

### `extract(argv, flags)` ###

Where `argv` is an array of arguments, and `flags` is an object formatted
like so:

``` javascript
{
    t: String
  , transform: String
  , debug: Boolean
}
```

Each key represents a command-line flag, and the value should be either
`String`, `Number` or `Boolean` to denote its type. `argv` will be modified
in-place to remove matched flags, and you will get an object in return
with the extracted values:

``` javascript
{
    t: ['envify', 'es6ify']
  , transform: ['installify']
  , debug: true
}
```

## Example ##

Here's a simple example of the kind of thing you might want to use
`extract-flags` for:

``` javascript
var spawn = require('child_process').spawn
var extract = require('extract-flags')
var argv = process.argv

var options = extract(argv, {
    'transform': String
  , 'debug': Boolean
})

if (options.debug) {
  process.env.NODE_ENV = 'development'
}

var ps = spawn('node', argv.slice(1), {
    cwd: process.cwd()
  , env: process.env
})

var input = process.stdin
options.transform.forEach(function(tr) {
  input = input.pipe(require(tr)('filename'))
})
input.pipe(process.stdout)
```

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/extract-flags/blob/master/LICENSE.md) for details.
