(function () {
  "use strict";

  const fontFamily = '"Times New Roman","SimSun","宋体",serif';
  const chart = echarts.init(document.getElementById("chart"), null, { renderer: "canvas" });

  const palette = {
    root: "#7D928A",
    farming: "#AFC0AD",
    processing: "#D9A6A0",
    sales: "#C8B99A",
    tourism: "#9FB4C6",
    leaf: "#FFFFFF"
  };

  function job(name, task, detail) {
    return {
      name: name + "｜" + task,
      jobName: name,
      task: task,
      detail: detail,
      value: 1,
      itemStyle: {
        color: palette.leaf,
        borderColor: "#AFA69B",
        borderWidth: 1.2
      },
      label: {
        color: "#3f3f3b",
        fontSize: 14,
        fontWeight: 600
      }
    };
  }

  function stage(name, color, children) {
    return {
      name: name,
      value: children.length,
      children: children,
      itemStyle: {
        color: color,
        borderColor: "#6F7D76",
        borderWidth: 1.4
      },
      label: {
        color: "#2f3c39",
        fontSize: 17,
        fontWeight: 700
      }
    };
  }

  const data = {
    name: "就业岗位",
    value: 22,
    itemStyle: {
      color: palette.root,
      borderColor: "#5F6E68",
      borderWidth: 1.6
    },
    label: {
      color: "#25322f",
      fontSize: 19,
      fontWeight: 700
    },
    children: [
      stage("养殖生产环节", palette.farming, [
        job("蟹农", "投喂巡塘", "产业最基础的岗位，负责塘口日常养殖管理，包括投喂、水质监测、病害防治和成熟期捕捞等。"),
        job("蟹苗培育员", "育苗选苗", "负责亲本管理、苗种培育、规格筛选和放养前健康检查，为后续养殖提供稳定蟹苗。"),
        job("水质管理员", "测水调水", "定期检测溶氧、酸碱度、氨氮等指标，并通过换水、增氧和调水保持塘口环境稳定。"),
        job("饲料配给员", "配料投饵", "根据生长阶段、天气和摄食情况制定投喂量，控制饲料浪费并保障大闸蟹规格提升。"),
        job("病害防控员", "巡查防病", "负责塘口巡查、异常记录、病害预警和防治协同，降低养殖损耗。"),
        job("捕捞分拣员", "起捕分级", "在上市期完成起捕、初步分级、暂养和转运衔接，保证活蟹品质。")
      ]),
      stage("加工环节", palette.processing, [
        job("清洗工", "清洗去杂", "负责原料蟹清洗、去杂和初检，确保进入加工线的产品符合卫生要求。"),
        job("分级工", "称重分级", "按照重量、规格、完整度和品质进行分级，为礼盒、熟制或深加工提供标准化原料。"),
        job("熟制工", "蒸煮控温", "负责蒸煮、控温、计时和出锅检查，保证熟制产品口感和食品安全。"),
        job("包装工", "装盒封签", "完成装盒、贴标、封签、防震和冷链前检查，提升产品标准化与运输稳定性。"),
        job("质检员", "检验留样", "负责感官检查、批次记录、留样和食品安全抽检，保障加工产品可追溯。")
      ]),
      stage("流通与销售环节", palette.sales, [
        job("采购员", "议价收蟹", "对接养殖户和基地，完成询价、看样、议价、收货和质量确认。"),
        job("冷链仓管员", "入库保鲜", "负责入库登记、温控管理、暂养保鲜、批次盘点和出库交接。"),
        job("物流配送员", "打包配送", "负责保温包装、路线衔接、时效跟踪和到货反馈，降低运输损耗。"),
        job("电商运营", "上架推广", "负责产品上架、活动策划、内容推广、订单跟进和平台数据分析。"),
        job("门店销售员", "接待售卖", "负责线下接待、规格介绍、称重售卖、售后记录和顾客维护。"),
        job("品牌客服", "答疑售后", "负责订单咨询、食用指导、物流异常处理和售后反馈。")
      ]),
      stage("文旅与服务环节", palette.tourism, [
        job("研学讲解员", "讲解导览", "面向游客和学生讲解大闸蟹养殖、加工、品牌和地域文化，提升产业认知。"),
        job("餐饮厨师", "烹制出餐", "负责大闸蟹菜品研发、烹制出餐、口味控制和后厨食品安全。"),
        job("体验活动员", "组织体验", "组织捕蟹、品蟹、手作和节庆活动，提升游客参与度。"),
        job("文创设计员", "设计包装", "负责礼盒、海报、文创产品和展陈视觉设计，强化品牌表达。"),
        job("游客服务员", "接待协调", "负责预约、引导、咨询、投诉处理和现场秩序维护。")
      ])
    ]
  };

  chart.setOption({
    backgroundColor: "#FAF2E6",
    animationDuration: 650,
    animationDurationUpdate: 700,
    textStyle: {
      fontFamily: fontFamily,
      color: "#3f3f3b"
    },
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove|click",
      confine: true,
      backgroundColor: "rgba(255,250,243,.98)",
      borderColor: "#b9ad9f",
      borderWidth: 1,
      padding: [12, 15],
      extraCssText: "max-width:360px;white-space:normal;line-height:1.72;box-shadow:0 8px 22px rgba(80,68,56,.16);border-radius:7px;",
      textStyle: {
        color: "#3f3f3b",
        fontFamily: fontFamily,
        fontSize: 14
      },
      formatter: function (params) {
        const d = params.data || {};
        if (d.detail) {
          return "<b>" + d.jobName + "</b><br>任务：" + d.task + "<br>" + d.detail;
        }
        if (d.children) {
          return "<b>" + d.name + "</b><br>包含岗位：" + d.value + " 类";
        }
        return d.name || "";
      }
    },
    series: [
      {
        type: "tree",
        data: [data],
        orient: "LR",
        top: "3%",
        left: "7%",
        bottom: "2%",
        right: "18%",
        symbol: "roundRect",
        symbolSize: [14, 8],
        roam: false,
        expandAndCollapse: true,
        initialTreeDepth: 3,
        edgeShape: "polyline",
        edgeForkPosition: "50%",
        lineStyle: {
          color: "#9A9187",
          width: 1.5,
          curveness: 0.15
        },
        label: {
          position: "left",
          verticalAlign: "middle",
          align: "right",
          distance: 10,
          fontFamily: fontFamily,
          color: "#3f3f3b",
          fontSize: 15
        },
        leaves: {
          label: {
            position: "right",
            verticalAlign: "middle",
            align: "left",
            distance: 12,
            fontFamily: fontFamily,
            color: "#3f3f3b",
            fontSize: 14
          }
        },
        emphasis: {
          focus: "descendant",
          label: {
            fontWeight: 700
          }
        }
      }
    ]
  });

  window.addEventListener("resize", function () {
    chart.resize();
  });
})();
