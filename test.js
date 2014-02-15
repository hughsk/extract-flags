var test = require('tape')
var extract = require('./')

test('simple case', function(t) {
  var args = ['node', 'index.js', '-t', 'transform']
  var argv = extract(args, { t: String })

  t.deepEqual(args, ['node', 'index.js'])
  t.deepEqual(argv, { t: ['transform'] })
  t.end()
})

test('booleans do not capture next argument', function(t) {
  var args = ['node', 'index.js', '-t', 'transform']
  var argv = extract(args, { t: Boolean })

  t.deepEqual(args, ['node', 'index.js', 'transform'])
  t.deepEqual(argv, { t: true })
  t.end()
})

test('shorthand args can be excluded individually', function(t) {
  var args = ['node', 'index.js', '-xyz', 'thing']
  var argv = extract(args, { x: Boolean, z: String })

  t.deepEqual(args, ['node', 'index.js', '-y'])
  t.deepEqual(argv, { x: true, z: ['thing'] })
  t.end()
})

test('ignore after --', function(t) {
  var args = ['node', 'index.js', '-t', 'transform', '--', '-c', 'another']
  var argv = extract(args, { t: Boolean, c: String })

  t.deepEqual(args, ['node', 'index.js', 'transform', '--', '-c', 'another'])
  t.deepEqual(argv, { t: true, c: [] })
  t.end()
})
