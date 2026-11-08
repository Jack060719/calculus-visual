(function () {
  var memory = Object.create(null);
  var prefix = 'calcpk:';

  Calc.store = {
    get: function (key, fallback) {
      var name = prefix + key;
      try {
        var value = memory[name];
        if (value === undefined) value = window.localStorage.getItem(name);
        return value == null ? fallback : JSON.parse(value);
      } catch (error) {
        return fallback;
      }
    },
    set: function (key, value) {
      var name = prefix + key;
      var json = JSON.stringify(value);
      memory[name] = json;
      try {
        window.localStorage.setItem(name, json);
      } catch (error) {
        // 無法使用本機儲存時，保留本次開啟期間的記憶體資料。
      }
    }
  };
}());
