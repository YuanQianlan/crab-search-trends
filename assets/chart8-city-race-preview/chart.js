const cities = [
  { name: '上海市', value: 291, color: '#c95708', warm: '#f4a33a', deep: '#a83d06', light: '#ffd09a' },
  { name: '苏州市', value: 280, color: '#d9680b', warm: '#f6aa3f', deep: '#b84a07', light: '#ffdaa1' },
  { name: '泰州市', value: 263, color: '#df7510', warm: '#f8b24b', deep: '#c45708', light: '#ffe0ad' },
  { name: '无锡市', value: 239, color: '#e7881b', warm: '#fac05d', deep: '#cf680f', light: '#ffe6ba' },
  { name: '扬州市', value: 201, color: '#efa247', warm: '#fbd07e', deep: '#d77c22', light: '#ffefcf' }
];

const chart = echarts.init(document.getElementById('chart'), null, { renderer: 'canvas' });
const maxValue = 340;
const title = document.querySelector('h1');

function positionTitle() {
  const outerRadius = 0.79 * Math.min(chart.getWidth(), chart.getHeight()) / 2;
  const circleTop = chart.getHeight() * 0.54 - outerRadius;
  const fiveCentimeters = 5 * 37.7952755906;
  const titleTop = Math.max(0, circleTop - fiveCentimeters - title.offsetHeight);
  title.style.top = `${titleTop}px`;
}

function gaugeSeries(city, index) {
  return {
    name: city.name,
    type: 'gauge',
    center: ['50%', '54%'],
    radius: `${79 - index * 14}%`,
    min: 0,
    max: maxValue,
    startAngle: 90,
    endAngle: -269.999,
    clockwise: true,
    animation: true,
    animationDuration: 8000,
    animationEasing: 'cubicInOut',
    progress: {
      show: true, overlap: false, roundCap: true, clip: false, width: 28,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: city.light },
          { offset: .26, color: city.warm },
          { offset: .62, color: city.color },
          { offset: 1, color: city.deep }
        ]),
        shadowColor: city.color + '4d', shadowBlur: 8
      }
    },
    axisLine: { lineStyle: { width: 28, color: [[1, 'rgba(95,73,49,.12)']] } },
    axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
    pointer: { show: false }, anchor: { show: false }, title: { show: false }, detail: { show: false },
    data: [{ value: city.value, name: city.name }], z: 10 - index
  };
}

chart.setOption({
  animation: true,
  animationDuration: 8000,
  tooltip: {
    trigger: 'item', backgroundColor: 'rgba(255,248,221,.97)', borderColor: '#b77b55',
    textStyle: { color: '#4f3427', fontFamily: 'SimSun' },
    formatter: item => `${item.name}<br><b style="color:${cities[item.seriesIndex].color};font-size:20px">${item.value}</b> 家门店`
  },
  series: cities.map(gaugeSeries)
});

positionTitle();

window.addEventListener('resize', () => {
  chart.resize();
  positionTitle();
});
