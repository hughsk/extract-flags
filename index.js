module.exports = extract

function extract(argv, params) {
  var results = {}

  params = Object.keys(params).reduce(function(memo, param) {
    var flag = param.replace(/^--?/g, '')
    var type = params[param]

    results[flag] = type === Boolean ? false : []
    memo[flag] = {
        type: type
      , flag: flag
    }

    return memo
  }, {})

  var prevFlag = false

  for (var i = 0; i < argv.length; i++) {
    var p = argv[i]
    var isFlag = p[0] === '-'
    var isLong = p[1] === '-' && isFlag

    if (isLong && p.length === 2) break

    if (!isFlag) {
      if (!prevFlag) continue
      results[prevFlag].push(params[prevFlag].type(p))
      prevFlag = false
      argv.splice(i--, 1)
      continue
    }

    if (isLong) {
      argv.splice(i--, 1)
      p = p.slice(2)

      if (!(p in params)) continue
      if (params[p].type === Boolean) {
        results[p] = true
      } else {
        prevFlag = p
      }

      continue
    }

    p = p.slice(1)
    var replacement = p
    var j = p.length - 1
    var last = p[j]

    while (j--) {
      var ch = p[j]
      if (!(ch in params)) continue

      replacement = (
        replacement.slice(0, j) +
        replacement.slice(j + 1)
      )

      if (params[ch].type === Boolean) {
        results[ch] = true
      } else {
        results[ch].push(true)
      }
    }

    if (last in params) {
      replacement = replacement.slice(0, -1)
      if (params[last].type === Boolean) {
        results[last] = true
      } else {
        prevFlag = last
      }
    }

    if (replacement.length) {
      argv[i] = '-' + replacement
    } else {
      argv.splice(i--, 1)
    }
  }

  return results
}
