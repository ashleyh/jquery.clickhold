(function($) {
    $.fn.clickhold = function (cb, options) {
        var settings = {
            instructionMessageFont: "24px Sans-Serif",
            incompletePieFill: "rgba(255, 0, 0, 0.3)",
            completePieFill: "rgba(0, 255, 0, 0.3)",
            instructionMessageFill: "rgba(255, 0, 0, 1)",
            instructionMessageText: "Please hold mouse button",
            holdLength: 500,
            totalWidth: 400
        };
        
        if(cb instanceof Function) {
           cb = jQuery.proxy(cb, this);
        } else if (cb) {
           options = cb;
           cb = null; 
        }
        
        if(options) {
             $.extend(settings, options);
        }
        
        $(this).mousedown(function (evt) {
            $target = $(evt.target);
            
            var pos = $(evt.target).offset()
            var $canvas = $("<canvas>");
            $canvas.attr('width', settings.totalWidth);
            $canvas.attr('height', 100);
            $canvas.css('position', 'absolute');
            $canvas.css('top', pos.top + ($target.height() / 2) - 50);
            $canvas.css('left', pos.left + ($target.width() / 2) - 50);
            $('body').append($canvas);
            
            var canvas = $canvas.get(0);
            var ctx = canvas.getContext('2d');
    
            var timer = settings.holdLength;
    
            function drawCircle(time, fillStyle) {
                ctx.fillStyle = fillStyle;
                ctx.save();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.arc(50, 50, 30, 0, 2*Math.PI*time, false);
                ctx.lineTo(50, 50);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            function step(time, dt) {
              drawCircle(time, settings.incompletePieFill)
            }

            var success = false

            function complete() {
              success = true
              drawCircle(1.0, settings.completePieFill)
            }

            $canvas.customAnimation('queue', {
              duration: settings.holdLength,
              step: step,
              complete: complete
            })
    
            var n = 0;
            function failstep() {
                ctx.save();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1/(Math.exp(n/2-6)+1);
                ctx.fillStyle = settings.instructionMessageFill;
    
                ctx.save();
                ctx.translate(50, 50);
                ctx.rotate(Math.PI / 4);
                ctx.fillRect(-10, -30, 20, 60);
                ctx.fillRect(-30, -10, 20, 20);
                ctx.fillRect(10, -10, 20, 20);
                ctx.restore();
                ctx.textBaseline = 'middle';
                ctx.font = settings.instructionMessageFont;
                ctx.fillText(settings.instructionMessageText, 90, 50);
                
                n++;
                
                ctx.restore();
            }

            function failcomplete() {
              $canvas.remove()
            }
    
    
            $(window).one('mouseup', function (evt) {
                if (success) {
                    $canvas.remove();
                    
                    if(cb && cb != null) {
                        cb(evt);
                    }
                } else {
                    $canvas.customAnimation('stop')
                    $canvas.customAnimation('queue', {
                        duration: 500,
                        step: failstep,
                        complete: failcomplete
                    })
                }
            });
        });
    }
})(jQuery);
