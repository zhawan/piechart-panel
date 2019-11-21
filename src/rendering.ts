import _ from 'lodash';
import './lib/jquery.flot.pie';
import $ from 'jquery';
//import './lib/jquery.flot';
import * as d3 from 'd3';

export default function link(scope: any, elem: any, attrs: any, ctrl: any) {
  let data;
  const panel = ctrl.panel;
  elem = elem.find('.heatmapchart-panel__chart');
  // const $tooltip = $('<div id="tooltip">') as any;

  ctrl.events.on('render', () => {
    if (panel.legendType === 'Right side') {
      render(false);
      setTimeout(() => {
        render(true);
      }, 50);
    } else {
      render(true);
    }
  });

  function getLegendHeight(panelHeight: any) {
    // if (!ctrl.panel.legend.show || ctrl.panel.legendType === 'Right side' || ctrl.panel.legendType === 'On graph') {
    //   return 20;
    // }

    // if ((ctrl.panel.legendType === 'Under graph' && ctrl.panel.legend.percentage) || ctrl.panel.legend.values) {
    //   const breakPoint = parseInt(ctrl.panel.breakPoint, 10) / 100;
    //   const total = 23 + 20 * data.length;
    //   return Math.min(total, Math.floor(panelHeight * breakPoint));
    // }

    return 0;
  }

  // function formatter(label: any, slice: any) {
  //   const sliceData = slice.data[0][slice.data[0].length - 1];
  //   let decimal = 2;
  //   const start = `<div style="font-size:${ctrl.panel.fontSize};text-align:center;padding:2px;">${label}<br/>`;

  //   if (ctrl.panel.legend.percentageDecimals) {
  //     decimal = ctrl.panel.legend.percentageDecimals;
  //   }
  //   if (ctrl.panel.legend.values && ctrl.panel.legend.percentage) {
  //     return start + ctrl.formatValue(sliceData) + '<br/>' + slice.percent.toFixed(decimal) + '%</div>';
  //   } else if (ctrl.panel.legend.values) {
  //     return start + ctrl.formatValue(sliceData) + '</div>';
  //   } else if (ctrl.panel.legend.percentage) {
  //     return start + slice.percent.toFixed(decimal) + '%</div>';
  //   } else {
  //     return start + '</div>';
  //   }
  // }

  function noDataPoints() {
    const html = '<div class="datapoints-warning"><span class="small">No data points</span></div>';
    elem.html(html);
  }

  function addPieChart() {
    const width = elem.width();
    const height = ctrl.height - getLegendHeight(ctrl.height);

    const size = Math.min(width, height);

    const plotCanvas = $('<div id="test"></div>');
    const plotCss = {
      margin: 'auto',
      position: 'relative',
      paddingBottom: 20 + 'px',
      height: size + 'px',
    };

    plotCanvas.css(plotCss);

    // const backgroundColor = $('body').css('background-color');

    // const options = {
    //   series: {
    //     // 只针对线的属性
    //     lines: {
    //       // 指定两个点之间是用水平线还是垂直线连接
    //       steps: 0,
    //       show: true,
    //       // 线宽度
    //       lineWidth: 1,
    //       // 是否填充
    //       fill: true,
    //       // 填充色，如rgba(255, 255, 255, 0.8)
    //       fillColor: null,
    //     },
    //     // 设置阴影的大小，0消除阴影
    //     shadowSize: 0,
    //     // 鼠标悬停时的颜色
    //     highlightColor: 1,
    //     //  {
    //     //   pie: {
    //     //     radius: 1,
    //     //     innerRadius: 0,
    //     //     show: true,
    //     //     stroke: {
    //     //       color: backgroundColor,
    //     //       width: parseFloat(ctrl.panel.strokeWidth).toFixed(1),
    //     //     },
    //     //     label: {
    //     //       show: ctrl.panel.legend.show && ctrl.panel.legendType === 'On graph',
    //     //       formatter: formatter,
    //     //     },
    //     //     highlight: {
    //     //       opacity: 0.0,
    //     //     },
    //     //     combine: {
    //     //       threshold: ctrl.panel.combine.threshold,
    //     //       label: ctrl.panel.combine.label,
    //     //     },
    //     //   },
    //     // },
    //   },
    //   grid: {
    //     hoverable: true,
    //     clickable: false,
    //   },
    //   legend: {
    //     show: false,
    //     backgroundOpacity: 0.5,
    //     noColumns: 0,
    //     backgroundColor: 'green',
    //     position: 'ne',
    //   },
    //   xaxes: [{ position: 'bottom' }],
    //   yaxes: [{ position: 'left' }],
    // };

    // if (panel.pieType === 'donut') {
    //   options.series.pie.innerRadius = 0.5;
    // }

    data = ctrl.data;

    // for (let i = 0; i < ctrl.data.length; i++) {
    //   const series = ctrl.data[i];

    //   // if hidden remove points
    //   if (!(ctrl.hiddenSeries[series.label] || ctrl.panel.ignoreColumn.indexOf(series.label) >= 0)) {
    //     data.push(series);
    //   }
    // }

    // if (panel.legend.sort) {
    //   if (ctrl.panel.valueName !== panel.legend.sort) {
    //     panel.legend.sort = ctrl.panel.valueName;
    //   }
    //   if (panel.legend.sortDesc === true) {
    //     data.sort((a: any, b: any) => {
    //       return b.legendData - a.legendData;
    //     });
    //   } else {
    //     data.sort((a: any, b: any) => {
    //       return a.legendData - b.legendData;
    //     });
    //   }
    // }

    elem.html(plotCanvas);

    const margin = { top: 20, right: 20, bottom: 60, left: 60 },
      chartWidth = width - margin.left - margin.right,
      chartHeight = height - margin.top - margin.bottom;
    const chartRoot = d3.select(plotCanvas.get(0));
    chartRoot.selectAll('*').remove();
    const gRoot = chartRoot
      .append('svg')
      .attr('viewBox', '0,0,' + width + ',' + height)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const xArray = d3
      .nest()
      .key((d: any) => {
        return d.x;
      })
      .entries(data)
      .map((d: any) => {
        return d.key;
      })
      .sort();
    const yArray = d3
      .nest()
      .key((d: any) => {
        return d.y;
      })
      .entries(data)
      .map((d: any) => {
        return d.key;
      })
      .sort();
    // const zColor = d3.schemeReds[10];
    let zMin = 0;
    let zMax = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].z > zMax) {
        zMax = data[i].z;
      }
      if (data[i].z < zMin) {
        zMin = data[i].z;
      }
    }
    const z = d3
      .scaleLinear()
      .domain([zMin, zMax])
      .range([200, 1000]);

    const drawSeries = [];
    for (let i = 0; i < data.length; i++) {
      drawSeries.push({
        x: xArray.indexOf(data[i].x),
        y: yArray.indexOf(data[i].y),
        z: data[i].z,
      });
    }
    let rectWidth = chartWidth / xArray.length - 1;
    let rectHeight = chartHeight / yArray.length - 1;
    if (rectWidth <= 0) {
      rectWidth = 1;
    }
    if (rectHeight <= 0) {
      rectHeight = 1;
    }
    gRoot
      .selectAll('.heatRect')
      .data(drawSeries)
      .enter()
      .append('g')
      .attr('class', 'heatRect')
      .attr('transform', d => {
        return 'translate(' + (rectWidth + 2) * d.x + ',' + (rectHeight + 2) * d.y + ')';
      })
      .append('rect')
      .attr('width', rectWidth)
      .attr('height', rectHeight)
      .style('fill', 'red')
      .style('fill-opacity', d => {
        return z(d.z) / 1000;
      })
      .append('title')
      .text(d => {
        return ctrl.panel.x_axis + ' : ' + xArray[d.x] + '\n' + ctrl.panel.y_axis + ' : ' + yArray[d.y] + '\n' + ctrl.panel.z_axis + ' : ' + d.z;
      });
    gRoot
      .selectAll('.heatX')
      .data(xArray)
      .enter()
      .append('g')
      .attr('class', 'heatX')
      .attr('transform', (d, i) => {
        return 'translate(' + (rectWidth + 2) * (i + 0.5) + ',' + (chartHeight + 20) + ')';
      })
      .append('text')
      .attr('class', 'gf-form-label')
      .attr('fill', d3.rgb(125, 125, 125).toString())
      .attr('transform', () => {
        return 'rotate(-45 ' + 0 + ',' + 0 + ')';
      })
      .attr('text-anchor', 'end')
      .text(d => {
        return d.length > 10 ? d.substring(0, 7) + '...' : d;
      })
      .append('title')
      .text(d => {
        return d;
      });
    gRoot
      .selectAll('.heatY')
      .data(yArray)
      .enter()
      .append('g')
      .attr('class', 'heatY')
      .attr('transform', (d, i) => {
        return 'translate(' + 0 + ',' + (rectHeight + 2) * i + ')';
      })
      .append('text')
      .attr('class', 'gf-form-label')
      .attr('text-anchor', 'end')
      .attr('fill', d3.rgb(125, 125, 125).toString())
      .attr('transform', () => {
        return 'rotate(-45 20,' + rectHeight / 2 + ')';
      })
      .text(d => {
        return d.length > 10 ? d.substring(0, 7) + '...' : d;
      })
      .append('title')
      .text(d => {
        return d;
      });

    // @ts-ignore
    // $.plot(plotCanvas, data, options);
    // plotCanvas.bind('plothover', (event: any, pos: any, item: any) => {
    //   if (!item) {
    //     $tooltip.detach();
    //     return;
    //   }

    //   let body;
    //   // const percent = parseFloat(item.series.percent).toFixed(2);
    //   const formatted = ctrl.formatValue(item.series.data[0][1]);

    //   body = '<div class="heatmapchart-tooltip-small"><div class="heatmapchart-tooltip-time">';
    //   body += '<div class="heatmapchart-tooltip-value">' + _.escape(item.series.label) + ': ' + formatted;
    //   // body += ' (' + percent + '%)' ;
    //   body += '</div>';
    //   body += '</div></div>';

    //   $tooltip.html(body).place_tt(pos.pageX + 20, pos.pageY);
    // });
  }

  function render(incrementRenderCounter: any) {
    if (!ctrl.data) {
      return;
    }

    data = ctrl.data;

    if (0 === ctrl.data.length) {
      noDataPoints();
    } else {
      addPieChart();
    }

    if (incrementRenderCounter) {
      ctrl.renderingCompleted();
    }
  }
}
