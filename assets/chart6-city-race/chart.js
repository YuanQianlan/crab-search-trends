const cities = [
  { name: '上海市', value: 291, color: '#4b176f' },
  { name: '苏州市', value: 280, color: '#63258b' },
  { name: '泰州市', value: 263, color: '#7d3faa' },
  { name: '无锡市', value: 239, color: '#9a64c2' },
  { name: '扬州市', value: 201, color: '#bd91d7' }
];

const chart = echarts.init(document.getElementById('chart'), null, { renderer: 'canvas' });
const maxValue = cities[0].value;
const format = new Intl.NumberFormat('zh-CN');
const previewFinal = new URLSearchParams(location.search).get('preview') === 'final';

function gaugeSeries(city, index) {
  return {
    name: city.name,
    type: 'gauge',
    center: ['39%', '52%'],
    radius: `${82 - index * 11}%`,
    min: 0,
    max: maxValue,
    startAngle: 90,
    endAngle: -269.999,
    clockwise: true,
    animation: !previewFinal,
    animationDuration: 16000,
    animationEasing: 'cubicInOut',
    progress: {
      show: true, overlap: false, roundCap: true, clip: false, width: 13,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: '#ead7f4' },
          { offset: .48, color: city.color },
          { offset: 1, color: city.color }
        ]),
        shadowColor: city.color + '66', shadowBlur: 12
      }
    },
    axisLine: { lineStyle: { width: 13, color: [[1, 'rgba(104,51,139,.09)']] } },
    axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
    pointer: { show: false }, anchor: { show: false }, title: { show: false }, detail: { show: false },
    data: [{ value: city.value, name: city.name }],
    z: 10 - index
  };
}

const ranking = [];
cities.forEach((city, index) => {
  const y = index * 76;
  ranking.push(
    { type: 'circle', shape: { cx: 8, cy: y + 15, r: 7 }, style: { fill: city.color } },
    { type: 'text', style: { x: 28, y, text: `${index + 1}　${city.name}`, fill: '#3f2853', font: '700 20px SimSun', verticalAlign: 'top' } },
    { type: 'text', style: { x: 28, y: y + 30, text: `{value|${format.format(city.value)}} {unit|家}`, rich: { value: { fill: city.color, font: '900 27px SimSun' }, unit: { fill: '#715f7e', font: '14px SimSun' } } } }
  );
});

chart.setOption({
  animation: !previewFinal,
  tooltip: {
    trigger: 'item', backgroundColor: 'rgba(255,248,221,.97)', borderColor: '#8f63aa',
    textStyle: { color: '#3f2853', fontFamily: 'SimSun' },
    formatter: p => `${p.name}<br><b style="color:${cities[p.seriesIndex].color};font-size:20px">${format.format(p.value)}</b> 家门店`
  },
  series: cities.map(gaugeSeries),
  graphic: [{
    type: 'group', left: '70%', top: '20%', children: [
      { type: 'text', style: { x: 0, y: -43, text: '城市门店排名', fill: '#51206f', font: '800 21px SimSun' } },
      ...ranking
    ]
  }]
});

window.addEventListener('resize', () => chart.resize());
