/* 数据注册:各 dataN.js 调用 ACU.m(经脉) */
/* 中文字段统一为全角标点 */
function fw(s) {
  return String(s).replace(/,/g, "，").replace(/;/g, "；").replace(/:/g, "：")
    .replace(/\(/g, "（").replace(/\)/g, "）");
}
window.ACU = {
  list: [], byId: {}, pts: [], byCode: {},
  m: function (def) {
    var prev = ["", ""];
    def.course = fw(def.course); def.ind = fw(def.ind);
    def.pts.forEach(function (a) { a[4] = fw(a[4]); a[6] = fw(a[6]); if (a[8] !== "^") a[8] = fw(a[8]); });
    def.pts = def.pts.map(function (a, i) {
      var nz = a[8] === "^" ? prev[0] : a[8];
      var ne = a[9] === "^" ? prev[1] : a[9];
      prev = [nz, ne];
      return {
        code: a[0], zh: a[1], py: a[2],
        tags: a[3] ? a[3].split(/\s+/) : [],
        loc: a[4], locEn: a[5], ind: a[6], indEn: a[7], ndl: nz, ndlEn: ne,
        m: def.id, i: i
      };
    });
    this.list.push(def);
    this.byId[def.id] = def;
    for (var k = 0; k < def.pts.length; k++) {
      this.pts.push(def.pts[k]);
      this.byCode[def.pts[k].code] = def.pts[k];
    }
  }
};
