(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";

var _index = _interopRequireDefault(require("../index.js"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

window.trowl = _index.default;

},{"../index.js":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(gridContainer, columns, gap, callback) {
  // presets
  columns = columns || 5;
  gap = gap || 10; // container styling

  gridContainer.style.display = 'grid';
  gridContainer.style.gridTemplateColumns = "repeat(".concat(columns, ", 1fr)");
  gridContainer.style.gridGap = "".concat(gap, "px"); // Start gathering information about the grid

  var gridItems = gridContainer.children;
  var gridContainerTop = gridContainer.getBoundingClientRect().top;
  var rowCount = Math.ceil(gridItems.length / columns); // Hard write grid positions

  var itemData = Array.apply(null, {
    length: rowCount
  }).map(function (n) {
    return [];
  });

  for (var i = 0; i < gridItems.length; i += 1) {
    var item = gridItems[i];
    var row = Math.floor(i / columns);
    var position = [row, i - row * columns];
    item.style.gridArea = "".concat(position[0] + 1, " / ").concat(position[1] + 1);
    itemData[position[0]][position[1]] = item;
  } // Nudge elements upwards


  for (var _i = 0; _i < rowCount - 1; _i += 1) {
    for (var j = 0; j < columns; j += 1) {
      var below = itemData[_i + 1][j];

      var aRect = itemData[_i][j].getBoundingClientRect();

      var nudgeUp = aRect.top - below.getBoundingClientRect().top + (aRect.height + gap);

      if (nudgeUp) {
        below.style.transform = "translateY(".concat(nudgeUp, "px)");
        below.gridNudge = nudgeUp;
      }
    }
  } // Re-assign the lowest element to the end of a different column and nudge.


  var shuffle = function shuffle() {
    // Order items by lowPoint
    var lowPoints = [];

    for (var _i2 = 0; _i2 < gridItems.length; _i2 += 1) {
      var elem = gridItems[_i2];
      var rect = elem.getBoundingClientRect();
      lowPoints[_i2] = {
        elem: elem,
        column: Math.abs(elem.style.gridArea.trim().replace(/([\s\/]+)/g, '-').split('-')[1]) - 1,
        lowPoint: rect.top + rect.height,
        rect: rect
      };
    }

    lowPoints.sort(function (a, b) {
      return b.lowPoint - a.lowPoint;
    }); // Find the highest of the bottom items per column

    var lowestPerColumn = [];

    for (var _i3 = 0; _i3 < lowPoints.length; _i3 += 1) {
      var _item = lowPoints[_i3];

      if (!lowestPerColumn[_item.column]) {
        lowestPerColumn[_item.column] = [_item, _item.lowPoint];
      }
    }

    lowestPerColumn.sort(function (a, b) {
      return a[1] - b[1];
    });
    var highest = lowestPerColumn[0][0]; // Move the lowest to the highest column and nudge

    for (var _i4 = 1; _i4 < lowestPerColumn.length; _i4 += 1) {
      var lowest = lowestPerColumn[_i4][0];

      if (highest.lowPoint + gap + lowest.rect.height >= lowest.lowPoint) {
        if (_i4 === lowestPerColumn.length - 1) {
          gridContainer.style.height = "".concat(lowest.lowPoint - gridContainerTop, "px");

          if (callback) {
            callback();
            return;
          }
        }
      } else {
        var _nudgeUp = highest.rect.top - lowest.rect.top + (highest.rect.height + gap);

        var nudge = (lowest.elem.gridNudge || 0) + _nudgeUp;
        lowest.elem.style.gridColumn = highest.column + 1;
        lowest.elem.style.transform = "translateY(".concat(nudge, "px)");
        lowest.elem.gridNudge = nudge;
        break;
      }
    }

    window.requestAnimationFrame(shuffle);
  };

  shuffle();
};

exports.default = _default;

},{}]},{},[1]);
