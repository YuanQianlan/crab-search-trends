(function () {
  "use strict";

  const mapCenterLongitude = 105;
  const fontFamily = '"Times New Roman", "SimSun", "宋体", serif';
  const numberFormat = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 });
  const chartElement = document.getElementById("chart");
  const loadingElement = document.getElementById("loading");
  const listElement = document.getElementById("destination-list");
  const chart = echarts.init(chartElement, null, { renderer: "canvas" });

  const origin = {
    name: "上海浦东国际机场",
    coord: [121.8052, 31.1443]
  };

  const destinations = [
    { name: "韩国", place: "首尔", level: 1, value: 4082.56, coord: [126.4505, 37.4692], labelPosition: "right" },
    { name: "日本", place: "东京", level: 3, value: null, coord: [140.3929, 35.7720], labelPosition: "right" },
    { name: "澳门", place: "澳门", level: 2, value: 711, coord: [113.5915, 22.1496], labelPosition: "left" },
    { name: "越南", place: "河内", level: 1, value: 1331.44, coord: [105.8067, 21.2187], labelPosition: "left" },
    { name: "新加坡", place: "新加坡", level: 3, value: 729, coord: [103.9940, 1.3644], labelPosition: "left" },
    { name: "美国", place: "洛杉矶", level: 3, value: null, coord: [-118.4085, 33.9416], labelPosition: "left" },
    { name: "欧盟", place: "布鲁塞尔", level: 3, value: null, coord: [4.4844, 50.9010], labelPosition: "right" },
    { name: "香港", place: "香港", level: 2, value: 2308, coord: [113.9185, 22.3080], labelPosition: "right" },
    { name: "马来西亚", place: "吉隆坡", level: 3, value: null, coord: [101.7090, 2.7456], labelPosition: "right" }
  ];

  const levelColors = {
    1: "#bf563c",
    2: "#d48732",
    3: "#3e7e83"
  };

  const chinaRegionNames = [
    "北京市", "天津市", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省",
    "上海市", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省",
    "湖北省", "湖南省", "广东省", "广西壮族自治区", "海南省", "重庆市", "四川省", "贵州省",
    "云南省", "西藏自治区", "陕西省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区",
    "台湾省", "香港特别行政区", "澳门特别行政区"
  ];

  function routeColor(item) {
    return levelColors[item.level] || levelColors[3];
  }

  function shiftLongitude(longitude) {
    return longitude < 0 ? longitude + 360 : longitude;
  }

  function shiftCoord(coord) {
    return [shiftLongitude(coord[0]), coord[1]];
  }

  function shiftRing(ring) {
    let previousLongitude = null;
    return ring.map(function (point) {
      let longitude = shiftLongitude(point[0]);
      if (previousLongitude !== null) {
        while (longitude - previousLongitude > 180) longitude -= 360;
        while (longitude - previousLongitude < -180) longitude += 360;
      }
      previousLongitude = longitude;
      return [longitude, point[1]];
    });
  }

  function shiftGeometry(geometry) {
    if (!geometry) return geometry;
    if (geometry.type === "Polygon") {
      return {
        type: geometry.type,
        coordinates: geometry.coordinates.map(shiftRing)
      };
    }
    if (geometry.type === "MultiPolygon") {
      return {
        type: geometry.type,
        coordinates: geometry.coordinates.map(function (polygon) {
          return polygon.map(shiftRing);
        })
      };
    }
    return geometry;
  }

  function shiftWorld(world) {
    return {
      type: world.type,
      crs: world.crs,
      features: world.features.map(function (feature) {
        return {
          type: feature.type,
          properties: feature.properties,
          geometry: shiftGeometry(feature.geometry)
        };
      })
    };
  }

  function renderList() {
    listElement.innerHTML = destinations.map(function (item) {
      const value = item.value == null ? "暂无数据" : numberFormat.format(item.value);
      return '<div class="destination-row" style="--route-color:' + routeColor(item) + '">' +
        '<div class="destination-name"><span class="destination-dot"></span><span>' + item.name +
        '</span><span class="destination-level">L' + item.level + '</span></div>' +
        '<div class="destination-value' + (item.value == null ? " is-null" : "") + '">' + value + "</div>" +
      "</div>";
    }).join("");
  }

  function lineData(items) {
    return items.map(function (item) {
      const width = item.value == null ? 2.4 : Math.min(5.8, 2.8 + Math.sqrt(item.value) / 23);
      return {
        name: origin.name + " → " + item.name,
        coords: [shiftCoord(origin.coord), shiftCoord(item.coord)],
        destination: item.name,
        place: item.place,
        level: item.level,
        exportValue: item.value,
        lineStyle: {
          color: routeColor(item),
          width: width,
          opacity: item.value == null ? 0.54 : 0.9,
          curveness: item.coord[1] >= origin.coord[1] ? 0.14 : -0.12
        }
      };
    });
  }

  function tooltipText(item) {
    const value = item.exportValue == null
      ? "暂无出口量数据"
      : numberFormat.format(item.exportValue) + " 吨";
    return "<b>" + origin.name + " → " + item.destination + "</b><br>" +
      "到达城市：" + item.place + "<br>" +
      "线路等级：L" + item.level + "<br>" +
      "出口量：<b>" + value + "</b>";
  }

  function buildOption() {
    const shiftedOrigin = shiftCoord(origin.coord);
    const shiftedDestinations = destinations.map(function (item) {
      return {
        name: item.name,
        value: shiftCoord(item.coord),
        destination: item.name,
        place: item.place,
        level: item.level,
        exportValue: item.value,
        label: { position: item.labelPosition },
        itemStyle: { color: routeColor(item) }
      };
    });

    return {
      backgroundColor: "#FAF2E6",
      animationDuration: 900,
      textStyle: {
        fontFamily: fontFamily,
        color: "#4b4038"
      },
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: "rgba(255, 250, 243, 0.98)",
        borderColor: "#bda18a",
        borderWidth: 1,
        padding: [10, 13],
        textStyle: {
          color: "#403a35",
          fontFamily: fontFamily,
          fontSize: 13
        },
        formatter: function (params) {
          if (params.seriesType === "lines") return tooltipText(params.data);
          const item = params.data || {};
          if (item.isOrigin) {
            return "<b>" + origin.name + "</b><br>大闸蟹出口起点";
          }
          return tooltipText(item);
        }
      },
      geo: {
        map: "world-shifted",
        left: "4%",
        right: "24%",
        top: "14%",
        bottom: "8%",
        center: [mapCenterLongitude, 25],
        zoom: 1.03,
        roam: true,
        silent: false,
        itemStyle: {
          areaColor: "#e8dac8",
          borderColor: "#a8937f",
          borderWidth: 0.8
        },
        regions: chinaRegionNames.map(function (name) {
          return {
            name: name,
            itemStyle: {
              areaColor: "#d4ad91",
              borderColor: "#92684f",
              borderWidth: 1.05
            }
          };
        }),
        emphasis: {
          itemStyle: {
            areaColor: "#dec0a7",
            borderColor: "#7d5947",
            borderWidth: 1.2
          },
          label: { show: false }
        },
        label: { show: false }
      },
      series: [
        {
          name: "航线光晕",
          type: "lines",
          coordinateSystem: "geo",
          zlevel: 1,
          silent: true,
          lineStyle: {
            width: 10,
            opacity: 0.08,
            curveness: 0.12,
            shadowBlur: 12,
            shadowColor: "#c8794e"
          },
          data: lineData(destinations)
        },
        {
          name: "大闸蟹出口航线",
          type: "lines",
          coordinateSystem: "geo",
          zlevel: 2,
          effect: {
            show: true,
            period: 4.2,
            trailLength: 0.34,
            trailWidth: 2.6,
            trailOpacity: 0.76,
            symbol: "circle",
            symbolSize: 6
          },
          lineStyle: {
            width: 3.3,
            opacity: 0.86,
            curveness: 0.12
          },
          data: lineData(destinations)
        },
        {
          name: "出口目的地",
          type: "scatter",
          coordinateSystem: "geo",
          zlevel: 4,
          symbol: "circle",
          symbolSize: 13,
          itemStyle: {
            borderColor: "#fffaf3",
            borderWidth: 2,
            shadowBlur: 7,
            shadowColor: "rgba(120, 85, 59, 0.32)"
          },
          label: {
            show: true,
            distance: 7,
            formatter: function (params) {
              return params.data.name;
            },
            color: "#443a34",
            fontFamily: '"SimSun", "宋体", serif',
            fontSize: 14,
            fontWeight: "bold",
            backgroundColor: "rgba(250, 242, 230, 0.82)",
            padding: [3, 5],
            borderRadius: 2
          },
          data: shiftedDestinations
        },
        {
          name: "出口起点",
          type: "scatter",
          coordinateSystem: "geo",
          zlevel: 5,
          symbol: "circle",
          symbolSize: 18,
          itemStyle: {
            color: "#b64932",
            borderColor: "#fffaf3",
            borderWidth: 3,
            shadowBlur: 9,
            shadowColor: "rgba(182, 73, 50, 0.4)"
          },
          label: {
            show: true,
            position: "bottom",
            distance: 9,
            formatter: "上海浦东国际机场",
            color: "#4b3d35",
            fontFamily: '"SimSun", "宋体", serif',
            fontSize: 13,
            backgroundColor: "rgba(250, 242, 230, 0.88)",
            padding: [3, 6],
            borderRadius: 2
          },
          data: [{
            name: origin.name,
            value: shiftedOrigin,
            isOrigin: true
          }]
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
      echarts.registerMap("world-shifted", shiftWorld(world));
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
