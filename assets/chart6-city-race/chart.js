const cities = [
  { name: '上海市', value: 291, color: '#cf5700', rankColor: '#7a2a00' },
  { name: '苏州市', value: 280, color: '#df6a08', rankColor: '#8d3500' },
  { name: '泰州市', value: 263, color: '#e97e19', rankColor: '#a34200' },
  { name: '无锡市', value: 239, color: '#f09535', rankColor: '#b85308' },
  { name: '扬州市', value: 201, color: '#f5ad5b', rankColor: '#c86b19' }
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
    radius: `${86 - index * 15}%`,
    min: 0,
    max: maxValue,
    startAngle: 90,
    endAngle: -269.999,
    clockwise: true,
    animation: !previewFinal,
    animationDuration: 16000,
    animationEasing: 'cubicInOut',
    progress: {
      show: true, overlap: false, roundCap: true, clip: false, width: 32,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: '#ffd09a' },
          { offset: .48, color: city.color },
          { offset: 1, color: city.color }
        ]),
        shadowColor: city.color + '4d', shadowBlur: 10
      }
    },
    axisLine: { lineStyle: { width: 32, color: [[1, 'rgba(205,91,10,.10)']] } },
    axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
    pointer: { show: false }, anchor: { show: false }, title: { show: false }, detail: { show: false },
    data: [{ value: city.value, name: city.name }],
    z: 10 - index
  };
}

const ranking = [];

function landmarkIcon(index, y, color) {
  const fill = { fill: color };
  const stroke = { stroke: color, lineWidth: 3, lineCap: 'round' };
  const icons = [
    [
      { type: 'line', shape: { x1: 21, y1: 1, x2: 21, y2: 57 }, style: stroke },
      { type: 'circle', shape: { cx: 21, cy: 14, r: 5 }, style: fill },
      { type: 'circle', shape: { cx: 21, cy: 31, r: 9 }, style: fill },
      { type: 'polygon', shape: { points: [[15,57],[27,57],[24,40],[18,40]] }, style: fill }
    ],
    [
      { type: 'rect', shape: { x: 4, y: 4, width: 11, height: 50, r: 2 }, style: fill },
      { type: 'rect', shape: { x: 27, y: 4, width: 11, height: 50, r: 2 }, style: fill },
      { type: 'bezierCurve', shape: { x1: 14, y1: 49, cpx1: 18, cpy1: 36, cpx2: 24, cpy2: 36, x2: 28, y2: 49 }, style: stroke },
      { type: 'rect', shape: { x: 13, y: 4, width: 16, height: 7 }, style: fill }
    ],
    [
      { type: 'rect', shape: { x: 13, y: 42, width: 16, height: 13 }, style: fill },
      { type: 'polygon', shape: { points: [[6,42],[36,42],[30,34],[12,34]] }, style: fill },
      { type: 'rect', shape: { x: 16, y: 23, width: 10, height: 11 }, style: fill },
      { type: 'polygon', shape: { points: [[9,23],[33,23],[27,15],[15,15]] }, style: fill },
      { type: 'polygon', shape: { points: [[16,15],[26,15],[21,3]] }, style: fill },
      { type: 'rect', shape: { x: 5, y: 55, width: 32, height: 4 }, style: fill }
    ],
    [
      { type: 'circle', shape: { cx: 21, cy: 10, r: 6 }, style: fill },
      { type: 'polygon', shape: { points: [[17,17],[25,17],[29,35],[26,54],[16,54],[13,35]] }, style: fill },
      { type: 'line', shape: { x1: 15, y1: 24, x2: 4, y2: 36 }, style: stroke },
      { type: 'line', shape: { x1: 27, y1: 24, x2: 38, y2: 36 }, style: stroke },
      { type: 'rect', shape: { x: 10, y: 54, width: 22, height: 5 }, style: fill }
    ],
    [
      { type: 'rect', shape: { x: 12, y: 41, width: 18, height: 14 }, style: fill },
      { type: 'polygon', shape: { points: [[5,41],[37,41],[31,32],[11,32]] }, style: fill },
      { type: 'rect', shape: { x: 16, y: 21, width: 10, height: 11 }, style: fill },
      { type: 'polygon', shape: { points: [[9,21],[33,21],[21,6]] }, style: fill },
      { type: 'rect', shape: { x: 19, y: 1, width: 4, height: 7 }, style: fill },
      { type: 'rect', shape: { x: 5, y: 55, width: 32, height: 4 }, style: fill }
    ]
  ];
  return { type: 'group', x: 0, y: y + 1, children: icons[index] };
}

cities.forEach((city, index) => {
  const y = index * 88;
  ranking.push(
    landmarkIcon(index, y, city.rankColor),
    { type: 'text', style: { x: 56, y, text: `{rank|${index + 1}}　{city|${city.name}}`, rich: { rank: { fill: city.rankColor, font: '900 26px SimSun' }, city: { fill: '#54300f', font: '900 25px SimSun' } }, verticalAlign: 'top' } },
    { type: 'text', style: { x: 56, y: y + 39, text: `{value|${format.format(city.value)}} {unit|家门店}`, rich: { value: { fill: city.color, font: '900 23px SimSun' }, unit: { fill: '#795333', font: '16px SimSun' } } } }
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
  graphic: [
    {
      type: 'group', left: '38%', top: '45%', children: [
        { type: 'text', style: { x: 0, y: -26, text: '全国大闸蟹专营门店', fill: '#71310d', font: '900 23px SimSun', align: 'center' } },
        { type: 'text', style: { x: 0, y: 9, text: '城市集聚度{top|TOP5}', fill: '#71310d', font: '900 23px SimSun', align: 'center', rich: { top: { fill: '#71310d', font: '900 23px Times New Roman' } } } }
      ]
    },
    {
      type: 'group', left: '65%', top: '25%', children: [
        { type: 'text', style: { x: 0, y: -64, text: '城市门店排名', fill: '#71310d', font: '900 33px SimSun' } },
        ...ranking
      ]
    }
  ]
});

window.addEventListener('resize', () => chart.resize());
