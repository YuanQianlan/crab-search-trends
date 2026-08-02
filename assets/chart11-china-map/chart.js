(function () {
  "use strict";

  const fontFamily = '"Times New Roman","SimSun","宋体",serif';
  const chart = echarts.init(document.getElementById("chart"), null, { renderer: "canvas" });
  const total = 511;
  const palette = ["#F2B1A7", "#EE9AA6", "#D8869D", "#C87596", "#B4678D", "#934B78"];
  const counts = {
    "北京市": 1,
    "天津市": 0,
    "河北省": 0,
    "山西省": 5,
    "内蒙古自治区": 0,
    "辽宁省": 6,
    "吉林省": 3,
    "黑龙江省": 3,
    "上海市": 4,
    "江苏省": 364,
    "浙江省": 8,
    "安徽省": 14,
    "福建省": 1,
    "江西省": 4,
    "山东省": 15,
    "河南省": 3,
    "湖北省": 7,
    "湖南省": 11,
    "广东省": 12,
    "广西壮族自治区": 1,
    "海南省": 4,
    "重庆市": 15,
    "四川省": 6,
    "贵州省": 13,
    "云南省": 5,
    "西藏自治区": 0,
    "陕西省": 0,
    "甘肃省": 1,
    "青海省": 0,
    "宁夏回族自治区": 5,
    "新疆维吾尔自治区": 0,
    "台湾省": 0,
    "香港特别行政区": 0,
    "澳门特别行政区": 0
  };
  const provinceCenters = {
    "北京市": [116.405285, 39.904989],
    "山西省": [112.549248, 37.857014],
    "辽宁省": [123.429096, 41.796767],
    "吉林省": [125.3245, 43.886841],
    "黑龙江省": [126.642464, 45.756967],
    "上海市": [121.472644, 31.231706],
    "江苏省": [118.767413, 32.041544],
    "浙江省": [120.153576, 30.287459],
    "安徽省": [117.283042, 31.86119],
    "福建省": [119.306239, 26.075302],
    "江西省": [115.892151, 28.676493],
    "山东省": [117.000923, 36.675807],
    "河南省": [113.665412, 34.757975],
    "湖北省": [114.298572, 30.584355],
    "湖南省": [112.982279, 28.19409],
    "广东省": [113.280637, 23.125178],
    "广西壮族自治区": [108.320004, 22.82402],
    "海南省": [110.33119, 20.031971],
    "重庆市": [106.504962, 29.533155],
    "四川省": [104.065735, 30.659462],
    "贵州省": [106.713478, 26.578343],
    "云南省": [102.712251, 25.040609],
    "甘肃省": [103.823557, 36.058039],
    "宁夏回族自治区": [106.278179, 38.46637]
  };

  const rawData = Object.keys(counts).map(function (name) {
    return { name: name, value: counts[name] };
  });
  const sorted = rawData.slice().sort(function (a, b) {
    return a.value - b.value || a.name.localeCompare(b.name, "zh-CN");
  });
  const maxValue = Math.max.apply(null, rawData.map(function (item) { return item.value; }));
  let currentView = "map";
  let timer = null;
  let provincePoints = [];

  function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(Number(value) || 0);
  }

  function barColor(index) {
    if (!sorted.length) return palette[0];
    const ratio = index / Math.max(sorted.length - 1, 1);
    return palette[Math.min(palette.length - 1, Math.floor(ratio * palette.length))];
  }

  function bubbleColor(value) {
    const ratio = value / Math.max(maxValue, 1);
    const index = Math.min(palette.length - 1, Math.floor(ratio * (palette.length - 1)));
    return palette[index];
  }

  function bubbleSize(value) {
    if (!value) return 0;
    return Math.max(12, Math.min(64, 9 + Math.sqrt(value) * 2.65));
  }

  function tooltipText(name, value) {
    const share = total ? (value / total * 100).toFixed(1) : "0.0";
    return "<b>" + name + "</b><br>加工企业：" + formatNumber(value) + " 家<br>占比：" + share + "%";
  }

  function commonText() {
    return {
      fontFamily: fontFamily,
      color: "#4c4a4a"
    };
  }

  function mapOption() {
    return {
      backgroundColor: "#FAF2E6",
      animationDuration: 850,
      textStyle: commonText(),
      visualMap: {
        type: "continuous",
        min: 0,
        max: maxValue,
        dimension: 2,
        seriesIndex: 1,
        left: "4%",
        bottom: "8%",
        itemWidth: 18,
        itemHeight: 132,
        calculable: true,
        precision: 0,
        text: ["数量多", "数量少"],
        textStyle: {
          fontFamily: fontFamily,
          color: "#6c5f66",
          fontSize: 13
        },
        inRange: {
          color: palette
        },
        outOfRange: {
          color: "#F3E9E4"
        }
      },
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: "rgba(255,250,246,.98)",
        borderColor: "#d7b7b2",
        borderWidth: 1,
        padding: [10, 13],
        textStyle: {
          fontFamily: fontFamily,
          color: "#514950",
          fontSize: 14
        },
        formatter: function (params) {
          return tooltipText(params.name, Number(params.value) || 0);
        }
      },
      geo: {
        map: "china-processing",
        roam: true,
        zoom: 1.05,
        layoutCenter: ["52%", "48%"],
        layoutSize: "88%",
        emphasis: {
          label: {
            show: true,
            color: "#514950",
            fontFamily: fontFamily,
            fontSize: 13
          },
          itemStyle: {
            areaColor: "#E5A5A5",
            borderColor: "#8C6B78",
            borderWidth: 1.6
          }
        },
        itemStyle: {
          areaColor: "#F7E7E1",
          borderColor: "#B99EA6",
          borderWidth: 0.8
        }
      },
      series: [
        {
          id: "chinaBase",
          name: "中国省级底图",
          type: "map",
          map: "china-processing",
          geoIndex: 0,
          roam: true,
          itemStyle: {
            areaColor: "#F7E7E1",
            borderColor: "#C9AEB5",
            borderWidth: 0.8
          },
          emphasis: {
            disabled: true
          },
          data: rawData
        },
        {
          id: "provinceData",
          name: "加工企业数量",
          type: "scatter",
          coordinateSystem: "geo",
          symbol: "circle",
          symbolSize: function (value) {
            return bubbleSize(value[2]);
          },
          data: provincePoints,
          universalTransition: true,
          itemStyle: {
            color: function (params) {
              return bubbleColor(params.value[2]);
            },
            borderColor: "rgba(255,250,246,.92)",
            borderWidth: 2,
            shadowColor: "rgba(132,91,113,.22)",
            shadowBlur: 12,
            opacity: 1
          },
          label: {
            show: true,
            formatter: function (params) {
              return params.value[2] >= 10 ? params.name : "";
            },
            position: "right",
            distance: 4,
            color: "#66555f",
            fontFamily: fontFamily,
            fontSize: 12
          },
          emphasis: {
            scale: true,
            itemStyle: {
              borderColor: "#7F6475",
              borderWidth: 2.5,
              shadowBlur: 16
            },
            label: {
              show: true,
              fontWeight: 700
            }
          },
          tooltip: {
            formatter: function (params) {
              return tooltipText(params.name, Number(params.value[2]) || 0);
            }
          }
        },
      ]
    };
  }

  function barOption() {
    return {
      backgroundColor: "#FAF2E6",
      animationDurationUpdate: 900,
      textStyle: commonText(),
      title: {
        text: "各省大闸蟹加工企业数量排序",
        left: "center",
        top: "2%",
        textStyle: {
          fontFamily: fontFamily,
          color: "#5b4b56",
          fontSize: 23,
          fontWeight: 700
        }
      },
      grid: {
        left: "19%",
        right: "11%",
        top: "10%",
        bottom: "7%",
        containLabel: true
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        },
        confine: true,
        backgroundColor: "rgba(255,250,246,.98)",
        borderColor: "#d7b7b2",
        borderWidth: 1,
        padding: [10, 13],
        textStyle: {
          fontFamily: fontFamily,
          color: "#514950",
          fontSize: 14
        },
        formatter: function (params) {
          const item = params[0];
          return tooltipText(item.name, item.value);
        }
      },
      xAxis: {
        type: "value",
        min: 0,
        max: maxValue,
        name: "企业数量（家）",
        nameLocation: "middle",
        nameGap: 30,
        nameTextStyle: {
          fontFamily: fontFamily,
          color: "#7a6b73",
          fontSize: 13
        },
        axisLine: {
          lineStyle: { color: "#C8B4B5" }
        },
        axisLabel: {
          fontFamily: fontFamily,
          color: "#776a70"
        },
        splitLine: {
          lineStyle: { color: "#E9D9D4" }
        }
      },
      yAxis: {
        type: "category",
        inverse: false,
        data: sorted.map(function (item) { return item.name; }),
        axisLine: {
          lineStyle: { color: "#C8B4B5" }
        },
        axisTick: { show: false },
        axisLabel: {
          fontFamily: fontFamily,
          color: "#5e535a",
          fontSize: 13
        }
      },
      series: [{
        id: "provinceData",
        type: "bar",
        data: sorted.map(function (item, index) {
          return {
            name: item.name,
            value: item.value,
            itemStyle: {
              color: barColor(index),
              borderRadius: [0, 5, 5, 0]
            }
          };
        }),
        barMaxWidth: 18,
        universalTransition: true,
        animationDurationUpdate: 900,
        label: {
          show: true,
          position: "right",
          distance: 7,
          color: "#6b5b64",
          fontFamily: fontFamily,
          fontSize: 12,
          formatter: function (params) {
            return formatNumber(params.value);
          }
        }
      }]
    };
  }

  function showMap() {
    chart.setOption(mapOption(), true);
    currentView = "map";
  }

  function showBar() {
    chart.setOption(barOption(), true);
    currentView = "bar";
  }

  fetch("./assets/chart11-china-map/china-provinces.json")
    .then(function (response) {
      if (!response.ok) throw new Error("地图数据加载失败：" + response.status);
      return response.json();
    })
    .then(function (geoJson) {
      echarts.registerMap("china-processing", geoJson);
      provincePoints = geoJson.features
        .map(function (feature) {
          const props = feature.properties || {};
          const name = props.name;
          const coord = provinceCenters[name] || props.centroid || props.center;
          const value = counts[name] || 0;
          if (!coord || !value) return null;
          return {
            name: name,
            value: [coord[0], coord[1], value]
          };
        })
        .filter(Boolean);

      function restartTimer() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          if (currentView === "map") showBar();
          else showMap();
        }, 5000);
      }

      chart.on("click", function (params) {
        if (currentView === "map" && params.componentType === "series") {
          showBar();
          restartTimer();
        }
      });
      chart.on("mouseover", function () {
        window.clearInterval(timer);
      });
      chart.on("mouseout", restartTimer);

      showMap();
      restartTimer();
    })
    .catch(function (error) {
      document.getElementById("chart").innerHTML =
        '<div style="padding:80px;text-align:center;color:#8a6c76;font-family:' + fontFamily + ';">' +
        error.message + "</div>";
      console.error(error);
    });

  window.addEventListener("resize", function () {
    chart.resize();
  });
})();
