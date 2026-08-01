(function () {
  "use strict";

  const brands = [
    {
      name: "阳澄湖大闸蟹",
      place: "江苏 · 苏州 · 阳澄湖",
      coord: [120.80, 31.43],
      color: "#e7b85b",
      index: 96,
      labelOffset: [20, 22],
    },
    {
      name: "固城湖大闸蟹",
      place: "江苏 · 南京 · 高淳",
      coord: [118.93, 31.29],
      color: "#dc7659",
      index: 82,
      labelOffset: [-118, 26],
    },
    {
      name: "盘锦大闸蟹",
      place: "辽宁 · 盘锦",
      coord: [122.07, 41.12],
      color: "#68b7a1",
      index: 88,
      labelOffset: [16, -27],
    },
    {
      name: "兴化大闸蟹",
      place: "江苏 · 泰州 · 兴化",
      coord: [119.85, 32.91],
      color: "#d8914e",
      index: 92,
      labelOffset: [21, -55],
    },
    {
      name: "泗洪大闸蟹",
      place: "江苏 · 宿迁 · 泗洪",
      coord: [118.22, 33.46],
      color: "#7ba8c8",
      index: 78,
      labelOffset: [-116, -34],
    },
    {
      name: "微山湖大闸蟹",
      place: "山东 · 济宁 · 微山湖",
      coord: [117.20, 34.70],
      color: "#9f8cc5",
      index: 76,
      labelOffset: [-120, -62],
    },
  ];

  const mapElement = document.getElementById("brandMap");
  const listElement = document.getElementById("brandList");
  if (!mapElement || !window.echarts || !window.CRAB_CHINA_GEOJSON) return;

  brands.forEach((brand, index) => {
    const item = document.createElement("div");
    item.className = "brand-item";
    item.dataset.index = String(index);
    item.innerHTML = `
      <span class="brand-dot" style="background:${brand.color};color:${brand.color}"></span>
      <span>
        <div class="brand-name">${brand.name}</div>
        <div class="brand-place">${brand.place}</div>
      </span>`;
    item.addEventListener("mouseenter", () => {
      chart.dispatchAction({ type: "showTip", seriesIndex: 1, dataIndex: index });
      item.classList.add("is-active");
    });
    item.addEventListener("mouseleave", () => {
      chart.dispatchAction({ type: "hideTip" });
      item.classList.remove("is-active");
    });
    listElement.appendChild(item);
  });

  echarts.registerMap("crab_china", window.CRAB_CHINA_GEOJSON);
  const chart = echarts.init(mapElement, null, { renderer: "canvas" });

  const terrainGradient = new echarts.graphic.LinearGradient(0, 0, 1, 1, [
    { offset: 0, color: "#1b635f" },
    { offset: 0.48, color: "#164f50" },
    { offset: 1, color: "#10383f" },
  ]);

  const option = {
    animation: true,
    backgroundColor: "#FAF2E6",
    tooltip: {
      trigger: "item",
      borderWidth: 1,
      borderColor: "rgba(225, 189, 114, 0.5)",
      backgroundColor: "rgba(3, 24, 29, 0.94)",
      padding: [12, 15],
      textStyle: {
        color: "#eef5f2",
        fontFamily: "Microsoft YaHei",
      },
      formatter(params) {
        const brand = brands[params.dataIndex];
        if (!brand) return "";
        return `
          <div style="font-size:16px;color:${brand.color};font-weight:700;margin-bottom:5px">
            ${brand.name}
          </div>
          <div style="font-size:12px;color:#9bb0ab">${brand.place}</div>
          <div style="margin-top:8px;font-size:11px;color:#708a84">
            ${brand.coord[0].toFixed(2)}°E · ${brand.coord[1].toFixed(2)}°N
          </div>`;
      },
    },
    geo: {
      map: "crab_china",
      roam: true,
      silent: false,
      left: "3%",
      right: "19%",
      top: "5%",
      bottom: "5%",
      zoom: 1.05,
      scaleLimit: {
        min: 0.88,
        max: 5,
      },
      itemStyle: {
        areaColor: terrainGradient,
        borderColor: "rgba(175, 207, 194, 0.68)",
        borderWidth: 0.75,
        shadowColor: "rgba(0, 0, 0, 0.42)",
        shadowBlur: 13,
        shadowOffsetY: 7,
      },
      emphasis: {
        itemStyle: {
          areaColor: "#236f67",
          borderColor: "#e0bd77",
          borderWidth: 1.1,
        },
        label: {
          show: false,
        },
      },
      select: {
        disabled: true,
      },
    },
    series: [
      {
        name: "品牌辉光",
        type: "effectScatter",
        coordinateSystem: "geo",
        zlevel: 2,
        silent: true,
        rippleEffect: {
          period: 4,
          scale: 5.5,
          brushType: "stroke",
        },
        symbolSize(value, params) {
          return 7 + params.data.value[2] / 20;
        },
        data: brands.map((brand) => ({
          name: brand.name,
          value: [...brand.coord, brand.index],
          itemStyle: {
            color: brand.color,
            shadowColor: brand.color,
            shadowBlur: 18,
          },
        })),
      },
      {
        name: "品牌产地",
        type: "custom",
        coordinateSystem: "geo",
        geoIndex: 0,
        zlevel: 3,
        data: brands.map((brand) => [...brand.coord, brand.index]),
        renderItem(params, api) {
          const brand = brands[params.dataIndex];
          const coord = api.coord([
            api.value(0, params.dataIndex),
            api.value(1, params.dataIndex),
          ]);
          if (!coord) return null;

          const rings = [];
          for (let i = 0; i < 4; i++) {
            rings.push({
              type: "circle",
              shape: { cx: 0, cy: 0, r: 27 },
              style: {
                stroke: brand.color,
                fill: "none",
                lineWidth: 1.4,
              },
              keyframeAnimation: {
                duration: 3800,
                loop: true,
                delay: (-i / 4) * 3800,
                keyframes: [
                  {
                    percent: 0,
                    scaleX: 0,
                    scaleY: 0,
                    style: { opacity: 0.86 },
                  },
                  {
                    percent: 1,
                    scaleX: 1.15,
                    scaleY: 0.45,
                    style: { opacity: 0 },
                  },
                ],
              },
            });
          }

          return {
            type: "group",
            x: coord[0],
            y: coord[1],
            children: [
              ...rings,
              {
                type: "path",
                shape: {
                  d: "M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zM16 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z",
                  x: -9,
                  y: -32,
                  width: 18,
                  height: 34,
                },
                style: {
                  fill: brand.color,
                  shadowColor: brand.color,
                  shadowBlur: 13,
                },
                keyframeAnimation: {
                  duration: 1300,
                  loop: true,
                  delay: params.dataIndex * 150,
                  keyframes: [
                    { y: -9, percent: 0.5, easing: "cubicOut" },
                    { y: 0, percent: 1, easing: "bounceOut" },
                  ],
                },
              },
              {
                type: "text",
                x: brand.labelOffset[0],
                y: brand.labelOffset[1],
                style: {
                  text: brand.name,
                  fill: "#f1eee4",
                  font: '600 13px "Microsoft YaHei"',
                  backgroundColor: "rgba(3, 25, 30, 0.78)",
                  borderColor: brand.color,
                  borderWidth: 0.8,
                  borderRadius: 3,
                  padding: [5, 7],
                  shadowColor: "rgba(0,0,0,.45)",
                  shadowBlur: 7,
                },
              },
            ],
          };
        },
      },
    ],
  };

  chart.setOption(option);
  chart.on("mouseover", (params) => {
    if (params.seriesName !== "品牌产地") return;
    document.querySelectorAll(".brand-item").forEach((element, index) => {
      element.classList.toggle("is-active", index === params.dataIndex);
    });
  });
  chart.on("mouseout", () => {
    document.querySelectorAll(".brand-item").forEach((element) => {
      element.classList.remove("is-active");
    });
  });

  const resizeObserver = new ResizeObserver(() => chart.resize());
  resizeObserver.observe(mapElement);
})();
