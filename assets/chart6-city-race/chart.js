const cities = [
  { name: '上海市', value: 291, color: '#8f4827' },
  { name: '苏州市', value: 280, color: '#a55a34' },
  { name: '泰州市', value: 263, color: '#b96e45' },
  { name: '无锡市', value: 239, color: '#cb855c' },
  { name: '扬州市', value: 201, color: '#dca17c' }
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
    radius: `${86 - index * 13.5}%`,
    min: 0,
    max: maxValue,
    startAngle: 90,
    endAngle: -269.999,
    clockwise: true,
    animation: !previewFinal,
    animationDuration: 16000,
    animationEasing: 'cubicInOut',
    progress: {
      show: true, overlap: false, roundCap: true, clip: false, width: 18,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: '#edd2b8' },
          { offset: .48, color: city.color },
          { offset: 1, color: city.color }
        ]),
        shadowColor: city.color + '4d', shadowBlur: 10
      }
    },
    axisLine: { lineStyle: { width: 18, color: [[1, 'rgba(135,73,39,.09)']] } },
    axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
    pointer: { show: false }, anchor: { show: false }, title: { show: false }, detail: { show: false },
    data: [{ value: city.value, name: city.name }],
    z: 10 - index
  };
}

const ranking = [];
cities.forEach((city, index) => {
  const y = index * 78;
  ranking.push(
    { type: 'circle', shape: { cx: 8, cy: y + 16, r: 6 }, style: { fill: city.color } },
    { type: 'text', style: { x: 26, y, text: `{rank|${index + 1}}　{city|${city.name}}`, rich: { rank: { fill: city.color, font: '800 22px SimSun' }, city: { fill: '#4f3427', font: '800 22px SimSun' } }, verticalAlign: 'top' } },
    { type: 'text', style: { x: 26, y: y + 34, text: `{value|${format.format(city.value)}} {unit|家门店}`, rich: { value: { fill: city.color, font: '800 21px SimSun' }, unit: { fill: '#796357', font: '15px SimSun' } } } }
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
    type: 'group', left: '69%', top: '18%', children: [
      { type: 'text', style: { x: 0, y: -54, text: '城市门店排名', fill: '#6f3b24', font: '900 28px SimSun' } },
      ...ranking
    ]
  }]
});

window.addEventListener('resize', () => chart.resize());
