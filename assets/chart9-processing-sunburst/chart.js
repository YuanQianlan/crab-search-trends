(function () {
  "use strict";

  const fontFamily = '"Times New Roman","SimSun","宋体",serif';
  const payload = {"total":505,"sourceTotal":511,"removed":6,"data":[{"name":"\u6709\u9650\u8d23\u4efb\u516c\u53f8","value":334,"itemStyle":{"color":"#8FA7A0"},"children":[{"name":"\u5fae\u578b","value":117,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":72},{"name":"100-500\u4e07","value":25},{"name":"500-1000\u4e07","value":10},{"name":"1000-5000\u4e07","value":8},{"name":"5000\u4e07\u4ee5\u4e0a","value":2}]},{"name":"\u5c0f\u578b","value":147,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":29},{"name":"100-500\u4e07","value":110},{"name":"500-1000\u4e07","value":1},{"name":"1000-5000\u4e07","value":5},{"name":"5000\u4e07\u4ee5\u4e0a","value":2}]},{"name":"\u4e2d\u578b","value":56,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":1},{"name":"500-1000\u4e07","value":23},{"name":"1000-5000\u4e07","value":32}]},{"name":"\u5927\u578b","value":12,"children":[{"name":"1000-5000\u4e07","value":8},{"name":"5000\u4e07\u4ee5\u4e0a","value":4}]},{"name":"\u672a\u62ab\u9732\u89c4\u6a21","value":2,"children":[{"name":"\u672a\u62ab\u9732\u6ce8\u518c\u8d44\u672c","value":2}]}]},{"name":"\u4e2a\u4f53\u5de5\u5546\u6237","value":110,"itemStyle":{"color":"#B7A6BD"},"children":[{"name":"\u5fae\u578b","value":110,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":74},{"name":"100-500\u4e07","value":10},{"name":"\u672a\u62ab\u9732\u6ce8\u518c\u8d44\u672c","value":26}]}]},{"name":"\u519c\u6c11\u4e13\u4e1a\u5408\u4f5c\u793e","value":39,"itemStyle":{"color":"#C6A59B"},"children":[{"name":"\u5fae\u578b","value":9,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":3},{"name":"100-500\u4e07","value":5},{"name":"1000-5000\u4e07","value":1}]},{"name":"\u5c0f\u578b","value":18,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":4},{"name":"100-500\u4e07","value":13},{"name":"500-1000\u4e07","value":1}]},{"name":"\u4e2d\u578b","value":10,"children":[{"name":"500-1000\u4e07","value":9},{"name":"1000-5000\u4e07","value":1}]},{"name":"\u5927\u578b","value":2,"children":[{"name":"1000-5000\u4e07","value":1},{"name":"5000\u4e07\u4ee5\u4e0a","value":1}]}]},{"name":"\u4e2a\u4eba\u72ec\u8d44\u4f01\u4e1a","value":18,"itemStyle":{"color":"#A9B7CE"},"children":[{"name":"\u5fae\u578b","value":12,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":10},{"name":"100-500\u4e07","value":2}]},{"name":"\u5c0f\u578b","value":6,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":1},{"name":"100-500\u4e07","value":4},{"name":"500-1000\u4e07","value":1}]}]},{"name":"\u80a1\u4efd\u6709\u9650\u516c\u53f8","value":2,"itemStyle":{"color":"#C7B98E"},"children":[{"name":"\u5c0f\u578b","value":1,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":1}]},{"name":"\u5927\u578b","value":1,"children":[{"name":"5000\u4e07\u4ee5\u4e0a","value":1}]}]},{"name":"\u5408\u4f19\u4f01\u4e1a","value":2,"itemStyle":{"color":"#9FB7AD"},"children":[{"name":"\u5fae\u578b","value":2,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":1},{"name":"100-500\u4e07","value":1}]}]}],"legend":[{"name":"\u6709\u9650\u8d23\u4efb\u516c\u53f8","value":334,"color":"#8FA7A0"},{"name":"\u4e2a\u4f53\u5de5\u5546\u6237","value":110,"color":"#B7A6BD"},{"name":"\u519c\u6c11\u4e13\u4e1a\u5408\u4f5c\u793e","value":39,"color":"#C6A59B"},{"name":"\u4e2a\u4eba\u72ec\u8d44\u4f01\u4e1a","value":18,"color":"#A9B7CE"},{"name":"\u80a1\u4efd\u6709\u9650\u516c\u53f8","value":2,"color":"#C7B98E"},{"name":"\u5408\u4f19\u4f01\u4e1a","value":2,"color":"#9FB7AD"}]};

  const chart = echarts.init(document.getElementById("chart"), null, { renderer: "canvas" });
  const legend = document.getElementById("legend");
  const scaleColors = {
    "\u5fae\u578b": "#C7B99A",
    "\u5c0f\u578b": "#A9B89D",
    "\u4e2d\u578b": "#9EB3C5",
    "\u5927\u578b": "#B79AA2",
    "\u672a\u62ab\u9732\u89c4\u6a21": "#C3BEB6"
  };
  const capitalColors = {
    "100\u4e07\u4ee5\u4e0b": "#D7C8A8",
    "100-500\u4e07": "#B8C6A7",
    "500-1000\u4e07": "#A9BCCB",
    "1000-5000\u4e07": "#C4A8AA",
    "5000\u4e07\u4ee5\u4e0a": "#B8AAC8",
    "\u672a\u62ab\u9732\u6ce8\u518c\u8d44\u672c": "#CBC5BB"
  };

  function applyPalette(nodes, depth) {
    nodes.forEach(function (node) {
      if (depth === 1) {
        node.itemStyle = { color: scaleColors[node.name] || "#BDB5A8" };
      }
      if (depth === 2) {
        node.itemStyle = { color: capitalColors[node.name] || "#C9BDB2" };
      }
      if (node.children) applyPalette(node.children, depth + 1);
    });
  }

  applyPalette(payload.data, 0);

  legend.innerHTML = payload.legend.map(function (item) {
    return '<div class="legend-item"><span class="legend-dot" style="background:' + item.color + '"></span><span>' +
      item.name + '</span><span class="legend-count">' + item.value + '</span></div>';
  }).join("");

  function percent(value) {
    return (value / payload.total * 100).toFixed(1) + "%";
  }

  chart.setOption({
    backgroundColor: "#FAF2E6",
    animationDuration: 800,
    textStyle: {
      fontFamily: fontFamily,
      color: "#3f3f3b"
    },
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove|click",
      confine: true,
      backgroundColor: "rgba(255,250,243,.98)",
      borderColor: "#cfc1b4",
      borderWidth: 1,
      padding: [9, 12],
      textStyle: {
        color: "#454642",
        fontFamily: fontFamily,
        fontSize: 13
      },
      extraCssText: "box-shadow:0 6px 18px rgba(86,72,62,.14);border-radius:7px;",
      formatter: function (params) {
        const value = Number(params.value) || 0;
        return "<b>" + params.name + "</b><br>数量：" + value + " 家<br>占比：" + percent(value);
      }
    },
    series: {
      type: "sunburst",
      radius: ["13%", "86%"],
      center: ["44%", "52%"],
      sort: undefined,
      emphasis: {
        focus: "ancestor"
      },
      data: payload.data,
      nodeClick: "rootToNode",
      itemStyle: {
        borderColor: "#FAF2E6",
        borderWidth: 2
      },
      label: {
        rotate: "radial",
        color: "#3f3f3b",
        fontFamily: fontFamily,
        fontSize: 12,
        minAngle: 7
      },
      levels: [
        {},
        {
          r0: "13%",
          r: "36%",
          label: {
            rotate: 0,
            fontSize: 13,
            fontWeight: 700
          }
        },
        {
          r0: "36%",
          r: "62%",
          label: {
            fontSize: 12
          }
        },
        {
          r0: "62%",
          r: "86%",
          label: {
            fontSize: 11
          }
        }
      ]
    }
  });

  window.addEventListener("resize", function () {
    chart.resize();
  });
})();
