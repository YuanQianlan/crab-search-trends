(function () {
  "use strict";

  const palette = {
    production: "#2d6f8b",
    sales: "#d68a4a",
    both: "#438477",
  };

  const roles = {
    production: ["新疆维吾尔自治区", "青海省"],
    sales: ["北京市", "天津市", "河北省", "河南省", "上海市", "福建省", "广东省", "四川省", "重庆市"],
    both: ["江苏省", "浙江省", "山东省", "安徽省", "湖北省", "湖南省", "江西省", "辽宁省", "吉林省", "黑龙江省"],
  };

  const rawLinks = [
    ["江苏省", "上海市", 2.815425693977918], ["江苏省", "山东省", 4.946248996895196],
    ["江苏省", "湖北省", 4.719295067983649], ["江苏省", "浙江省", 2.257581102528921],
    ["江苏省", "广东省", 10.495807722732167], ["湖北省", "江苏省", 4.719295067983654],
    ["湖北省", "广东省", 7.519652862886004], ["湖北省", "河南省", 4.238443521199159],
    ["湖北省", "湖南省", 2.705433516233047], ["湖北省", "江西省", 2.482688881866904],
    ["安徽省", "广东省", 9.623474128840728], ["安徽省", "福建省", 6.128251543669411],
    ["安徽省", "江苏省", 1.508396145351896], ["安徽省", "浙江省", 3.296507416441314],
    ["辽宁省", "山东省", 8.21048815460787], ["辽宁省", "浙江省", 11.983695063886842],
    ["辽宁省", "四川省", 22.364471325217888], ["辽宁省", "河南省", 12.046037496267532],
    ["青海省", "重庆市", 8.489450300000257], ["新疆维吾尔自治区", "广东省", 33.13184131316921],
    ["新疆维吾尔自治区", "浙江省", 35.448304873370866], ["黑龙江省", "辽宁省", 5.10080976029772],
    ["黑龙江省", "吉林省", 2.276489198982671], ["黑龙江省", "北京市", 11.80770911186634],
    ["黑龙江省", "天津市", 11.535731411030495], ["黑龙江省", "河北省", 14.406062288704337],
    ["江西省", "北京市", 11.25796756413728], ["江西省", "广东省", 6.152056805306181],
    ["江西省", "山东省", 8.06741597378324], ["江西省", "湖南省", 2.957135586318278],
    ["浙江省", "上海市", 1.631363932786469], ["浙江省", "江苏省", 2.257581102528921],
    ["浙江省", "北京市", 10.373537445518759], ["浙江省", "广东省", 9.935908230865396],
    ["浙江省", "四川省", 16.09265737472983], ["山东省", "江苏省", 4.946248996895201],
    ["山东省", "浙江省", 7.136986291601767], ["山东省", "安徽省", 4.811413590386409],
    ["山东省", "江西省", 8.067415973783236], ["山东省", "上海市", 7.030075794306076],
    ["湖南省", "湖北省", 2.705433516233049], ["湖南省", "广东省", 5.089634236392963],
    ["湖南省", "江苏省", 6.95394156429682], ["湖南省", "江西省", 2.957135586318277],
    ["吉林省", "辽宁省", 2.831676608595414], ["吉林省", "黑龙江省", 2.276489198982672],
    ["吉林省", "上海市", 13.231333026722679], ["吉林省", "江苏省", 13.544653552141417],
    ["吉林省", "浙江省", 14.579148123860909], ["吉林省", "广东省", 24.074860999146708],
    ["吉林省", "北京市", 9.781427028789869], ["吉林省", "河北省", 12.31506135326493],
    ["吉林省", "天津市", 9.411460605017899],
  ];

  const chartElement = document.getElementById("chordChart");
  if (!window.echarts || !chartElement) return;

  const fontFamily = '"Times New Roman", "SimSun", "宋体", serif';
  const orderedNames = [...roles.sales, ...roles.both, ...roles.production];
  const roleOf = (name) => roles.production.includes(name)
    ? "production"
    : roles.sales.includes(name) ? "sales" : "both";
  const shortName = (name) => name
    .replace("新疆维吾尔自治区", "新疆")
    .replace(/(壮族自治区|回族自治区|维吾尔自治区|自治区|特别行政区|省|市)$/u, "");

  const stats = Object.fromEntries(orderedNames.map((name) => [name, { out: 0, in: 0 }]));
  rawLinks.forEach(([source, target]) => {
    stats[source].out += 1;
    stats[target].in += 1;
  });

  const data = orderedNames.map((name) => ({
    name,
    role: roleOf(name),
    value: stats[name].out + stats[name].in,
    itemStyle: {
      color: palette[roleOf(name)],
      borderColor: "#fff3c9",
      borderWidth: 3,
      borderRadius: [0, 12],
    },
  }));

  const links = rawLinks.map(([source, target, distance]) => ({
    source,
    target,
    value: 1,
    distance,
  }));

  const chart = echarts.init(chartElement, null, { renderer: "canvas" });
  chart.setOption({
    backgroundColor: "transparent",
    textStyle: { fontFamily },
    animationDuration: 1000,
    animationEasing: "cubicOut",
    tooltip: { show: false },
    series: [{
      type: "chord",
      name: "省际生产与消费联系",
      center: ["50%", "47%"],
      radius: ["61%", "79%"],
      startAngle: 118,
      clockwise: true,
      padAngle: 1.2,
      data,
      links,
      lineStyle: { opacity: 0.34, color: "gradient" },
      emphasis: {
        focus: "adjacency",
        lineStyle: { opacity: 0.82 },
      },
      blur: {
        itemStyle: { opacity: 0.16 },
        lineStyle: { opacity: 0.025 },
        label: { opacity: 0.2 },
      },
      label: {
        show: true,
        position: "outside",
        distance: 8,
        color: "#18243a",
        fontFamily,
        fontSize: 15,
        fontWeight: 700,
        formatter(params) {
          return `{${roleOf(params.name)}|${shortName(params.name)}}`;
        },
        rich: {
          production: { color: palette.production, fontFamily, fontSize: 15, fontWeight: 700 },
          sales: { color: palette.sales, fontFamily, fontSize: 15, fontWeight: 700 },
          both: { color: palette.both, fontFamily, fontSize: 15, fontWeight: 700 },
        },
      },
    }],
  });

  const resize = () => chart.resize();
  window.addEventListener("resize", resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(chartElement);
})();
