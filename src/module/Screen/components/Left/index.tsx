import React, { useEffect } from 'react';
import HighCharts from 'highcharts';
import HighCharts3D from 'highcharts/highcharts-3d';
import { pxToPh } from '../../../../utils/unit';
import './index.less';

const Left: React.FC = (props: any) => {
  useEffect(() => {
    getGitlabStatisticeChart();
    getXChart();
  }, []);

  window.addEventListener('resize', function () {
    getGitlabStatisticeChart();
    getXChart();
  });

  const getGitlabStatisticeChart = () => {
    const options: any = {
      chart: {
        type: 'bar',
        backgroundColor: "transparent",
        renderTo: 'gitlab-statistics'
      },
      title: {
        text: null
      },
      xAxis: {
        color: '#fff',
        categories: ['用户a', '用户b', '用户c', '用户d'],
        title: {
          text: null
        },
        labels: {
          style: {
            color: '#9BAFBB'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: null,
          align: 'high'
        },
        gridLineWidth: 0,
        labels: {
          overflow: 'justify',
          style: {
            color: '#9BAFBB'
          }
        }
      },
      tooltip: {
        // valueSuffix: ' 百万'
      },
      colors: ['#0992F5', '#F6B01E'],
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            allowOverlap: true // 允许数据标签重叠
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        // x: 10,
        // y: 50,
        floating: true,
        borderWidth: 1,
        backgroundColor: ((HighCharts.theme && (HighCharts.theme as any).legendBackgroundColor) || 'transparent'),
        shadow: true,
        itemStyle: {
          color: "#fff"
        }
      },
      series: [{
        name: 'commit 次数',
        data: [107, 31, 635, 203]
      }, {
        name: 'code 行数',
        data: [133, 156, 947, 408]
      }],
      credits: {
        enabled: false // 隐藏版权信息
      },
    }
    HighCharts.chart(options);
  }

  const getXChart = () => {
    const option: any = {
      chart: {
        type: 'pie',
        backgroundColor: "transparent",
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0
        },
        renderTo: "xxx"
      },
      title: {
        text: null
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          dataLabels: {
            enabled: false,
            format: '{point.name}',
            distance: 0
            // connectorWidth: 0,
          },
          showInLegend: true
        }
      },
      legend: {
        enabled: true,
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'middle',
        itemStyle: {
          color: '#9BAFBB',
          fontSize: pxToPh(14),
          fontWeight: '100',
        },
        width: pxToPh(180),
      },
      series: [{
        type: 'pie',
        name: '浏览器占比',
        data: [
          ['Firefox', 45.0],
          ['IE', 26.8],
          // {
          //   name: 'Chrome',
          //   y: 12.8,
          //   sliced: true,
          //   selected: true
          // },
          ['Safari', 8.5],
          ['Opera', 6.2],
          ['Others', 0.7]
        ]
      }],
      credits: {
        enabled: false // 隐藏版权信息
      },
      exporting: {
        enabled: false
      },
    }
    HighCharts.chart(option);
    HighCharts3D(HighCharts);
  }

  return (
    <div className='left'>
      <div id="gitlab-statistics"></div>
      <div id="xxx"></div>
    </div>
  )
}

export default Left;