(function () {
  "use strict";

  const origin = {
    name: "上海浦东国际机场",
    coord: [121.8052, 31.1443]
  };

  const destinations = [
    { name: "韩国", place: "首尔", level: 1, value: 4082.56, coord: [126.4505, 37.4692] },
    { name: "日本", place: "东京", level: 3, value: null, coord: [140.3929, 35.7720] },
    { name: "澳门", place: "澳门", level: 2, value: 711, coord: [113.5915, 22.1496] },
    { name: "越南", place: "河内", level: 1, value: 1331.44, coord: [105.8067, 21.2187] },
    { name: "新加坡", place: "新加坡", level: 3, value: 729, coord: [103.9940, 1.3644] },
    { name: "美国", place: "洛杉矶", level: 3, value: null, coord: [-118.4085, 33.9416] },
    { name: "欧盟", place: "布鲁塞尔", level: 3, value: null, coord: [4.4844, 50.9010] },
    { name: "香港", place: "香港", level: 2, value: 2308, coord: [113.9185, 22.3080] },
    { name: "马来西亚", place: "吉隆坡", level: 3, value: null, coord: [101.7090, 2.7456] }
  ];

  const levelColors = {
    1: "#c94f36",
    2: "#e78a3d",
    3: "#4f9690"
  };
  const chinaRegionNames = [
    "北京市", "天津市", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省",
    "上海市", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省",
    "湖北省", "湖南省", "广东省", "广西壮族自治区", "海南省", "重庆市", "四川省", "贵州省",
    "云南省", "西藏自治区", "陕西省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区",
    "台湾省", "香港特别行政区", "澳门特别行政区"
  ];
  const fontFamily = '"Times New Roman", "SimSun", "宋体", serif';
  const numberFormat = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 });
  const chartElement = document.getElementById("chart");
  const loadingElement = document.getElementById("loading");
  const listElement = document.getElementById("destination-list");
  const chart = echarts.init(chartElement, null, { renderer: "canvas" });

  function routeColor(item) {
    return levelColors[item.level] || levelColors[3];
  }

  function renderList() {
    listElement.innerHTML = destinations.map(function (item) {
      const value = item.value == null ? "暂无数据" : numberFormat.format(item.value);
      return '<div class="destination-row" style="--route-color:' + routeColor(item) + '">' +
        '<div class="destination-name"><span class="destination-dot"></span><span>' + item.name +
        '</span><span class="destination-level">L' + item.level + '</span></div>' +
        '<div class="destination-value' + (item.value == null ? ' is-null' : '') + '">' + value + '</div>' +
      '</div>';
    }).join("");
  }

  function lineData(items) {
    return items.map(function (item) {
      return {
        name: origin.name + " → " + item.name,
        coords: [origin.coord, item.coord],
        destination: item.name,
        place: item.place,
        level: item.level,
        exportValue: item.value,
        lineStyle: {
          color: routeColor(item),
          width: item.value == null ? 1.1 : Math.min(3.2, 1.3 + Math.sqrt(item.value) / 38),
          opacity: item.value == null ? 0.34 : 0.78
        }
      };
    });
  }

  function tooltipText(item) {
    const value = item.exportValue == null
      ? "暂无出口量数据"
      : numberFormat.format(item.exportValue) + " 吨";
    return '<b>' + origin.name + ' → ' + item.destination + '</b><br>' +
      '到达城市：' + item.place + '<br>' +
      '等级：' + item.level + '<br>' +
      '出口量：<b>' + value + '</b>';
  }

  function buildOption() {
    return {
      backgroundColor: "#FAF2E6",
      textStyle: {
        fontFamily: fontFamily,
        color: "#453f39"
      },
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: "rgba(255,250,243,.97)",
        borderColor: "#baa89a",
        borderWidth: 1,
        padding: [10, 13],
        textStyle: {
          color: "#403b36",
          fontFamily: fontFamily,
          fontSize: 13
        },
        formatter: function (params) {
          if (params.seriesType === "lines3D") return tooltipText(params.data);
          const item = params.data || {};
          if (item.isOrigin) return "<b>上海浦东国际机场</b><br>大闸蟹出口起点";
          return tooltipText(item);
        }
      },
      geo3D: {
        map: "world",
        left: "0%",
        right: "19%",
        top: "7%",
        bottom: "2%",
        regionHeight: 1.6,
        shading: "lambert",
        environment: "#FAF2E6",
        groundPlane: { show: false },
        itemStyle: {
          color: "#aabcae",
          borderColor: "#777d73",
          borderWidth: 1.1,
          opacity: 1
        },
        regions: chinaRegionNames.map(function (name) {
          return {
            name: name,
            itemStyle: {
              color: "#8fae8e",
              borderColor: "#4f7161",
              borderWidth: 1.5
            }
          };
        }),
        emphasis: {
          itemStyle: { color: "#9bab91" },
          label: { show: false }
        },
        label: { show: false },
        light: {
          main: { intensity: 1.15, alpha: 38, beta: 22, shadow: true },
          ambient: { intensity: 0.72 }
        },
        postEffect: {
          enable: true,
          SSAO: { enable: true, radius: 3, intensity: 0.7 },
          FXAA: { enable: true }
        },
        temporalSuperSampling: { enable: true },
        viewControl: {
          projection: "perspective",
          distance: 92,
          alpha: 63,
          beta: -18,
          minDistance: 55,
          maxDistance: 145,
          panMouseButton: "middle",
          rotateMouseButton: "left",
          autoRotate: true,
          autoRotateSpeed: 1.8,
          autoRotateAfterStill: 7,
          damping: 0.8
        }
      },
      series: [
        {
          name: "出口航线",
          type: "lines3D",
          coordinateSystem: "geo3D",
          polyline: false,
          blendMode: "source-over",
          effect: {
            show: true,
            period: 5,
            trailWidth: 2.4,
            trailLength: 0.16,
            trailOpacity: 0.85,
            constantSpeed: 14
          },
          lineStyle: {
            width: 1.5,
            opacity: 0.68,
            color: "#c94f36"
          },
          data: lineData(destinations)
        },
        {
          name: "出口目的地",
          type: "scatter3D",
          coordinateSystem: "geo3D",
          symbol: "circle",
          symbolSize: 9,
          itemStyle: {
            borderColor: "#fffaf3",
            borderWidth: 1.5,
            opacity: 1
          },
          label: {
            show: true,
            distance: 3,
            formatter: function (params) { return params.data.name; },
            textStyle: {
              color: "#4c453f",
              fontFamily: fontFamily,
              fontSize: 12,
              fontWeight: "bold",
              backgroundColor: "rgba(250,242,230,.76)",
              padding: [3, 5],
              borderRadius: 2
            }
          },
          data: destinations.map(function (item) {
            return {
              name: item.name,
              value: item.coord.concat(item.value || 0),
              destination: item.name,
              place: item.place,
              level: item.level,
              exportValue: item.value,
              itemStyle: { color: routeColor(item) }
            };
          })
        },
        {
          name: "出口起点",
          type: "scatter3D",
          coordinateSystem: "geo3D",
          symbol: "circle",
          symbolSize: 15,
          itemStyle: {
            color: "#b8452f",
            borderColor: "#fffaf3",
            borderWidth: 3
          },
          label: { show: false },
          data: [{ name: origin.name, value: origin.coord.concat(0), isOrigin: true }]
        }
      ]
    };
  }

  renderList();

  fetch("./assets/crab-export-routes/world-custom-china.json")
    .then(function (response) {
      if (!response.ok) throw new Error("世界地图数据加载失败");
      return response.json();
    })
    .then(function (world) {
      echarts.registerMap("world", world);
      chart.setOption(buildOption());
      loadingElement.classList.add("is-hidden");
    })
    .catch(function (error) {
      loadingElement.textContent = error.message + "，请通过本地服务器或 GitHub Pages 打开。";
    });

  window.addEventListener("resize", function () {
    chart.resize();
  });
})();
