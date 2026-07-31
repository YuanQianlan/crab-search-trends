window.CHART_PAGE_CONFIG = (function () {
  "use strict";

  const platformShares = {
    "京东": 55,
    "天猫": 38,
    "抖音": 7
  };

  const priceShares = {
    "京东": {
      "<258元": 55.7,
      "258-447元": 26.6,
      "447-880元": 13.1,
      ">880元": 4.6
    },
    "天猫": {
      "<258元": 25.0,
      "258-447元": 32.7,
      "447-880元": 22.5,
      ">880元": 19.8
    },
    "抖音": {
      "<258元": 38.7,
      "258-447元": 54.5,
      "447-880元": 6.0,
      ">880元": 0.9
    }
  };

  const platformColors = {
    "京东": "#2878b5",
    "天猫": "#d94b4b",
    "抖音": "#24a58a"
  };

  const priceColors = {
    "<258元": "#f2b84b",
    "258-447元": "#ed8a45",
    "447-880元": "#bd6a79",
    ">880元": "#76558f"
  };

  const priceBands = ["<258元", "258-447元", "447-880元", ">880元"];
  const links = [];

  Object.keys(platformShares).forEach(function (platform) {
    priceBands.forEach(function (priceBand) {
      const withinShare = priceShares[platform][priceBand];
      links.push({
        source: platform,
        target: priceBand,
        value: platformShares[platform] * withinShare / 100,
        withinShare: withinShare
      });
    });
  });

  function card(left, color, name, value, caption) {
    return {
      type: "group",
      left: left,
      top: 105,
      silent: true,
      children: [
        {
          type: "rect",
          shape: { width: 190, height: 66, r: 8 },
          style: {
            fill: "rgba(255,255,255,0.88)",
            stroke: color,
            lineWidth: 1.5,
            shadowBlur: 9,
            shadowColor: "rgba(55,65,72,0.10)",
            shadowOffsetY: 3
          }
        },
        {
          type: "circle",
          shape: { cx: 20, cy: 22, r: 6 },
          style: { fill: color }
        },
        {
          type: "text",
          style: {
            x: 34,
            y: 14,
            text: name,
            fill: "#3e4a52",
            font: '15px "SimSun","宋体",serif'
          }
        },
        {
          type: "text",
          style: {
            x: 18,
            y: 36,
            text: value,
            fill: color,
            font: '700 23px "Times New Roman",serif'
          }
        },
        {
          type: "text",
          style: {
            x: 77,
            y: 41,
            text: caption,
            fill: "#737d84",
            font: '12px "SimSun","宋体",serif'
          }
        }
      ]
    };
  }

  return {
    pageId: "chart2",
    documentTitle: "大闸蟹线上销售平台与价格带流向",
    option: {
      backgroundColor: "#fffaf4",
      animationDuration: 900,
      animationDurationUpdate: 650,
      animationEasingUpdate: "cubicOut",
      aria: {
        enabled: true,
        decal: { show: false }
      },
      title: {
        text: "2025年1-11月大闸蟹线上销售流向",
        subtext: "平台 → 价格带｜流线宽度代表占整体线上销售额的贡献",
        left: "center",
        top: 20,
        textStyle: {
          fontFamily: '"Times New Roman","SimSun","宋体",serif',
          fontSize: 24,
          fontWeight: "bold",
          color: "#263238"
        },
        subtextStyle: {
          fontFamily: '"Times New Roman","SimSun","宋体",serif',
          fontSize: 14,
          color: "#67727a",
          lineHeight: 24
        }
      },
      toolbox: {
        top: 22,
        right: 26,
        iconStyle: {
          borderColor: "#6c777e"
        },
        emphasis: {
          iconStyle: {
            borderColor: "#2878b5"
          }
        },
        feature: {
          restore: { title: "还原" },
          saveAsImage: {
            title: "保存图片",
            name: "大闸蟹线上销售平台与价格带流向",
            pixelRatio: 2,
            backgroundColor: "#fffaf4"
          }
        }
      },
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove|click",
        confine: true,
        backgroundColor: "rgba(255,255,255,0.97)",
        borderColor: "#aeb8be",
        borderWidth: 1,
        padding: [10, 12],
        textStyle: {
          fontFamily: '"Times New Roman","SimSun","宋体",serif',
          color: "#28343c"
        },
        extraCssText: "box-shadow:0 5px 18px rgba(29,45,55,.16);border-radius:7px;",
        formatter: function (params) {
          const value = Number(params.value) || 0;

          if (params.dataType === "edge") {
            return (
              '<div style="font-weight:700;margin-bottom:6px">' +
                params.data.source + " → " + params.data.target +
              "</div>" +
              '<div>占整体线上销售额：<b>' + value.toFixed(1) + "%</b></div>" +
              '<div>该平台内部占比：<b>' +
                Number(params.data.withinShare).toFixed(1) + "%</b></div>"
            );
          }

          if (Object.prototype.hasOwnProperty.call(platformShares, params.name)) {
            return (
              '<div style="font-weight:700;margin-bottom:6px">' + params.name + "</div>" +
              '<div>平台市场份额：<b>' + platformShares[params.name].toFixed(1) + "%</b></div>" +
              '<div style="margin-top:4px;color:#758088">拖动节点可调整布局</div>'
            );
          }

          return (
            '<div style="font-weight:700;margin-bottom:6px">' + params.name + "</div>" +
            '<div>汇总销售额贡献：<b>' + value.toFixed(1) + "%</b></div>"
          );
        }
      },
      graphic: [
        card("12%", platformColors["京东"], "京东", "55%", "平台市场份额"),
        card("43%", platformColors["天猫"], "天猫", "38%", "平台市场份额"),
        card("74%", platformColors["抖音"], "抖音", "7%", "平台市场份额"),
        {
          type: "text",
          left: "center",
          bottom: 26,
          silent: true,
          style: {
            text: "注：流量根据报告的平台市场份额与平台内部价格带销售额占比估算，合计差异来自四舍五入。",
            fill: "#7a848b",
            font: '12px "Times New Roman","SimSun","宋体",serif'
          }
        }
      ],
      series: [
        {
          name: "销售流向",
          type: "sankey",
          left: "11%",
          right: "11%",
          top: 215,
          bottom: 82,
          nodeWidth: 28,
          nodeGap: 34,
          nodeAlign: "justify",
          draggable: true,
          layoutIterations: 0,
          emphasis: {
            focus: "adjacency"
          },
          blur: {
            itemStyle: { opacity: 0.18 },
            lineStyle: { opacity: 0.08 }
          },
          data: [
            { name: "京东", itemStyle: { color: platformColors["京东"] } },
            { name: "天猫", itemStyle: { color: platformColors["天猫"] } },
            { name: "抖音", itemStyle: { color: platformColors["抖音"] } },
            { name: "<258元", itemStyle: { color: priceColors["<258元"] } },
            { name: "258-447元", itemStyle: { color: priceColors["258-447元"] } },
            { name: "447-880元", itemStyle: { color: priceColors["447-880元"] } },
            { name: ">880元", itemStyle: { color: priceColors[">880元"] } }
          ],
          links: links,
          levels: [
            {
              depth: 0,
              itemStyle: {
                borderColor: "#ffffff",
                borderWidth: 2
              },
              label: {
                position: "left",
                distance: 12,
                color: "#2d3941",
                fontSize: 16,
                fontWeight: "bold"
              }
            },
            {
              depth: 1,
              itemStyle: {
                borderColor: "#ffffff",
                borderWidth: 2
              },
              label: {
                position: "right",
                distance: 12,
                color: "#2d3941",
                fontSize: 15,
                fontWeight: "bold"
              }
            }
          ],
          lineStyle: {
            color: "gradient",
            opacity: 0.48,
            curveness: 0.5
          },
          label: {
            fontFamily: '"Times New Roman","SimSun","宋体",serif'
          }
        }
      ]
    }
  };
})();
