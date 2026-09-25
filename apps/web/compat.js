(function () {
  "use strict";

  if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
      var value = String(this);
      var length = targetLength >> 0;
      var fill = String(padString === undefined ? " " : padString);
      if (value.length >= length || !fill) return value;
      var needed = length - value.length;
      while (fill.length < needed) fill += fill;
      return fill.slice(0, needed) + value;
    };
  }

  if (!window.queueMicrotask) {
    window.queueMicrotask = function queueMicrotaskCompat(callback) {
      Promise.resolve().then(callback).catch(function (error) {
        setTimeout(function () { throw error; }, 0);
      });
    };
  }

  if (window.Element && !Element.prototype.replaceChildren) {
    Element.prototype.replaceChildren = function replaceChildrenCompat() {
      while (this.firstChild) this.removeChild(this.firstChild);
      for (var i = 0; i < arguments.length; i += 1) {
        var child = arguments[i];
        this.appendChild(child && child.nodeType ? child : document.createTextNode(String(child)));
      }
    };
  }

  if (window.crypto && !crypto.randomUUID) {
    crypto.randomUUID = function randomUUIDCompat() {
      var bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 15) | 64;
      bytes[8] = (bytes[8] & 63) | 128;
      var hex = [];
      for (var i = 0; i < bytes.length; i += 1) hex.push((bytes[i] + 256).toString(16).slice(1));
      return hex[0] + hex[1] + hex[2] + hex[3] + "-" +
        hex[4] + hex[5] + "-" + hex[6] + hex[7] + "-" +
        hex[8] + hex[9] + "-" + hex[10] + hex[11] + hex[12] + hex[13] + hex[14] + hex[15];
    };
  }

  if (!Object.entries) {
    Object.entries = function entriesCompat(object) {
      var keys = Object.keys(object);
      var result = [];
      for (var i = 0; i < keys.length; i += 1) result.push([keys[i], object[keys[i]]]);
      return result;
    };
  }
})();