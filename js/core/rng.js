(function (root) {
  var Calc = root.Calc = root.Calc || {};

  function mulberry32(seed) {
    var state = seed >>> 0;
    return function () {
      state = (state + 0x6D2B79F5) >>> 0;
      var value = Math.imul(state ^ (state >>> 15), 1 | state);
      value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hash(str) {
    var value = 2166136261;
    for (var i = 0; i < str.length; i++) {
      value = Math.imul(value ^ str.charCodeAt(i), 16777619);
    }
    return value >>> 0;
  }

  function create(seed, salt) {
    var next = mulberry32((seed >>> 0) ^ hash(salt));
    function int(n) { return Math.floor(next() * n); }
    return {
      next: next,
      int: int,
      shuffle: function (arr) {
        var result = arr.slice();
        for (var i = result.length - 1; i > 0; i--) {
          var j = int(i + 1);
          var value = result[i];
          result[i] = result[j];
          result[j] = value;
        }
        return result;
      }
    };
  }

  Calc.rng = {
    mulberry32: mulberry32,
    hash: hash,
    create: create,
    newSeed: function () { return root.crypto.getRandomValues(new Uint32Array(1))[0]; }
  };
  if (typeof module !== 'undefined') module.exports = Calc.rng;
}(typeof window !== 'undefined' ? window : globalThis));
