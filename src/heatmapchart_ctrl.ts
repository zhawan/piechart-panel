import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import _ from 'lodash';
import kbn from 'grafana/app/core/utils/kbn';
// @ts-ignore
import TimeSeries from 'grafana/app/core/time_series';
import rendering from './rendering';
import './legend';
// import * as d3 from 'd3';

class HeatmapChartCtrl extends MetricsPanelCtrl {
  static templateUrl = 'module.html';
  $rootScope: any;
  hiddenSeries: any;
  unitFormats: any;
  series: any;
  data: any;

  /** @ngInject */
  constructor($scope: any, $injector: any, $rootScope: any) {
    super($scope, $injector);
    this.$rootScope = $rootScope;
    this.hiddenSeries = {};

    const panelDefaults = {
      x_axis: 'from',
      xColumns: [],
      // pieType: 'pie',
      y_axis: 'to',
      yColumns: [],
      z_axis: 'heat',
      zColumns: [],
      legend: {
        show: false, // disable/enable legend
        values: true,
      },
      links: [],
      datasource: null,
      maxDataPoints: 3,
      interval: null,
      targets: [{}],
      cacheTimeout: null,
      nullPointMode: 'connected',
      legendType: 'Under graph',
      breakPoint: '10%',
      aliasColors: {},
      // format: 'short',
      // valueName: 'current',
      // strokeWidth: 1,
      fontSize: '80%',
      combine: {
        threshold: 0.0,
        label: 'Others',
      },
    };

    _.defaults(this.panel, panelDefaults);
    _.defaults(this.panel.legend, panelDefaults.legend);

    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));

    this.setLegendWidthForLegacyBrowser();
  }

  onInitEditMode() {
    this.addEditorTab('Options', 'public/plugins/grafana-heatmapchart-panel/editor.html', 2);
    this.unitFormats = kbn.getUnitFormats();
  }

  setUnitFormat(subItem: any) {
    this.panel.format = subItem.value;
    this.render();
  }

  onDataError() {
    this.series = [];
    this.render();
  }

  changeSeriesColor(series: any, color: any) {
    series.color = color;
    this.panel.aliasColors[series.alias] = series.color;
    this.render();
  }

  onRender() {
    this.data = this.parseSeries(this.series);
  }

  parseSeries(series: any) {
    const seriesData = [];
    if (series.length > 0) {
      const xProcessed = series.map(this.seriesHandler.bind(this));
      const ddd = xProcessed[0];
      if (ddd) {
        for (let i = 0; i < ddd.length; i++) {
          seriesData.push(ddd[i]);
        }
      }
    }
    return seriesData;
  }

  onDataReceived(dataList: any) {
    const columnOptions: string[] = [];
    for (let i = 0; i < dataList[0].columns.length; i++) {
      columnOptions.push(dataList[0].columns[i].text);
    }
    this.panel.xColumns = columnOptions.slice();
    this.panel.yColumns = columnOptions.slice();
    this.panel.zColumns = columnOptions.slice();

    this.series = dataList;
    this.data = this.parseSeries(this.series);
    this.render(this.data);
  }

  seriesHandler(seriesData: any) {
    // const series = new TimeSeries({
    //   datapoints: seriesData.datapoints,
    //   alias: seriesData.target,
    // });

    // series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
    const series: any[] = [];

    let xIndex = 0;
    let yIndex = 0;
    let zIndex = 0;
    for (let i = 0; i < seriesData.columns.length; i++) {
      if (seriesData.columns[i].text === this.panel.x_axis) {
        xIndex = i;
      }
      if (seriesData.columns[i].text === this.panel.y_axis) {
        yIndex = i;
      }
      if (seriesData.columns[i].text === this.panel.z_axis) {
        zIndex = i;
      }
    }
    for (let i = 0; i < seriesData.rows.length; i++) {
      series.push({
        x: seriesData.rows[i][xIndex],
        y: seriesData.rows[i][yIndex],
        z: seriesData.rows[i][zIndex],
      });
    }
    return series;
  }

  getDecimalsForValue(value: any) {
    if (_.isNumber(this.panel.decimals)) {
      return { decimals: this.panel.decimals, scaledDecimals: null };
    }

    const delta = value / 2;
    let dec = -Math.floor(Math.log(delta) / Math.LN10);

    const magn = Math.pow(10, -dec);
    const norm = delta / magn; // norm is between 1.0 and 10.0
    let size;

    if (norm < 1.5) {
      size = 1;
    } else if (norm < 3) {
      size = 2;
      // special case for 2.5, requires an extra decimal
      if (norm > 2.25) {
        size = 2.5;
        ++dec;
      }
    } else if (norm < 7.5) {
      size = 5;
    } else {
      size = 10;
    }

    size *= magn;

    // reduce starting decimals if not needed
    if (Math.floor(value) === value) {
      dec = 0;
    }

    const result = {
      decimals: 0,
      scaledDecimals: 0,
    };
    result.decimals = Math.max(0, dec);
    result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

    return result;
  }

  formatValue(value: any) {
    const decimalInfo = this.getDecimalsForValue(value);
    const formatFunc = kbn.valueFormats[this.panel.format];
    if (formatFunc) {
      return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
    }
    return value;
  }

  link(scope: any, elem: any, attrs: any, ctrl: any) {
    rendering(scope, elem, attrs, ctrl);
  }

  toggleSeries(serie: any) {
    if (this.hiddenSeries[serie.label]) {
      delete this.hiddenSeries[serie.label];
    } else {
      this.hiddenSeries[serie.label] = true;
    }
    this.render();
  }

  onLegendTypeChanged() {
    this.setLegendWidthForLegacyBrowser();
    this.render();
  }

  setLegendWidthForLegacyBrowser() {
    // @ts-ignore
    const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    if (isIE11 && this.panel.legendType === 'Right side' && !this.panel.legend.sideWidth) {
      this.panel.legend.sideWidth = 150;
    }
  }
}

export { HeatmapChartCtrl, HeatmapChartCtrl as MetricsPanelCtrl };
