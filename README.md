# Crab Search Trends

2011—2026 年各省份大闸蟹与河蟹搜索总量联动可视化。

## 页面

- `index.html`：当前正式图表。
- `chart2.html`：后续图表 2 的独立页面。
- `chart3.html`：后续图表 3 的独立页面。

所有页面共用：

- `assets/chart.css`：字体、页面与悬浮提示样式。
- `assets/province-data.js`：省份年度数据。
- `assets/chart-runtime.js`：ECharts 初始化和联动逻辑。
- ECharts 5.6.0 CDN。

每个页面自己的配置位于 `charts/chart1.js`、`charts/chart2.js`、
`charts/chart3.js`。后续在对应文件加入完整的 `option` 对象，即可换成
完全不同的 ECharts 图表，无需新建仓库或网站。
