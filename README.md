This jQuery plugin is for when you want to prevent accidental clicks,
for example, a deletion. It requires that the user hold their mouse
button for a period of time, and provides visual feedback accordingly.

Usage:
------

    $(...).clickhold(function(evt) { ... });
    $(...).clickhold(function(evt) { ... }, { ... options ... });

Default options object:
-----------------------

        var settings = {
            instructionMessageFont: "24px Sans-Serif",
            incompletePieFill: "rgba(255, 0, 0, 0.3)",
            completePieFill: "rgba(0, 255, 0, 0.3)",
            instructionMessageFill: "rgba(255, 0, 0, 1)",
            instructionMessageText: "Please hold mouse button",
            holdLength: 500,
            totalWidth: 400
        };
