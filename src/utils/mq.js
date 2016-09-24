var mq = null
function getMessageQueue () {
  if (!mq) {
    mq = new MessageQueue()
  }

  return mq
}

function MessageQueue () {
  this.queue = []
  this.running = false
}

MessageQueue.prototype.push = function (chart, context, fn) {
  this.queue.push({
    chart: chart,
    fn: fn,
    context: context
  })
  if (!this.running) {
    this.running = true
    this.startLoop()
  }
}

MessageQueue.prototype.startLoop = function () {
  var self = this
  if (this.queue.length > 0) {
    let loop = function () {
      setTimeout(() => {
        let item = self.queue.shift()
        if (item) {
          let timestap = new Date()
          item.chart.render()
          let timestap2 = new Date()
          console.log(timestap2.getTime() - timestap.getTime())
          item.fn.call(item.context)
          loop()
        } else {
          self.running = false
        }
      }, 100)
    }
    loop()
  }
}

MessageQueue.prototype.clear = function () {
  if (this.queue.length > 0) {
    console.log('this.queue.length = ' + this.queue.length)
    this.queue = []
  }
}

export default getMessageQueue
