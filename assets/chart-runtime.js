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

  function updateRankingPanel(dataIndex) {
    const year = years[dataIndex];
    const items = sortedYearData(dataIndex)
      .map((item, rank) => (
        '<div class="ranking-panel__item">' +
          '<span class="ranking-panel__rank">' + (rank + 1) + ".</span>" +
          '<span class="ranking-panel__dot" style="background:' + item.itemStyle.color + '"></span>' +
          "<span>" + escapeHtml(item.name) + "</span>" +
          '<span class="ranking-panel__value">' + formatNumber(item.value) + "</span>" +
        "</div>"
      ))
      .join("");

    const panel = document.querySelector(".ranking-panel");
    panel.innerHTML = (
      '<div class="ranking-panel__title">' + year + "年各省份搜索总量（降序）</div>" +
      '<div class="ranking-panel__grid">' + items + "</div>"
    );
  }

  function lineSeries() {
    return provinceRows.map((row, rowIndex) => ({
      name: row[0],
      type: "line",
      smooth: 0.35,
      showSymbol: true,
      symbol: "circle",
      symbolSize: 12,
      triggerLineEvent: true,
      seriesLayoutBy: "row",
      lineStyle: {
        width: 2,
        color: colors[rowIndex % colors.length],
        opacity: 0.9
      },
      itemStyle: {
        color: colors[rowIndex % colors.length],
        opacity: 0.01
      },
      emphasis: {
        focus: "series",
        lineStyle: { width: 4 },
        itemStyle: { opacity: 1 }
      },
      blur: {
        lineStyle: { opacity: 0.12 }
      }
    }));
  }

  function renderSideLegend(names, side, startIndex) {
    const container = document.createElement("div");
    container.className = "side-legend side-legend--" + side;

    names.forEach((name, index) => {
      const item = document.createElement("div");
      item.className = "side-legend__item";

      const marker = document.createElement("span");
      marker.className = "side-legend__marker";
      marker.style.background = colors[(startIndex + index) % colors.length];

      const label = document.createElement("span");
      label.textContent = name;

      item.append(marker, label);
      container.append(item);
    });

    chartElement.parentElement.append(container);
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

  renderSideLegend(provinceNames.slice(0, 17), "left", 0);
  renderSideLegend(provinceNames.slice(17), "right", 17);

  const rankingPanel = document.createElement("section");
  rankingPanel.className = "ranking-panel";
  rankingPanel.setAttribute("aria-live", "polite");
  chartElement.parentElement.append(rankingPanel);
  updateRankingPanel(0);

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
        top: 66,
        textStyle: {
          fontFamily: fontFamily,
          fontSize: 15,
          fontWeight: "normal",
          color: "#59636b"
        }
      }
    ],
    legend: {
      show: false
    },
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove|click",
      showContent: true,
      confine: true,
      transitionDuration: 0,
      backgroundColor: "rgba(255,255,255,0.96)",
      borderColor: "#aeb8be",
      borderWidth: 1,
      padding: [7, 9],
      extraCssText: "box-shadow:0 3px 12px rgba(29,45,55,.15);border-radius:5px;",
      formatter: function (params) {
        const target = Array.isArray(params) ? params[0] : params;
        if (!target || target.seriesType !== "line") return "";
        const dataIndex = target.dataIndex;
        const rowIndex = provinceNames.indexOf(target.seriesName);
        const value = provinceRows[rowIndex][dataIndex + 1];
        const color = colors[rowIndex % colors.length];

        return (
          '<div class="line-tooltip">' +
            '<div class="line-tooltip__year">' + years[dataIndex] + "年</div>" +
            '<div class="line-tooltip__row">' +
              '<span class="line-tooltip__dot" style="background:' + color + '"></span>' +
              "<span>" + escapeHtml(target.seriesName) + "</span>" +
              '<span class="line-tooltip__value">' + formatNumber(value) + "</span>" +
            "</div>" +
          "</div>"
        );
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
        radius: ["11%", "24%"],
        center: ["50%", "31%"],
        startAngle: 90,
        clockwise: true,
        minAngle: 1,
        avoidLabelOverlap: true,
        data: sortedYearData(0),
        emphasis: {
          focus: "self",
          scaleSize: 8
        },
        label: {
          show: true,
          fontFamily: fontFamily,
          fontSize: 10,
          color: "#45515a",
          formatter: function (params) {
            return params.name + " " + params.percent.toFixed(1) + "%";
          }
        },
        labelLine: {
          show: true,
          length: 9,
          length2: 0,
          smooth: false
        },
        labelLayout: {
          hideOverlap: false
        },
        tooltip: {
          trigger: "item",
          showContent: true,
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

  function syncYearViews(dataIndex) {
    if (!Number.isInteger(dataIndex) || dataIndex < 0 || dataIndex >= years.length) {
      return;
    }

    updateRankingPanel(dataIndex);
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
  }

  chart.on("mouseover", function (params) {
    if (params.seriesType !== "line") return;
    syncYearViews(params.dataIndex);
  });

  let activeHoverSeries = -1;
  let activeHoverDataIndex = -1;

  function clearLineHover() {
    if (activeHoverSeries >= 0) {
      chart.dispatchAction({
        type: "downplay",
        seriesIndex: activeHoverSeries,
        dataIndex: activeHoverDataIndex
      });
    }
    activeHoverSeries = -1;
    activeHoverDataIndex = -1;
    chart.dispatchAction({ type: "hideTip" });
  }

  // ECharts 的折线本身命中范围很窄。这里按鼠标位置寻找最近的年份节点和
  // 最近的省份折线，使用户不必精确压中一个很小的数据点。
  chart.getZr().on("mousemove", function (event) {
    const pointer = [event.offsetX, event.offsetY];
    if (!chart.containPixel({ gridIndex: 0 }, pointer)) {
      if (activeHoverSeries >= 0) clearLineHover();
      return;
    }

    let nearestDataIndex = -1;
    let nearestXDistance = Infinity;
    years.forEach(function (year, dataIndex) {
      const x = chart.convertToPixel({ xAxisIndex: 0 }, year);
      const distance = Math.abs(pointer[0] - x);
      if (distance < nearestXDistance) {
        nearestXDistance = distance;
        nearestDataIndex = dataIndex;
      }
    });

    if (nearestDataIndex < 0) return;

    let nearestSeriesIndex = -1;
    let nearestYDistance = Infinity;
    provinceRows.forEach(function (row, seriesIndex) {
      const value = Number(row[nearestDataIndex + 1]) || 0;
      const point = chart.convertToPixel(
        { xAxisIndex: 0, yAxisIndex: 0 },
        [years[nearestDataIndex], value]
      );
      const distance = Math.abs(pointer[1] - point[1]);
      if (distance < nearestYDistance) {
        nearestYDistance = distance;
        nearestSeriesIndex = seriesIndex;
      }
    });

    // 28px 的纵向感应带让折线容易选中，同时仍能区分相邻折线。
    if (nearestSeriesIndex < 0 || nearestYDistance > 28) {
      if (activeHoverSeries >= 0) clearLineHover();
      return;
    }

    if (
      activeHoverSeries !== nearestSeriesIndex ||
      activeHoverDataIndex !== nearestDataIndex
    ) {
      if (activeHoverSeries >= 0) {
        chart.dispatchAction({
          type: "downplay",
          seriesIndex: activeHoverSeries,
          dataIndex: activeHoverDataIndex
        });
      }

      activeHoverSeries = nearestSeriesIndex;
      activeHoverDataIndex = nearestDataIndex;
      chart.dispatchAction({
        type: "highlight",
        seriesIndex: nearestSeriesIndex,
        dataIndex: nearestDataIndex
      });
      syncYearViews(nearestDataIndex);
    }

    chart.dispatchAction({
      type: "showTip",
      seriesIndex: nearestSeriesIndex,
      dataIndex: nearestDataIndex,
      position: pointer
    });
  });

  chart.getZr().on("globalout", clearLineHover);

  chart.on("updateAxisPointer", function (event) {
    const axisInfo = event.axesInfo && event.axesInfo[0];
    if (!axisInfo) return;

    let dataIndex = axisInfo.value;
    if (typeof dataIndex === "string" && years.includes(dataIndex)) {
      dataIndex = years.indexOf(dataIndex);
    }
    dataIndex = Number(dataIndex);
    syncYearViews(dataIndex);
  });

  window.addEventListener("resize", function () {
    chart.resize();
  });
})();
