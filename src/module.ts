import { PieChartCtrl } from './piechart_ctrl';
import { loadPluginCss } from 'grafana/app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/grafana-linechart-panel/styles/dark.css',
  light: 'plugins/grafana-linechart-panel/styles/light.css',
});

export { PieChartCtrl as PanelCtrl };
