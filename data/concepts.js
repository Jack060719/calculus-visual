// 觀念清單（T12b）：每一題可以標 1～2 個觀念，用在「學習診斷」的「最常錯的觀念」。
//
// 題庫組標註方式：在 data/questions/*.js 的題目裡加一個 concepts 欄位，放觀念代號，例如
//   { id: 'der-07', topic: 'derivative', difficulty: 2, concepts: ['der.chain', 'der.basic'], ... }
// 規則（node tools/verify.js 會檢查）：
//   1. 1～2 個代號，不可重複；第一個放「答錯最可能卡住的地方」。
//   2. 代號必須在下面的清單裡，而且要屬於這一題的主題（導數題只能用 der. 開頭的代號）。
//   3. 還沒標的題目可以先不加 concepts；網站照常運作，只是不會算進「常錯觀念」。
//
// 代號開頭和題目 id 一樣（lim／der／dap／int／itc／ser），方便對照。
// 中文名稱之後要改直接改 label；錯題本只存題目 id，改名稱不用搬資料。
// 但已經標在題目上的「代號」不要改，改了要同步改題庫。
(function (root) {
  var Calc = root.Calc = root.Calc || {};

  var list = [
    // 極限與連續
    { id: 'lim.sub', topic: 'limit', label: '代入與連續性' },
    { id: 'lim.simplify', topic: 'limit', label: '化簡消去（因式分解／通分／有理化）' },
    { id: 'lim.onesided', topic: 'limit', label: '單側極限與絕對值' },
    { id: 'lim.special', topic: 'limit', label: '特殊極限（sin x / x、e）' },
    { id: 'lim.infinity', topic: 'limit', label: '無窮遠極限與漸近線' },
    { id: 'lim.squeeze', topic: 'limit', label: '夾擠定理' },
    // 導數
    { id: 'der.basic', topic: 'derivative', label: '基本求導公式' },
    { id: 'der.product', topic: 'derivative', label: '乘法與除法法則' },
    { id: 'der.chain', topic: 'derivative', label: '連鎖律' },
    { id: 'der.implicit', topic: 'derivative', label: '隱函數微分' },
    { id: 'der.log', topic: 'derivative', label: '對數微分法' },
    { id: 'der.invtrig', topic: 'derivative', label: '反三角函數導數' },
    // 導數應用
    { id: 'dap.tangent', topic: 'derivative-app', label: '切線與法線' },
    { id: 'dap.extrema', topic: 'derivative-app', label: '臨界點與極值' },
    { id: 'dap.shape', topic: 'derivative-app', label: '遞增遞減與凹凸' },
    { id: 'dap.optimize', topic: 'derivative-app', label: '最佳化應用' },
    { id: 'dap.related', topic: 'derivative-app', label: '相關變率' },
    { id: 'dap.mvt', topic: 'derivative-app', label: '均值定理與線性近似' },
    { id: 'dap.lhopital', topic: 'derivative-app', label: '羅必達法則' },
    // 積分
    { id: 'int.basic', topic: 'integral', label: '基本反導數' },
    { id: 'int.ftc', topic: 'integral', label: '微積分基本定理（含上限為函數）' },
    { id: 'int.props', topic: 'integral', label: '定積分性質與奇偶性' },
    { id: 'int.area', topic: 'integral', label: '面積與應用' },
    { id: 'int.riemann', topic: 'integral', label: '黎曼和' },
    { id: 'int.improper', topic: 'integral', label: '瑕積分' },
    { id: 'int.volume', topic: 'integral', label: '旋轉體體積' },
    // 積分技巧
    { id: 'itc.sub', topic: 'integral-tech', label: '變數變換' },
    { id: 'itc.parts', topic: 'integral-tech', label: '分部積分' },
    { id: 'itc.trig', topic: 'integral-tech', label: '三角函數積分（降冪／奇次方）' },
    { id: 'itc.partial', topic: 'integral-tech', label: '部分分式' },
    { id: 'itc.trigsub', topic: 'integral-tech', label: '三角代換' },
    { id: 'itc.radical', topic: 'integral-tech', label: '根式代換' },
    // 級數與泰勒
    { id: 'ser.geometric', topic: 'series', label: '等比級數' },
    { id: 'ser.tests', topic: 'series', label: '審斂法（比值／積分／p 級數）' },
    { id: 'ser.alternating', topic: 'series', label: '交錯級數' },
    { id: 'ser.radius', topic: 'series', label: '收斂區間與半徑' },
    { id: 'ser.taylor', topic: 'series', label: '泰勒與麥克勞林展開' },
    { id: 'ser.approx', topic: 'series', label: '泰勒近似' }
  ];

  // 用代號查觀念：byId['der.chain'] → { id, topic, label }
  var byId = {};
  list.forEach(function (concept) { byId[concept.id] = concept; });

  Calc.concepts = {
    list: list,
    byId: byId,
    // 取得中文名稱；查不到（例如代號打錯）就直接顯示代號，畫面不會壞掉。
    label: function (id) { return byId[id] ? byId[id].label : id; },
    // 列出某個主題的所有觀念
    forTopic: function (topic) {
      return list.filter(function (concept) { return concept.topic === topic; });
    }
  };
  if (typeof module !== 'undefined') module.exports = Calc.concepts;
}(typeof window !== 'undefined' ? window : globalThis));
