const cities = [
  { name: '上海市', value: 291, color: '#cf5700' },
  { name: '苏州市', value: 280, color: '#df6a08' },
  { name: '泰州市', value: 263, color: '#e97e19' },
  { name: '无锡市', value: 239, color: '#f09535' },
  { name: '扬州市', value: 201, color: '#f5ad5b' }
];

const chart = echarts.init(document.getElementById('chart'), null, { renderer: 'canvas' });
const maxValue = 340;
const format = new Intl.NumberFormat('zh-CN');
const previewFinal = new URLSearchParams(location.search).get('preview') === 'final';

function gaugeSeries(city, index) {
  return {
    name: city.name,
    type: 'gauge',
    center: ['38%', '51%'],
    radius: `${85 - index * 14}%`,
    min: 0,
    max: maxValue,
    startAngle: 90,
    endAngle: -269.999,
    clockwise: true,
    animation: !previewFinal,
    animationDuration: 16000,
    animationEasing: 'cubicInOut',
    progress: {
      show: true, overlap: false, roundCap: true, clip: false, width: 24,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: '#ffd09a' },
          { offset: .48, color: city.color },
          { offset: 1, color: city.color }
        ]),
        shadowColor: city.color + '4d', shadowBlur: 10
      }
    },
    axisLine: { lineStyle: { width: 24, color: [[1, 'rgba(205,91,10,.10)']] } },
    axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
    pointer: { show: false }, anchor: { show: false }, title: { show: false }, detail: { show: false },
    data: [{ value: city.value, name: city.name }],
    z: 10 - index
  };
}

const ranking = [];
cities.forEach((city, index) => {
  const y = index * 84;
  ranking.push(
    { type: 'circle', shape: { cx: 8, cy: y + 18, r: 7 }, style: { fill: city.color } },
    { type: 'text', style: { x: 28, y, text: `{rank|${index + 1}}　{city|${city.name}}`, rich: { rank: { fill: city.color, font: '900 25px SimSun' }, city: { fill: '#54300f', font: '900 25px SimSun' } }, verticalAlign: 'top' } },
    { type: 'text', style: { x: 28, y: y + 38, text: `{value|${format.format(city.value)}} {unit|家门店}`, rich: { value: { fill: city.color, font: '900 23px SimSun' }, unit: { fill: '#795333', font: '16px SimSun' } } } }
  );
});

chart.setOption({
  animation: !previewFinal,
  tooltip: {
    trigger: 'item', backgroundColor: 'rgba(255,248,221,.97)', borderColor: '#b77b55',
    textStyle: { color: '#4f3427', fontFamily: 'SimSun' },
    formatter: p => `${p.name}<br><b style="color:${cities[p.seriesIndex].color};font-size:20px">${format.format(p.value)}</b> 家门店`
  },
  series: cities.map(gaugeSeries),
  graphic: [{
    type: 'group', left: '69%', top: '27%', children: [
      { type: 'text', style: { x: 0, y: -60, text: '城市门店排名', fill: '#71310d', font: '900 32px SimSun' } },
      ...ranking
    ]
  }]
});

window.addEventListener('resize', () => chart.resize());
