const incomeData = [
  { year: 2010, value: 390 },
  { year: 2011, value: 432 },
  { year: 2012, value: 476 },
  { year: 2013, value: 518 },
  { year: 2014, value: 555 },
  { year: 2015, value: 592 },
  { year: 2016, value: 635 },
  { year: 2017, value: 678 },
  { year: 2018, value: 715 },
  { year: 2019, value: 746 },
  { year: 2020, value: 662 },
  { year: 2021, value: 705 },
  { year: 2022, value: 743 },
  { year: 2023, value: 778 },
  { year: 2024, value: 795 },
  { year: 2025, value: 824 }
];

const chart = echarts.init(document.getElementById('chart'), null, { renderer: 'canvas' });
const numberFormat = new Intl.NumberFormat('zh-CN');
const startAngle = 220;
const endAngle = -40;
let currentIndex = 0;
let timer = null;

function incomeForYear(year) {
  const index = Math.max(0, Math.min(incomeData.length - 1, Math.round(year) - 2010));
  return incomeData[index].value;
}

function gaugeData(index) {
  const item = incomeData[index];
  return [{ id: 'income-pointer', value: item.year, name: '全产业链销售收入' }];
}

function yearColor(index) {
  const ratio = index / (incomeData.length - 1);
  if (ratio <= 0.33) return '#48cbd0';
  if (ratio <= 0.72) return '#2f9ed4';
  return '#f45360';
}

function yearGraphics() {
  const width = chart.getWidth();
  const height = chart.getHeight();
  const centerX = width * 0.5;
  const centerY = height * 0.55;
  const gaugeRadius = Math.min(width, height) * 0.44;
  const labelRadius = gaugeRadius - 55;

  return incomeData.map((item, index) => {
    const ratio = index / (incomeData.length - 1);
    const angle = (startAngle + (endAngle - startAngle) * ratio) * Math.PI / 180;
    const x = centerX + Math.cos(angle) * labelRadius;
    const y = centerY - Math.sin(angle) * labelRadius;
    const active = index === currentIndex;
    return {
      id: `year-${item.year}`,
      type: 'group',
      x,
      y,
      z: 30,
      cursor: 'pointer',
      onclick: () => selectYear(index, true),
      children: [
        {
          type: 'circle',
          shape: { cx: 0, cy: 0, r: 19 },
          style: { fill: active ? 'rgba(255,255,255,.78)' : 'rgba(255,255,255,0)' }
        },
        {
          type: 'text',
          style: {
            x: 0,
            y: 0,
            text: String(item.year),
            fill: active ? yearColor(index) : '#52616a',
            font: `${active ? '900' : '700'} ${active ? 17 : 14}px "Times New Roman"`,
            align: 'center',
            verticalAlign: 'middle'
          }
        }
      ]
    };
  });
}

chart.setOption({
  animation: true,
  animationDuration: 1600,
  animationDurationUpdate: 800,
  animationEasingUpdate: 'cubicInOut',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(250,242,230,.97)',
    borderColor: '#8da2ae',
    textStyle: { color: '#27333c', fontFamily: '"Times New Roman", SimSun' },
    formatter: params => `${Math.round(params.value)}年<br>全产业链销售收入：<b>${numberFormat.format(incomeForYear(params.value))} 亿元</b>`
  },
  graphic: yearGraphics(),
  series: [{
    type: 'gauge',
    center: ['50%', '55%'],
    radius: '88%',
    min: 2010,
    max: 2025,
    splitNumber: 15,
    startAngle,
    endAngle,
    axisLine: {
      roundCap: true,
      lineStyle: {
        width: 36,
        color: [
          [0.33, '#67e0e3'],
          [0.72, '#37a2da'],
          [1, '#fd666d']
        ]
      }
    },
    pointer: {
      show: true,
      length: '62%',
      width: 13,
      itemStyle: { color: 'auto' }
    },
    anchor: {
      show: true,
      showAbove: true,
      size: 22,
      itemStyle: { color: '#27333c', borderColor: '#FAF2E6', borderWidth: 5 }
    },
    axisTick: {
      distance: -36,
      splitNumber: 2,
      length: 9,
      lineStyle: { color: '#FAF2E6', width: 2 }
    },
    splitLine: {
      distance: -36,
      length: 34,
      lineStyle: { color: '#FAF2E6', width: 3 }
    },
    axisLabel: { show: false },
    title: { show: false },
    detail: {
      valueAnimation: true,
      offsetCenter: [0, '54%'],
      color: 'inherit',
      fontFamily: '"Times New Roman", SimSun',
      fontSize: 38,
      fontWeight: 900,
      formatter: year => `${numberFormat.format(incomeForYear(year))} 亿元`
    },
    data: gaugeData(0)
  }]
});

function selectYear(index, stopPlayback = false) {
  if (stopPlayback) stopAutoPlay();
  currentIndex = index;
  chart.setOption(
    {
      graphic: yearGraphics(),
      series: [{ data: gaugeData(index) }]
    },
    { replaceMerge: ['graphic'] }
  );
}

function startAutoPlay() {
  stopAutoPlay();
  timer = window.setInterval(() => {
    if (currentIndex >= incomeData.length - 1) {
      stopAutoPlay();
      return;
    }
    selectYear(currentIndex + 1);
  }, 1200);
}

function stopAutoPlay() {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
}

selectYear(0);
startAutoPlay();
window.addEventListener('resize', () => {
  chart.resize();
  chart.setOption({ graphic: yearGraphics() }, { replaceMerge: ['graphic'] });
});
