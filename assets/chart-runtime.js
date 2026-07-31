(function () {
  "use strict";

  const source = window.PROVINCE_SEARCH_DATA;
  const pageConfig = window.CHART_PAGE_CONFIG || {};
  const chartElement = document.getElementById("main");

  if (!Array.isArray(source) || source.length < 2) {
    chartElement.textContent = "图表数据加载失败。";
    return;
  }

  document.title = pageConfig.documentTitle || "各省份搜索总量年度变化";

  const fontFamily = '"Times New Roman","SimSun","宋体",serif';
  const years = source[0].slice(1).map(String);
  const provinceRows = source.slice(1);
  const provinceNames = provinceRows.map((row) => row[0]);
  const colors = [
    "#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272",
    "#fc8452", "#9a60b4", "#ea7ccc", "#6e7074", "#546570", "#c4ccd3",
    "#ca8622", "#bda29a", "#749f83", "#d48265", "#61a0a8", "#2f4554",
    "#c23531", "#2f7ed8", "#8bbc21", "#910000", "#1aadce", "#492970",
    "#f28f43", "#77a1e5", "#c42525", "#a6c96a", "#7cb5ec", "#434348",
    "#90ed7d", "#f7a35c", "#8085e9", "#f15c80"
  ];
  const numberFormatter = new Intl.NumberFormat("en-US");

  function formatNumber(value) {
    return numberFormatter.format(Number(value) || 0);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function sortedYearData(dataIndex) {
    const dimension = dataIndex + 1;
    return provinceRows
      .map((row, rowIndex) => ({
        name: row[0],
        value: Number(row[dimension]) || 0,
        itemStyle: { color: colors[rowIndex % colors.length] }
      }))
      .sort((a, b) => b.value - a.value);
  }

  function renderYearTooltip(dataIndex) {
    const year = years[dataIndex];
    const items = sortedYearData(dataIndex)
      .map((item, rank) => (
        '<div class="year-tooltip__item">' +
          '<span class="year-tooltip__rank">' + (rank + 1) + ".</span>" +
          '<span class="year-tooltip__dot" style="background:' + item.itemStyle.color + '"></span>' +
          "<span>" + escapeHtml(item.name) + "</span>" +
          '<span class="year-tooltip__value">' + formatNumber(item.value) + "</span>" +
        "</div>"
      ))
      .join("");

    return (
      '<div class="year-tooltip">' +
        '<div class="year-tooltip__title">' + year + "年各省份搜索总量（降序）</div>" +
        '<div class="year-tooltip__grid">' + items + "</div>" +
      "</div>"
    );
  }

  function lineSeries() {
    return provinceRows.map((row, rowIndex) => ({
      name: row[0],
      type: "line",
      smooth: 0.35,
      showSymbol: false,
      symbol: "circle",
      seriesLayoutBy: "row",
      lineStyle: {
        width: 2,
        color: colors[rowIndex % colors.length],
        opacity: 0.9
      },
      itemStyle: {
        color: colors[rowIndex % colors.length]
      },
      emphasis: {
        focus: "series",
        lineStyle: { width: 4 }
      }
    }));
  }

  const chart = echarts.init(chartElement, null, { renderer: "canvas" });

  // 后续页面可以在自己的 charts/chartN.js 中提供完整 option，
  // 从而复用相同的 HTML、ECharts 和 CSS，只替换图表配置。
  if (pageConfig.option) {
    chart.setOption({
      backgroundColor: "#fffaf4",
      textStyle: { fontFamily: fontFamily },
      ...pageConfig.option
    });
    window.addEventListener("resize", function () {
      chart.resize();
    });
    return;
  }

  const option = {
    backgroundColor: "#fffaf4",
    color: colors,
    animationDuration: 450,
    textStyle: {
      fontFamily: fontFamily
    },
    title: [
      {
        id: "mainTitle",
        text: pageConfig.chartTitle || "2011—2026年各省份搜索总量变化",
        left: "center",
        top: 8,
        textStyle: {
          fontFamily: fontFamily,
          fontSize: 22,
          fontWeight: "bold",
          color: "#263238"
        }
      },
      {
        id: "pieTitle",
        text: years[0] + "年各省份占比",
        left: "center",
        top: 48,
        textStyle: {
          fontFamily: fontFamily,
          fontSize: 15,
          fontWeight: "normal",
          color: "#59636b"
        }
      }
    ],
    legend: {
      type: "plain",
      orient: "horizontal",
      data: provinceNames,
      top: "42%",
      left: "3%",
      right: "3%",
      itemWidth: 20,
      itemHeight: 10,
      itemGap: 10,
      selectedMode: true,
      textStyle: {
        fontFamily: fontFamily,
        fontSize: 12,
        lineHeight: 18,
        color: "#3e474e"
      }
    },
    tooltip: {
      trigger: "axis",
      triggerOn: "mousemove|click",
      showContent: true,
      confine: true,
      enterable: true,
      transitionDuration: 0,
      axisPointer: {
        type: "line",
        snap: true,
        lineStyle: {
          color: "#64727d",
          width: 1,
          type: "dashed"
        }
      },
      backgroundColor: "rgba(255,255,255,0.98)",
      borderColor: "#b9c2c8",
      borderWidth: 1,
      padding: 12,
      extraCssText: "box-shadow:0 5px 22px rgba(29,45,55,.18);border-radius:6px;",
      formatter: function (params) {
        const linePoint = params.find((item) => item.seriesType === "line");
        if (!linePoint) return "";
        return renderYearTooltip(linePoint.dataIndex);
      },
      position: function (point, params, dom, rect, size) {
        const margin = 12;
        const preferredX = point[0] + 18;
        const x = Math.min(
          Math.max(margin, preferredX),
          Math.max(margin, size.viewSize[0] - size.contentSize[0] - margin)
        );
        const y = Math.min(
          Math.max(margin, point[1] - size.contentSize[1] / 2),
          Math.max(margin, size.viewSize[1] - size.contentSize[1] - margin)
        );
        return [x, y];
      }
    },
    dataset: {
      source: source
    },
    grid: {
      top: "58%",
      left: 88,
      right: 42,
      bottom: 72
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        fontFamily: fontFamily,
        fontSize: 13,
        rotate: 0,
        color: "#5d6770"
      },
      axisLine: {
        lineStyle: { color: "#7d878e" }
      },
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: "value",
      gridIndex: 0,
      name: "搜索总量",
      nameGap: 22,
      nameTextStyle: {
        fontFamily: fontFamily,
        fontSize: 13,
        color: "#5d6770"
      },
      axisLabel: {
        fontFamily: fontFamily,
        fontSize: 13,
        color: "#5d6770",
        formatter: function (value) {
          return formatNumber(value);
        }
      },
      splitLine: {
        lineStyle: {
          color: "#dce4e8",
          width: 1
        }
      }
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        zoomOnMouseWheel: false,
        moveOnMouseMove: true
      },
      {
        type: "slider",
        xAxisIndex: 0,
        bottom: 20,
        height: 20,
        brushSelect: false,
        textStyle: { fontFamily: fontFamily }
      }
    ],
    series: [
      ...lineSeries(),
      {
        id: "pie",
        name: "省份占比",
        type: "pie",
        radius: ["11%", "25%"],
        center: ["50%", "25%"],
        startAngle: 90,
        clockwise: true,
        minAngle: 1,
        data: sortedYearData(0),
        emphasis: {
          focus: "self",
          scaleSize: 8
        },
        label: {
          show: true,
          fontFamily: fontFamily,
          fontSize: 11,
          color: "#45515a",
          formatter: function (params) {
            return params.percent >= 3
              ? params.name + "\n" + formatNumber(params.value)
              : "";
          }
        },
        labelLine: {
          length: 8,
          length2: 7
        },
        labelLayout: {
          hideOverlap: true
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            return (
              escapeHtml(params.name) + "：" +
              formatNumber(params.value) + "（" +
              params.percent + "%）"
            );
          }
        }
      }
    ]
  };

  chart.setOption(option);

  chart.on("updateAxisPointer", function (event) {
    const axisInfo = event.axesInfo && event.axesInfo[0];
    if (!axisInfo) return;

    let dataIndex = axisInfo.value;
    if (typeof dataIndex === "string" && years.includes(dataIndex)) {
      dataIndex = years.indexOf(dataIndex);
    }
    dataIndex = Number(dataIndex);
    if (!Number.isInteger(dataIndex) || dataIndex < 0 || dataIndex >= years.length) {
      return;
    }

    chart.setOption({
      title: [
        {
          id: "pieTitle",
          text: years[dataIndex] + "年各省份占比"
        }
      ],
      series: [
        {
          id: "pie",
          data: sortedYearData(dataIndex)
        }
      ]
    });
  });

  window.addEventListener("resize", function () {
    chart.resize();
  });
})();
