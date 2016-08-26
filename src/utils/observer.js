function Observer () {
  this.pool = {}
}

function _add (type, cb, context) {
  let params = Array.prototype.slice.call(arguments, 3)

  if (typeof type !== 'string') {
    throw TypeError('message type must be string')
  }

  if (!this.pool[type]) {
    this.pool[type] = []
  }

  this.pool[type].push({
    cb: cb,
    context: context,
    params: params
  })
}

function _fire (type) {
  if (typeof type !== 'string') {
    throw TypeError('message type must be string')
  }

  if (!this.pool[type]) {
    return false
  }

  for (let i = 0; i < this.pool[type].length; i++) {
    let item = this.pool[type][i]

    if (typeof item.cb !== 'function') {
      continue
    }

    item.cb.apply(item.context || window, item.params)
  }
}

function _next (type) {
  if (typeof type !== 'string') {
    throw TypeError('message type must be string')
  }

  if (!this.pool[type]) {
    return false
  }

  return this.pool[type].shift()
}

function _clear () {
  let type = arguments[0]
  if (type === undefined) {
    for (let i in this.pool) {
      if (!(delete this.pool[i])) {
        return false
      }
    }

    return true
  }

  if (typeof type !== 'string') {
    throw TypeError('message type must be string')
  }

  return delete this.pool[type]
}

Observer.prototype.on = Observer.prototype.push = Observer.prototype.add = _add
Observer.prototype.next = _next
Observer.prototype.fire = _fire
Observer.prototype.clear = _clear

var globalObserver = new Observer()

export default globalObserver
export {Observer}
