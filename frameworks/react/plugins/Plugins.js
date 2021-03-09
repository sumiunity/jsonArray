/**
 * Pluggin Managements
 * ======================
 *
 * Attemps to import various functionality that is dependent on
 * various modules. When the module is not available, the enable
 * flag is not set, rendering the function not available
 *
 * @author Nik Sumikawa
 * @date Aug 26, 2020
 *
 */

 // import * as echarts from 'echarts';
 // import 'echarts-gl';

export var enabledComponents = {
  echarts: true,
  semanticUI: false,
  excel: false,
}

// attempt to import the react echarts component
export var components = {
  echarts: undefined,
  semanticUI: undefined,
  excel: undefined,
}


try{
  // require("echarts/lib/lang");
  // require.cache[require.resolve('echarts/lib/lang')].exports = require("echarts/lib/langEN");
  // echarts = require('echarts')
  components.echarts = require('./echarts').default
  enabledComponents.echarts = true
}catch{
  // console.log('failed to load echarts. module not installed')
}

try{
  components.semanticUI = require('../framework/SemanticUI').default
  enabledComponents.semanticUI = true
}catch{
  // console.log('failed to load semanticUI. module not installed')
}

try{
  components.excel = require('./Excel').default
  enabledComponents.excel = true
}catch{
  // console.log('failed to load semanticUI. module not installed')
}
