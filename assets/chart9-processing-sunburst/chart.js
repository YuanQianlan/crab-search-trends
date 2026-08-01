(function () {
  "use strict";

  const fontFamily = '"Times New Roman","SimSun","宋体",serif';
  const payload = {"total":505,"sourceTotal":511,"removed":6,"data":[{"name":"\u6709\u9650\u8d23\u4efb\u516c\u53f8","value":334,"itemStyle":{"color":"#8FA7A0"},"children":[{"name":"\u5fae\u578b","value":117,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":72},{"name":"100-500\u4e07","value":25},{"name":"500-1000\u4e07","value":10},{"name":"1000-5000\u4e07","value":8},{"name":"5000\u4e07\u4ee5\u4e0a","value":2}]},{"name":"\u5c0f\u578b","value":147,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":29},{"name":"100-500\u4e07","value":110},{"name":"500-1000\u4e07","value":1},{"name":"1000-5000\u4e07","value":5},{"name":"5000\u4e07\u4ee5\u4e0a","value":2}]},{"name":"\u4e2d\u578b","value":56,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":1},{"name":"500-1000\u4e07","value":23},{"name":"1000-5000\u4e07","value":32}]},{"name":"\u5927\u578b","value":12,"children":[{"name":"1000-5000\u4e07","value":8},{"name":"5000\u4e07\u4ee5\u4e0a","value":4}]},{"name":"\u672a\u62ab\u9732\u89c4\u6a21","value":2,"children":[{"name":"\u672a\u62ab\u9732\u6ce8\u518c\u8d44\u672c","value":2}]}]},{"name":"\u4e2a\u4f53\u5de5\u5546\u6237","value":110,"itemStyle":{"color":"#B7A6BD"},"children":[{"name":"\u5fae\u578b","value":110,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":74},{"name":"100-500\u4e07","value":10},{"name":"\u672a\u62ab\u9732\u6ce8\u518c\u8d44\u672c","value":26}]}]},{"name":"\u519c\u6c11\u4e13\u4e1a\u5408\u4f5c\u793e","value":39,"itemStyle":{"color":"#C6A59B"},"children":[{"name":"\u5fae\u578b","value":9,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":3},{"name":"100-500\u4e07","value":5},{"name":"1000-5000\u4e07","value":1}]},{"name":"\u5c0f\u578b","value":18,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":4},{"name":"100-500\u4e07","value":13},{"name":"500-1000\u4e07","value":1}]},{"name":"\u4e2d\u578b","value":10,"children":[{"name":"500-1000\u4e07","value":9},{"name":"1000-5000\u4e07","value":1}]},{"name":"\u5927\u578b","value":2,"children":[{"name":"1000-5000\u4e07","value":1},{"name":"5000\u4e07\u4ee5\u4e0a","value":1}]}]},{"name":"\u4e2a\u4eba\u72ec\u8d44\u4f01\u4e1a","value":18,"itemStyle":{"color":"#A9B7CE"},"children":[{"name":"\u5fae\u578b","value":12,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":10},{"name":"100-500\u4e07","value":2}]},{"name":"\u5c0f\u578b","value":6,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":1},{"name":"100-500\u4e07","value":4},{"name":"500-1000\u4e07","value":1}]}]},{"name":"\u80a1\u4efd\u6709\u9650\u516c\u53f8","value":2,"itemStyle":{"color":"#C7B98E"},"children":[{"name":"\u5c0f\u578b","value":1,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":1}]},{"name":"\u5927\u578b","value":1,"children":[{"name":"5000\u4e07\u4ee5\u4e0a","value":1}]}]},{"name":"\u5408\u4f19\u4f01\u4e1a","value":2,"itemStyle":{"color":"#9FB7AD"},"children":[{"name":"\u5fae\u578b","value":2,"children":[{"name":"100\u4e07\u4ee5\u4e0b","value":1},{"name":"100-500\u4e07","value":1}]}]}],"legend":[{"name":"\u6709\u9650\u8d23\u4efb\u516c\u53f8","value":334,"color":"#8FA7A0"},{"name":"\u4e2a\u4f53\u5de5\u5546\u6237","value":110,"color":"#B7A6BD"},{"name":"\u519c\u6c11\u4e13\u4e1a\u5408\u4f5c\u793e","value":39,"color":"#C6A59B"},{"name":"\u4e2a\u4eba\u72ec\u8d44\u4f01\u4e1a","value":18,"color":"#A9B7CE"},{"name":"\u80a1\u4efd\u6709\u9650\u516c\u53f8","value":2,"color":"#C7B98E"},{"name":"\u5408\u4f19\u4f01\u4e1a","value":2,"color":"#9FB7AD"}]};

  const chart = echarts.init(document.getElementById("chart"), null, { renderer: "canvas" });
  const legend = document.getElementById("legend");
  const typeColors = ["#F6423D", "#FF8A72", "#FFB39C", "#E0E0E0", "#FF6F5E", "#D9D9D9"];
  const scaleColors = {
    "\u5fae\u578b": "#FFB39C",
    "\u5c0f\u578b": "#FF8A72",
    "\u4e2d\u578b": "#F6423D",
    "\u5927\u578b": "#E0E0E0",
    "\u672a\u62ab\u9732\u89c4\u6a21": "#D6D6D6"
  };
  const capitalColors = {
    "100\u4e07\u4ee5\u4e0b": "#FFB39C",
    "100-500\u4e07": "#FF806A",
    "500-1000\u4e07": "#F6423D",
    "1000-5000\u4e07": "#E0E0E0",
    "5000\u4e07\u4ee5\u4e0a": "#FF5F50",
    "\u672a\u62ab\u9732\u6ce8\u518c\u8d44\u672c": "#D8D8D8"
  };

  function applyPalette(nodes, depth) {
    nodes.forEach(function (node, index) {
      if (depth === 0) {
        node.itemStyle = { color: typeColors[index % typeColors.length] };
      }
      if (depth === 1) {
        node.itemStyle = { color: scaleColors[node.name] || "#BDB5A8" };
      }
      if (depth === 2) {
        node.itemStyle = { color: capitalColors[node.name] || "#C9BDB2" };
      }
      if (node.children) applyPalette(node.children, depth + 1);
    });
  }

  function addBlankSectors(nodes) {
    nodes.forEach(function (node) {
      if (!node.children || !node.children.length) return;
      const childTotal = node.children.reduce(function (sum, child) {
        return sum + (Number(child.value) || 0);
      }, 0);
      const gap = (Number(node.value) || 0) - childTotal;
      if (gap > 0) {
        node.children.push({
          name: "",
          value: gap,
          itemStyle: { color: "transparent", borderWidth: 0 },
          label: { show: false },
          emphasis: { disabled: true },
          tooltip: { show: false },
          silent: true
        });
      }
      addBlankSectors(node.children);
    });
  }

  function rememberRawValues(nodes) {
    nodes.forEach(function (node) {
      node.rawValue = Number(node.value) || 0;
      if (node.children) rememberRawValues(node.children);
    });
  }

  function spacer(value) {
    return {
      name: "",
      value: value,
      itemStyle: { color: "#FAF2E6", borderColor: "#FAF2E6", borderWidth: 0 },
      label: { show: false },
      emphasis: { disabled: true },
      tooltip: { show: false },
      silent: true,
      isSpacer: true
    };
  }

  function addVisualGaps(nodes, depth) {
    nodes.forEach(function (node) {
      if (node.children) addVisualGaps(node.children, depth + 1);
    });
    if (!nodes.length) return;
    const gapValue = depth === 0 ? 10 : (depth === 1 ? 4 : 1.2);
    const next = [];
    nodes.forEach(function (node, index) {
      next.push(node);
      if (index < nodes.length - 1) next.push(spacer(gapValue));
    });
    nodes.length = 0;
    Array.prototype.push.apply(nodes, next);
  }

  function updateVisualValues(nodes) {
    nodes.forEach(function (node) {
      if (node.children && node.children.length) {
        updateVisualValues(node.children);
        node.value = node.children.reduce(function (sum, child) {
          return sum + (Number(child.value) || 0);
        }, 0);
      }
    });
  }

  function clarifyCapitalLabels(nodes, depth) {
    const names = {
      "100\u4e07\u4ee5\u4e0b": "100\u4e07\u5143\u4ee5\u4e0b",
      "100-500\u4e07": "100\u4e07-500\u4e07\u5143",
      "500-1000\u4e07": "500\u4e07-1000\u4e07\u5143",
      "1000-5000\u4e07": "1000\u4e07-5000\u4e07\u5143",
      "5000\u4e07\u4ee5\u4e0a": "5000\u4e07\u5143\u4ee5\u4e0a"
    };
    nodes.forEach(function (node) {
      if (depth === 2 && names[node.name]) node.name = names[node.name];
      if (node.children) clarifyCapitalLabels(node.children, depth + 1);
    });
  }

  applyPalette(payload.data, 0);

  legend.innerHTML = payload.legend.map(function (item) {
    const color = typeColors[payload.legend.indexOf(item) % typeColors.length];
    return '<div class="legend-item"><span class="legend-dot" style="background:' + color + '"></span><span>' +
      item.name + '</span></div>';
  }).join("");

  const typeOrder = [
    "\u6709\u9650\u8d23\u4efb\u516c\u53f8",
    "\u519c\u6c11\u4e13\u4e1a\u5408\u4f5c\u793e",
    "\u4e2a\u4f53\u5de5\u5546\u6237",
    "\u4e2a\u4eba\u72ec\u8d44\u4f01\u4e1a",
    "\u5408\u4f19\u4f01\u4e1a",
    "\u80a1\u4efd\u6709\u9650\u516c\u53f8"
  ];
  payload.data.sort(function (a, b) {
    return typeOrder.indexOf(a.name) - typeOrder.indexOf(b.name);
  });
  rememberRawValues(payload.data);
  addVisualGaps(payload.data, 0);
  addBlankSectors(payload.data);
  updateVisualValues(payload.data);
  clarifyCapitalLabels(payload.data, 0);

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
        if (params.data && params.data.isSpacer) return "";
        const value = Number(params.data && params.data.rawValue) || Number(params.value) || 0;
        return "<b>" + params.name + "</b><br>数量：" + value + " 家<br>占比：" + percent(value);
      }
    },
    series: {
      type: "sunburst",
      radius: ["13%", "86%"],
      center: ["44%", "45%"],
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
        minAngle: 12,
        formatter: function (params) {
          if (params.data && params.data.isSpacer) return "";
          const value = Number(params.data && params.data.rawValue) || Number(params.value) || 0;
          return value < 8 ? "" : params.name;
        }
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
            show: false
          }
        }
      ]
    }
  });

  window.addEventListener("resize", function () {
    chart.resize();
  });
})();
