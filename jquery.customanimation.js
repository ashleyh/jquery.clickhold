(function ($) {
  var epoch = new Date(0)
  var shownFakeWarning = false
  var dataKey = "customAnimation"

  function fakeRequestAnimationFrame(callback, element) {
    var timeout = 1000/60
    if (!shownFakeWarning) {
      console.log("warning: using crappy fakeRequestAnimationFrame")
      shownFakeWarning = true
    }
    window.setTimeout(function () {
      var now = new Date()
      callback(now - epoch)
    }, timeout)
  }

  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    fakeRequestAnimationFrame

  function Animation(selector, options) {
    this.selector = selector
    this.options = options
    this.startTime = 0
    this.lastTime = 0
    this.stopRequested = false
  }

  Animation.prototype.start = function() {
    var previousAnimation = this.selector.data(dataKey)
    if (previousAnimation && previousAnimation != null) {
      console.log(
          "warning: there already seems to be a customAnimation here",
          previousAnimation
      )
    }
    this.selector.data(dataKey, this)
    this.requestAnimationFrame()
  }

  Animation.prototype.requestAnimationFrame = function() {
    requestAnimationFrame($.proxy(this.callback, this))
  }

  Animation.prototype.callback = function(time) {
    if (!this.startTime) {
      this.startTime = time
    }
    if (!this.lastTime) {
      this.lastTime = time
    }
    var duration = this.options.duration
    var normalizedTime = (time - this.startTime) / duration
    var normalizedDT = (time - this.lastTime) / duration
    var shouldStop = this.stopRequested
    if (normalizedTime > 1.0) {
      shouldStop = true
    }
    if (shouldStop) {
      this.complete()
    } else {
      this.requestAnimationFrame()
      this.options.step(normalizedTime, normalizedDT)
    }
    this.lastTime = time
  }

  Animation.prototype.stop = function () {
    this.stopRequested = true
  }

  Animation.prototype.complete = function () {
    if (!this.stopRequested) {
      this.options.complete()
    }
    this.selector.data(dataKey, null)
    this.selector.dequeue()
  }

  $.fn.customAnimation = function(action, options) {
    var defaultOptions = {
      duration: 1000,
      step: null,
      complete: null
    }
    options = $.extend(defaultOptions, options)
    if (action == 'queue') {
      this.queue(function() {
        (new Animation($(this), options)).start()
      })
    } else if (action == 'stop') {
      var animation = this.data(dataKey)
      if (animation) {
        animation.stop()
      }
    }
    return this
  }
})(jQuery);
